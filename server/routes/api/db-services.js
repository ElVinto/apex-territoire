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

async function execQuery(queryTxt,params=[] ) {
    
    let pool;
    let conn;
    let rows;
    try {
        pool = mariadb.createPool(dbConnectionConfig());
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
        if (pool){
            pool.end();
            return rows;
        }
    }
}


router.post('/login', function(req, res, next) {

    if (req.body.transaction === "select_useremail"){
        /*
        req.body = 
        {
	        "transaction": "select_useremail",
	        "useremail": "baptiste.oger@supagro.fr"
        }
        */
       let useremail = req.body.useremail.replace("'").replace('"');
        const queryTxt = 'SELECT * FROM user WHERE email = "'+useremail+'"';
        
        console.log(queryTxt);

        execQuery(queryTxt).then(rows => {
            // console.log(rows);
            return res.json(rows)
        });

    }
});


router.get('/',  function(req, res, next) {

    if(req.query.useremail === undefined){
        res.send(" Please define a useremail to get request");
    }else{

        let queryTxt ="";

        queryTxt +=' SELECT o.apexValue as obsvLabel, o.date as obsvDateInMs, o.latitude as obsvLat, o.longitude as obsvLng', 
        queryTxt +=' , s.nomParcelle as parcelName, s.globalLatitude as parcelLat, s.globalLongitude as parcelLng'
        queryTxt +=' , s.moyenne as sessionAvgGrowth, s.date as sessionDateInSec'
        queryTxt +=' , u.name as userName, u.idUser as userId, u.email as userEMail ' 
        queryTxt +=' FROM user u, session s, observation o'
        queryTxt +=' WHERE s.userId = u.idUser and s.idSession = o.sessionId'
        queryTxt +=' and o.latitude != 0 and o.longitude != 0 and s.globalLatitude !=0 and s.globalLongitude !=0'
        queryTxt +=' and u.email = '+req.query.useremail;

        console.log(queryTxt)

        execQuery(queryTxt).then(rows => res.json(rows));

    }
});

router.post('/', function(req, res, next) {

    // OBSERVATIONS

    if (req.body.transaction === "select_observations"){
 
        /*
         {
             "transaction": "select_observations",
             "useremail": "baptiste.oger@supagro.fr"
         }
         */
       
        console.log(req.body);

        let queryTxt ="";

        queryTxt +=' SELECT o.apexValue as obsvLabel, o.date as obsvDateInMs, o.latitude as obsvLat, o.longitude as obsvLng', 
        queryTxt +=' , s.nomParcelle as parcelName, s.globalLatitude as parcelLat, s.globalLongitude as parcelLng'
        queryTxt +=' , s.moyenne as sessionAvgGrowth, s.date as sessionDateInSec'
        queryTxt +=' , u.name as userName, u.idUser as userId, u.email as userEMail ' 
        queryTxt +=' FROM user u, session s, observation o'
        queryTxt +=' WHERE s.userId = u.idUser and s.idSession = o.sessionId'
        queryTxt +=' and o.latitude != 0 and o.longitude != 0 and s.globalLatitude !=0 and s.globalLongitude !=0'
        queryTxt +=' and u.email = "'+req.body.useremail+'"';

        console.log(queryTxt)

        execQuery(queryTxt).then(rows => res.json(rows));

    }

    if (req.body.transaction === "select_sharedobservations"){
 
        /*
         {
             "transaction": "select_sharedobservations",
             "dataOwnerEMail": "baptiste.oger@supagro.fr"
            , "parcelName": " dummy parcel"
         }
         */
       
        console.log(req.body);

        let queryTxt ="";

        queryTxt +=' SELECT o.apexValue as obsvLabel, o.date as obsvDateInMs, o.latitude as obsvLat, o.longitude as obsvLng', 
        queryTxt +=' , s.nomParcelle as parcelName, s.globalLatitude as parcelLat, s.globalLongitude as parcelLng'
        queryTxt +=' , s.moyenne as sessionAvgGrowth, s.date as sessionDateInSec'
        queryTxt +=' , u.name as userName, u.idUser as userId, u.email as userEMail ' 
        queryTxt +=' FROM user u, session s, observation o'
        queryTxt +=' WHERE s.userId = u.idUser and s.idSession = o.sessionId'
        queryTxt +=' and o.latitude != 0 and o.longitude != 0 and s.globalLatitude !=0 and s.globalLongitude !=0'
        queryTxt +=' and u.email = "'+req.body.dataOwnerEMail+'"';
        queryTxt +=' and s.nomParcelle = "'+req.body.parcelName+'"';

        console.log(queryTxt)

        execQuery(queryTxt).then(rows => res.json(rows));

    }




    // MODIFIED WEEK METRICS

    if (req.body.transaction === "select_modifiedweekmetrics"){
        /*
        req.body = 
        {
	        "transaction": "select_modifiedweekmetrics",
	        "userEMail": "baptiste.oger@supagro.fr"
        }
        */

       console.log(req.body);

        const queryTxt = " SELECT * FROM modifiedweekmetrics WHERE dataUserEMail = '"+req.body.userEMail+"'";

        console.log(queryTxt);

        execQuery(queryTxt).then(rows => res.json(rows));
    }

    if (req.body.transaction === "alter_modifiedweekmetrics") {
        /*
        req.body = 
        {
            "transaction": "alter_modifiedweekmetrics"
            , "dataUserEMail": "baptiste.oger@supagro.fr"
            , "dataOwnerEMail": "baptiste.oger@supagro.fr"
            , "parcelName": " dummy parcel"
            , "yearNumber": 2019
            , "weekNumber": 22
            , "nbObsFullGrowth": 25
            , "nbObsSlowGrowth": 15
            , "nbObsStoppedGrowth": 10
            , "dateTimeInMs": 1585269934625
        }
        */

    //    console.log(req.body);

        let queryTxt = "INSERT INTO modifiedweekmetrics (dataUserEMail, dataOwnerEMail, parcelName, yearNumber, weekNumber, nbObsFullGrowth, nbObsSlowGrowth, nbObsStoppedGrowth, dateTimeInMs) ";
        queryTxt += " VALUES ('"+req.body.dataUserEMail+"', '" +req.body.dataOwnerEMail+"',  '" + req.body.parcelName+"', " + req.body.yearNumber+", " + req.body.weekNumber+",  " + req.body.nbObsFullGrowth+", " + req.body.nbObsSlowGrowth+", " + req.body.nbObsStoppedGrowth+", " +  req.body.dateTimeInMs+")" 
                +" ON DUPLICATE KEY UPDATE"
                +" nbObsFullGrowth = " +req.body.nbObsFullGrowth
                +" , nbObsSlowGrowth = "+req.body.nbObsSlowGrowth
                +" , nbObsStoppedGrowth = "+req.body.nbObsStoppedGrowth
                +", dateTimeInMs = "+req.body.dateTimeInMs+" ;";

        console.log(queryTxt);

        execQuery(queryTxt).then(rows => res.json(rows));
            
    }


    

    // PARCELDATASHARING

    if (req.body.transaction === "select_parceldatasharing"){
        /*
        req.body = 
        {
	        "transaction": "select_parceldatasharing",
	        "userEMail": "baptiste.oger@supagro.fr"
        }
        */

       console.log(req.body);

        const queryTxt = " SELECT * FROM parceldatasharing WHERE dataUserEMail = '"+req.body.userEMail+"'";

        console.log(queryTxt);

        execQuery(queryTxt).then(rows => res.json(rows));
    }

    if (req.body.transaction === "insert_parceldatasharing") {
        /*
        req.body = 
        {
            "transaction": "insert_parceldatasharing"
            , "dataUserEMail": "baptiste.oger@supagro.fr"
            , "dataOwnerEMail": "Toto@tu.ti"
            , "parcelName": " dummy parcel"
        }
        */

    //    console.log(req.body);

        let queryTxt = "INSERT INTO parceldatasharing (dataUserEMail, dataOwnerEMail, parcelName) ";
        queryTxt += " VALUES ('"+req.body.dataUserEMail+"', '" +req.body.dataOwnerEMail+"',  '" + req.body.parcelName+"')";

        console.log(queryTxt);

        execQuery(queryTxt).then(rows => res.json(rows));
            
    }


});




router.delete('/', function(req, res, next) {

    if (req.body.transaction === "delete_modifiedweekmetrics") {
        /*
        {
            "transaction": "delete_modifiedweekmetrics"
            , "dataUserEMail": "baptiste.oger@supagro.fr"
            , "dataOwnerEMail": "baptiste.oger@supagro.fr"
            , "parcelName": " dummy parcel"
            , "yearNumber": 2019
            , "weekNumber": 22
        }
        */
    //    console.log(req.body);

        const queryTxt ="DELETE FROM modifiedweekmetrics WHERE" 
            +" dataUserEMail = '"+req.body.dataUserEMail+"'"
            +" and dataOwnerEMail =  '"+req.body.dataOwnerEMail+"'"
            +" and parcelName = '" +req.body.parcelName+"'"
            +" and yearNumber = " +req.body.yearNumber
            +" and weekNumber = " +req.body.weekNumber ;

        console.log(queryTxt);
        
        execQuery(queryTxt).then(rows => res.json(rows));

    }

    if (req.body.transaction === "delete_parceldatasharing") {
        /*
        {
            "transaction": "delete_parceldatasharing"
            , "dataUserEMail": "Toto@tu.ti"
            , "dataOwnerEMail": "baptiste.oger@supagro.fr"
            , "parcelName": " dummy parcel"
        }
        */
    //    console.log(req.body);

        const queryTxt ="DELETE FROM parceldatasharing WHERE" 
            +" dataUserEMail = '"+req.body.dataUserEMail+"'"
            +" and dataOwnerEMail =  '"+req.body.dataOwnerEMail+"'"
            +" and parcelName = '" +req.body.parcelName+"'"
           ;

        console.log(queryTxt);
        
        execQuery(queryTxt).then(rows => res.json(rows));

    }

});





module.exports = router;
