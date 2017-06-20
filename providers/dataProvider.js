const mysql = require('mysql');
const CrudProvider = require('./crudProvider');
const DataProvider = {};

let database = mysql.createConnection({
    host: '192.168.1.77',
    user: 'root',
    password: 'admins',
    database: 'lighthouse'
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

    let token = btoa(new Date().getTime());

    callback(token);

};

DataProvider.authenticate = function(hash, callback, err) {
    console.log('DataProvider.authenticate', hash);

    let user = {
        'userId': 1,
        'firstName': 'Liam',
        'lastName': 'Neeson',
        'age': 61,
        'description': 'I dont know who you are. I dont know what you want',
        'interests': 'Killing people who hurt his daughter'
    };

    // TODO: CRUD request and then return token
    // if hash (emailPassHash) matches database, return user and get a token. Otherwise return an error.

    let query = 'SELECT * FROM user WHERE hash =' + database.escape(hash);

    database.query(query, (err, result, fields) => {
        if (err) throw err;

        DataProvider.createToken((token) => {
            console.log('Created token: ', token);
            console.log('Result: ', result);
            callback(result, token);
        });

    });
};

DataProvider.getProfile = function(userId, callback, err) {
    console.log('DataProvider.getProfile', userId);

    let _response = {
        'userId': 1,
        'firstName': 'Liam',
        'lastName': 'Neeson',
        'age': 61,
        'description': 'I dont know who you are. I dont know what you want',
        'interests': 'Killing people who hurt his daughter',
        'matches':['Xena', 'Wonder Woman', 'Jessica Jones'],
        'photos':['image_01.jpg', 'image_02.jpg', 'image_03.jpg'],
        'partnerPreferences': {
            'travel': true,
            'sports': false,
            'movies': false,
            'goingOut': true
        }
    };

    // TODO: CRUD request

    if (_response) callback(JSON.stringify(_response));
    else err('No access for you.');
};

DataProvider.register = function(data, callback, err) {
    console.log('DataProvider.register', data.firstName + ' ' + data.lastName);

    let _response = {
        'userId': 2,
        'firstName': 'John',
        'lastName': 'Wick',
        'age': 53,
        'description': 'Most badass of all badasses',
        'interests': 'Killing people who hurt his dog',
        'matches':['Xena', 'Wonder Woman', 'Jessica Jones'],
        'photos':[data.photos[0]],
        'partnerPreferences': {
            'travel': true,
            'sports': true,
            'movies': true,
            'goingOut': false
        }
    };

    // TODO: CRUD request

    if (data) callback(JSON.stringify(_response));
    else err('Unable to register your account.');
};

module.exports = DataProvider;