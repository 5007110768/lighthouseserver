// Dependencies
const http = require('http');
const url = require('url');

const port = process.env.PORT || 3001;

// Providers
const dataProvider = require('./providers/dataProvider.js');

let server = http.createServer((req, res) => {
    let path = url.parse(req.url, true).pathname;
    let params = url.parse(req.url, true).query;

    if (req.method == 'GET') {
        console.log(path);

        let userId = params['userId'];

        switch(path) {
           case '/user-profile':
               console.log('User profile');

               dataProvider.getProfile(userId,
                   (result) => {
                       res.writeHead('200', 'User profile retrieval success');
                       res.end(result);
                   },
                   (err) => {
                       console.error('Error:', err);
                       res.writeHead(401, 'Access denied');
                       res.end();
                   }
               );
               break;

            case '/delete-account':
                console.log('User profile');

                dataProvider.deleteAccount(userId,
                    (result) => {
                        res.writeHead('200', result);
                        res.end(result);
                    },
                    (err) => {
                        console.error('Error:', err);
                        res.writeHead(401, err);
                        res.end();
                    }
                );
                break;
        }
    }

    if (req.method == 'POST') {

        let _data = [];

        switch(path) {
            case '/auth':
                console.log('Authenticate');

                req.on('data', (chunk) => _data.push(chunk));

                req.on('end', () => {
                    _data = _data.toString();
                    console.log(_data);
                    dataProvider.authenticate(_data,
                        (result) => {
                            res.writeHead(200, 'Access granted');
                            res.end(result);
                        },
                        (err) => {
                            console.error('Error:', err);
                            res.writeHead(401, 'Access denied');
                            res.end(err);
                        }
                    );
                });
                break;

            case '/register':
                console.log('Register');

                req.on('data', (chunk) => _data.push(chunk));

                req.on('end', () => {
                    _data = JSON.parse(_data.toString());
                    console.log('data', _data);
                    dataProvider.register(_data,
                        (result) => {
                            res.writeHead(200, 'Account successfully created');
                            res.end(result);
                        },
                        (err) => {
                            console.error('Error:', err);
                            res.writeHead(401, 'Access denied');
                            res.end(err);
                        }
                    );
                });
                break;

            case '/change-account-settings':
                console.log('Change account settings');

                req.on('data', (chunk) => _data.push(chunk));

                req.on('end', () => {
                    console.log(_data.toString());
                    _data = JSON.parse(_data.toString());
                    console.log('data', _data);
                    dataProvider.changeAccountSettings(_data,
                        (result) => {
                            res.writeHead(200, 'Account details successfully changed');
                            res.end(result);
                        },
                        (err) => {
                            console.error('Error:', err);
                            res.writeHead(401, 'Access denied');
                            res.end(err);
                        }
                    );
                });
                break;
        }
    }

}).listen(port);

console.log('Running Lighthouse server on port ', port);