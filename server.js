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
       switch(path) {

           case '/user-profile':
               console.log('User profile');

               dataProvider.getProfile('',
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
       }
    }

    if (req.method == 'POST') {

        switch(path) {
            case '/auth':
                console.log('Authenticate');

                let _hash = [];

                req.on('data', (chunk) => _hash.push(chunk));

                req.on('end', () => {
                    _hash = _hash.toString();
                    console.log(_hash);
                    dataProvider.authenticate(_hash,
                        (data, token) => {
                            res.writeHead(200, 'Access granted', {'x-data-token': token});
                            res.end(data);
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

                let _data = [];

                req.on('data', (chunk) => _data.push(chunk));

                req.on('end', () => {
                    _data = JSON.parse(_data.toString());
                    console.log('data', _data);
                    dataProvider.register(_data,
                        (result) => {
                            res.writeHead(200, 'Account successfully created', {'x-data-token': 'thisIsAPlaceholderToken'});
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