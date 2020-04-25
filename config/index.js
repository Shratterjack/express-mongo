const MongoClient = require('mongodb').MongoClient;

const user = encodeURIComponent(process.env.username);
const password = encodeURIComponent(process.env.password);
const host = encodeURIComponent(process.env.host);
const database = encodeURIComponent(process.env.database);
const port = encodeURIComponent(process.env.port);
// const authDB = encodeURIComponent(process.env.authSource);
const authMechanism = 'DEFAULT';

// Connection URL
// const url = `mongodb://${user}:${password}@${host}:${port}/${database}?authMechanism=${authMechanism}&authSource=${authDB}`;
const url = `mongodb://${user}:${password}@${host}:${port}?authMechanism=${authMechanism}`;

// Create a new MongoClient
const mongoClient = new MongoClient(url,{ useUnifiedTopology: true });



// Use connect method to connect to the Server
// function getConnection(params=null){
    const mongoConn = mongoClient.connect()
        .then((client) => {
            console.log("Connected correctly to server");
            const db = client.db(database);
            return new Promise(function (resolve, reject) {
                resolve(db);
            });
        })
        .catch(err => console.log(err));





function closeConnection(){
    client.close();
}
 




module.exports = { mongoConn, closeConnection }
