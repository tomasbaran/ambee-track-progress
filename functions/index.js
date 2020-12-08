const functions = require('firebase-functions');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


const express = require('express');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
const sensitive = require('./sensitive.js');
var cors = require('cors');


const app = express();

// app.use(cors({
//     origin: 'http://yourapp.com'

// }));

var allowedOrigins = ['http://localhost:8081',
    'https://progress.ambee.app'];
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin 
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000
app.post('/subscribe', (req, res, next) => {

    console.log('stringify', JSON.stringify(req.body));
    console.log('req.body: ', req.body);
    //console.log('req.body.email', req.body.email);

    (async function () {
        try {
            const mailerLiteResponse = await fetch('https://api.mailerlite.com/api/v2/groups/' + sensitive.groupId + '/subscribers', {
                method: 'POST',
                mode: 'Cors',
                headers: {
                    'content-type': 'application/json',
                    'X-MailerLite-ApiKey': sensitive.apiKey,
                },
                body: JSON.stringify(req.body)

            });


            const responseJson = await mailerLiteResponse.json();

            res.status(mailerLiteResponse.status).send(mailerLiteResponse.body);

            console.log('mailer response: ', responseJson);
        } catch (err) {
            return next(err)
        }
    })();
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})

exports.app = functions.https.onRequest(app);
