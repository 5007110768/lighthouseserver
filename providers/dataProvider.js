const CrudProvider = require('./crudProvider');
const DataProvider = {};

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


    // If crud request is succss:
    DataProvider.createToken((token) => {
        console.log('Created token: ', token);
        callback(user, token);
    };
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