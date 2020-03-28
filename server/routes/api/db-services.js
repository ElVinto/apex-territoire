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
            console.log("Nunber of returned rows "+rows.length);
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
        queryTxt +=' , u.name as userName' 
        queryTxt +=' FROM User u, Session s, Observation o'
        queryTxt +=' WHERE s.userId = u.idUser and s.idSession = o.sessionId'
        queryTxt +=' and o.latitude != 0 and o.longitude != 0 and s.globalLatitude !=0 and s.globalLongitude !=0'
        queryTxt +=' and u.id =  ? ';
        
        const params =[req.query.userId];
        execQuery(queryTxt,req.query.userId).then(rows => res.json(rows));

    }
});





module.exports = router;
