const mysql = require('mysql');
const CrudProvider = require('./crudProvider');
const DataProvider = {};

let database = mysql.createConnection({
    host: 'oege.ie.hva.nl',
    user: 'jansenj031',
    password: 'kKy+tS.GzMIP6e',
    database: 'zjansenj031'
});

database.connect((err) => {
    if (err) {
        console.error('Error while connecting to database: ' + err.stack);
        return;
    }
    console.log('Successfully connected to database as: ', database.threadId);
});

DataProvider.createToken = function(callback) {
    console.log('DataProvider.createToken');

    let token = new Date().getTime().toString();
    token = new Buffer(token).toString('base64');

    callback(token);

};

DataProvider.authenticate = function(hash, callback, err) {
    console.log('DataProvider.authenticate', hash);

    let query = 'SELECT ID, permissionLvl FROM user WHERE hash =' + database.escape(hash);

    database.query('SELECT * FROM user', (err, result, fields) => { console.log(result); });

    database.query(query, (err, result, fields) => {
        if (err) throw err;

        DataProvider.createToken((token) => {
            console.log('Created token: ', token);
            console.log('Result: ', result);

            let response = {'data': result, '_token': token};

            callback(JSON.stringify(response));
        });

    });
};

DataProvider.getProfile = function(userId, callback, err) {
    console.log('DataProvider.getProfile', userId);
    console.log('userId', userId);
    let query = 'SELECT * FROM user WHERE ID =' + database.escape(userId);

    database.query(query, (err, result, fields) => {
        if (err) throw err;

        result = JSON.stringify(result);

        callback(result);
    });
};

DataProvider.register = function(data, callback, err) {
    console.log('DataProvider.register', data.firstName + ' ' + data.lastName);

    let query = 'INSERT INTO user (firstName, lastName, email, gender, dateOfBirth, description, permissionLvl, hash) ' +
        'VALUES (' +
        '"' + data.firstName + '",' +
        '"' + data.lastName + '",' +
        '"' + data.email + '",' +
        '"' + data.gender + '",' +
        '"' + data.dateOfBirth + '",' +
        '"' + data.description + '",' +
        '"' + data.permissionLvl + '",' +
        '"' + data._hash + '"'
        + ')';

    database.query(query, (err, result, fields) => {
        if (err) throw err;

        DataProvider.createToken((token) => {
            console.log('Created token: ', token);
            console.log('Result: ', result);

            let response = {'data': result, '_token': token};

            callback(JSON.stringify(response));
        });
    });

};

module.exports = DataProvider;