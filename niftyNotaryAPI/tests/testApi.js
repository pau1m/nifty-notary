const frisby = require('frisby');
const superagent = require('superagent');



// create object -- do we also need mocha for this and chai
// const config = {
//   url: 'http://localhost
//port: 3600
// };
// this should already be in base64
// cos its easier to send
// where should the hash be created...
// maybe that should be done further upstream...
//base64encoded

const content = {
    doc: makeId(200), // mod this to use an actual file, cos we will have to deal with
    docType: 'text',    // should probs be utf 8 or something like that
    userId: 'feoseo@example.com', // consider making random types
    userIdType: 'email', // need to create hard coded types in the receiving code
    token: 'somesecrettobedone',
};

//let dbid  = '';

// !!! @todo pull in the actual types used on the db



//@todo also have to deal with auth
//@todo should we prepend path

// it('should be a teapot', () => {
//     // Return the Frisby.js Spec in the 'it()' (just like a promise)
//     return frisby.get('http://httpbin.org/status/418')
//         .expect('status', 418);
// });


// @todo --- we should add accept to this

// should be wrapped in describe

// @todo --- now to assertions...


it('Should post and get data', () => {
    superagent
        .post('http://localhost:3600/notarise')
        .set('Content-Type', 'application/json')
        .send(content)
        .then((res) => {
            superagent
                .get('http://localhost:3600/notarise/getById/'+res.body.dbId)
                .set('Content-Type', 'application/json')
                .then((res2) => {
                    // assert stuff here
                    console.log('res2: ', res2.body);
                })

            superagent
                .get('http://localhost:3600/notarise/getTxByTxId/'+res.body.txId)
                .set('Content-Type', 'application/json')
                .then((res3) => {
                    // assert stuff here
                    console.log('res3: ', res3.body);
                })
        })
        .catch((e) => {
           console.log('exception: ', e)
        })
});

function makeId(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


// hmmmmm
// maybe I should test through postman instead

// it('Should retrieve data', () => {
//     // cons
//     console.log('wtf')
//     superagent
//         .get('http://localhost:3600/notarise/dbid/'+dbid)
//         .set('Content-Type', 'application/json')
//         .then    (() => {
//             console.log(then);
//         })
//
//    // or maybe we could check it directly from the application
//    // need to do this anyway...
// });