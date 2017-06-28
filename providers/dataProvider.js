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

DataProvider.authenticate = function(hash, callback, error) {
    console.log('DataProvider.authenticate', hash);

    let query = 'SELECT ID, permissionLvl FROM user WHERE hash =' + database.escape(hash);

    database.query('SELECT * FROM user', (err, result, fields) => { console.log(result); });

    database.query(query, (err, result, fields) => {
        if (err) {
            console.log(err);
            return error(err);
        }

        DataProvider.createToken((token) => {
            console.log('Created token: ', token);
            console.log('Result: ', result);

            let response = {'data': result, '_token': token};

            callback(JSON.stringify(response));
        });

    });
};

DataProvider.getProfile = function(userId, callback, error) {
    console.log('DataProvider.getProfile', userId);
    console.log('userId', userId);
    let query = 'SELECT * FROM user WHERE ID =' + database.escape(userId);

    database.query(query, (err, result, fields) => {
        if (err) {
            console.log(err);
            return error(err);
        }

        result = JSON.stringify(result);

        callback(result);
    });
};

DataProvider.register = function(data, callback, error) {
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
        if (err)  {
            console.log(err);
            return error();
        }

        DataProvider.createToken((token) => {
            console.log('Created token: ', token);
            console.log('Result: ', result);

            let response = {'data': result, '_token': token};

            callback(JSON.stringify(response));
        });
    });

};

DataProvider.changeAccountSettings = function(data, callback, error) {
    console.log('DataProvider.changeAccountSettings');

    let query = 'UPDATE user SET hash=' + database.escape(data.newHash) + ' WHERE hash =' + database.escape(data.hash);

    // Validate existing hash before updating it to the new request
    database.query('SELECT hash FROM user WHERE hash =' + database.escape(data.hash), (err, result) => {
        let confirmedHash = result[0];
        console.log('hash result:', confirmedHash);
        if (!confirmedHash || confirmedHash.hash !== data.hash) return error('The current password you submitted is wrong');
    });

    // Update old email/pass hash with new one
    database.query(query, (err, result, fields) => {
        if (err) {
            console.log(err);
            return error(err);
        }

        callback('Account settings were successfully changed');
    });
};

DataProvider.deleteAccount = function(userId, callback, error) {
    console.log('DataProvider.deleteAccount', userId);

    let query = 'DELETE FROM user WHERE ID =' + database.escape(userId);

    database.query(query, (err, result, fields) => {
        if (err) {
            console.log(err);
            return error(err);
        }

        callback('Your account has been deleted');
    });
};

DataProvider.getChat = function(userId, partnerId, callback, error) {
  console.log('DataProvider.getChat', 'userId: ' + userId + ', partnerId: ' + partnerId);

  let query = 'SELECT * FROM message WHERE userID =' + database.escape(userId) + ' OR userID=' + database.escape(partnerId)
      + 'AND participant= ' + database.escape(userId) + ' OR participant=' + database.escape(partnerId);

  database.query(query, (err, result, fields) => {
     if (err) {
         console.log(err);
         return error(err);
     }

     console.log('result: ', result);
     callback(JSON.stringify(result));
  });

};

DataProvider.sendMessage = function(data, callback, error) {
    console.log('DataProvider.sendMessage', data);

    let query = 'INSERT INTO message (userID, participant, message, creationDate) VALUES(' +
        database.escape(data.userId) + ', ' +
            database.escape(data.partnerId) + ', ' +
            database.escape(data.text) + ', ' +
            database.escape(data.creationDate) + ')';

    database.query(query, (err, result, fields) => {
        if (err) {
            console.log(err);
            return error(err);
        }

        callback('Message was successfully changed');
    });
}

module.exports = DataProvider;