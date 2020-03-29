var express = require('express');
var router = express.Router();

const mariadb = require('mariadb');
require('dotenv').config()
const { URL } = require('url');

const dbConnectionConfig = () => {

    let urlElmts;

    // Developpemnet mode
    if (process.env.DATABASE_URL){
        // in DEV DATABASE_URL="mysql://varmant:varmant@localhost:3306/agrotic_apex" 
        urlElmts = new URL(process.env.DATABASE_URL);
    }
    
    // Production mode
    if (process.env.CLEARDB_DATABASE_URL){ 
        // CLEARDB_DATABASE_URL="TO CREATE"
        urlElmts = new URL(process.env.CLEARDB_DATABASE_URL);
    }

    return {
        user: urlElmts.username,
        password: urlElmts.password,
        host: urlElmts.hostname,
        port: urlElmts.port,
        database: urlElmts.pathname.replace('/', '')
    }
}

const pool = mariadb.createPool(dbConnectionConfig());

async function execQuery(queryTxt,params) {
    let conn;
    let rows;
    try {
        conn = await pool.getConnection();
        rows = await conn.query(queryTxt,params);

        if(rows.affectedRows !== undefined){
            console.log(rows);
        }else{
            console.log("Number of returned rows "+rows.length);
        }

    } catch (err) {
        throw err;
    } finally {
        if (conn){
            conn.end();
            return rows;
        }
    }
}


router.get('/',  function(req, res, next) {

    if(req.query.userId === undefined){
        res.send(" Please define a userId to get request");
    }else{

        let queryTxt ="";

        queryTxt +=' SELECT o.apexValue as obsvLabel, o.date as obsvDateInMs, o.latitude as obsvLat, o.longitude as obsvLng'
        queryTxt +=' , s.nomParcelle as parcelName, u.name as ownerName, s.globalLatitude as parcelLat, s.globalLongitude as parcelLng'
        queryTxt +=' , s.moyenne as sessionAvgGrowth, s.date as sessionDateInSec'
        queryTxt +=' , u.name as userName, u.idUser as userId, u.email as userMail ' 
        queryTxt +=' FROM User u, Session s, Observation o'
        queryTxt +=' WHERE s.userId = u.idUser and s.idSession = o.sessionId'
        queryTxt +=' and o.latitude != 0 and o.longitude != 0 and s.globalLatitude !=0 and s.globalLongitude !=0'
        queryTxt +=' and u.id =  ? ';
        
        const params =[req.query.userId];
        execQuery(queryTxt,req.query.userId).then(rows => res.json(rows));

    }
});

router.post('/', function(req, res, next) {

    if (req.body.transaction === "select_weekmetrics"){
        /*
        req.body = 
        {
	        "transaction": "select_weekmetrics",
	        "userId": 14
        }
        */
        const queryTxt = " SELECT * FROM weekmetrics WHERE userId = ?";
        const params =[req.body.userId];
        execQuery(queryTxt,params).then(rows => res.json(rows));
    }


    if (req.body.transaction === "insert_weekmetrics") {

        /*
        req.body = 
        {
            "transaction": "insert_weekmetrics"
            , "userId": 14
            , "parcelName": "dummy parcel"
            , "yearNumber": 2019
            , "weekNumber": 22
            , "weekLabel": "dummy  week"
            , "nbObsFullGrowth": 25
            , "nbObsSlowGrowth": 25
            , "nbObsStoppedGrowth": 0
            , "dateTimeInMs": 1585269934625
        }
        */
       
       let queryTxt = "INSERT INTO weekmetrics (userId,parcelName,yearNumber,weekNumber,weekLabel,nbObsFullGrowth,nbObsSlowGrowth,nbObsStoppedGrowth,dateTimeInMs) VALUE (?,?,?,?,?,?,?,?,?)";
       let params = [
        req.body.userId
        , req.body.parcelName
        , req.body.yearNumber
        , req.body.weekNumber
        , req.body.weekLabel
        , req.body.nbObsFullGrowth
        , req.body.nbObsSlowGrowth
        , req.body.nbObsStoppedGrowth
        , req.body.dateTimeInMs
        ];
        execQuery(queryTxt,params).then(rows => res.json(rows));

    }


    if (req.body.transaction === "update_weekmetrics") {
        /*
        req.body = 
        {
            "transaction": "update_weekmetrics"
            , "userId": 14
            , "parcelName": " dummy parcel"
            , "yearNumber": 2019
            , "weekNumber": 22
            , "weekLabel": "dummy  week"
            , "nbObsFullGrowth": 25
            , "nbObsSlowGrowth": 15
            , "nbObsStoppedGrowth": 10
            , "dateTimeInMs": 1585269934625
        }
        */
            let queryTxt = "UPDATE weekmetrics SET weekLabel=?, nbObsFullGrowth=?, nbObsSlowGrowth=?, nbObsStoppedGrowth=?, dateTimeInMs=? WHERE userId=? and parcelName=? and yearNumber=? and weekNumber=? ;" ;

            let params = [
                req.body.weekLabel
                , req.body.nbObsFullGrowth
                , req.body.nbObsSlowGrowth
                , req.body.nbObsStoppedGrowth
                , req.body.dateTimeInMs

                , req.body.userId
                , req.body.parcelName
                , req.body.yearNumber
                , req.body.weekNumber
            ];
            execQuery(queryTxt,params).then(rows => res.json(rows));params.push();
            
    }


    // TODO interesting example of insert and if the key is present then update 
    // INSERT INTO weekmetrics (userId,parcelName,yearNumber,weekNumber, nbObsFullGrowth) VALUES (u,p,y,w,nbObsF) ON DUPLICATE KEY UPDATE nbObsFullGrowth=VALUES(nbObsF)

});




router.delete('/', function(req, res, next) {

    if (req.body.transaction === "delete_weekmetrics") {
        /*
        body = {
            transaction: "delete_weekmetrics"
            , userId: varchar(50)
            , parcelName: varchar(50) 
            , yearNumber: int(11)
            , weekNumber: int(11)
        }
        */

        
        const queryTxt ="DELETE FROM weekmetrics WHERE userId=? and parcelName=? and yearNumber=? and weekNumber=?";
        const params = [req.body.userId, req.body.parcelName, req.body.yearNumber, req.body.weekNumber];
            
        execQuery(queryTxt,params).then(rows => res.json(rows));

    }
});





module.exports = router;
