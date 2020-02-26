// const frisby = require('frisby');
const superagent = require('superagent');
const { assert, expect } = require('chai');
const config = require('../common/config/env.config')
//@todo
//create new and user  db and then trash db
//const createUser = require('./createUser');



// @todo proper start up and tear down

//

// how do we add out default admin user

// mocha.timeout(5000);
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
//@todo look at jest for better unit testing of express code - split app in launching of app so can pass it in
const content = {
    file: makeId(200), // mod this to use an actual file, cos we will have to deal with
    fileType: 'text/plain',    // should probs be utf 8 or something like that
    //  hashType: 'sha256',
    // token: 'somesecrettobedone',
};

// create a hash to put in

// !!! @todo pull in the actual types used on the db
//@todo also have to deal with auth
//@todo should we prepend path

// it('should be a teapot', () => {
//     // Return the Frisby.js Spec in the 'it()' (just like a promise)
//     return frisby.get('http://httpbin.org/status/418')
//         .expect('status', 418);
// });


// before each
// do a login



// @todo --- we should add accept to this
// should be wrapped in describe
// @todo --- now to assertions...
//@todo end point for just user
// does a user really want to attach it to their name
// can start to consider refactoring of contracta
// erc721 no reason not to use that above all else...

//@todo we might have a nonce race condition here
// @todo update end points
// pull in details from config

// could actually move that whole test thing in here!!!!

// uhm.... why does it get locked up here when adding

 describe('API Happy Path', () => {
   // assumes we have already created user --- using that as a script so ... hmmm how also to use here...
   // on launching tests can add function to run in the backgrounf an dcreate user
   // for the moment
   // today all tests....
   // consider using frisby
   //
   // const testUserId = config.testUserId
   //


   //console.log(createUser)

   // const user = createUser();
   // let authToken = {};
   // // @todo get auth id
   // // @todo write full suite of tests
   //


   const authRequest = {
       email: config.testEmail,
       password: config.testPassword
     //  userId: config.testUserI
   };

   let jwt = {}


   // add asserts ... still consider using frisby



   before('login and fetch token', (done) => {
     const result = superagent
       .post('http://localhost:3600/auth')
       .send(authRequest)
       .then((res) => {
         jwt = res.body;
         console.log(res.body)
         done()
       })
       .catch((err) => {
         console.log(err)
         done()
       });
   });

   it('should do nothing', (done) => {
     done();
   })

   // it('Should post and get data by file hash', (done) => {
   //   console.log('jwt: ', jwt)
   //   superagent
   //     .post('http://localhost:3600/notarise/file')
   //     .set({ Authorization: 'Bearer ' + jwt.accessToken })
   //     .set('Content-Type', 'application/json')
   //     .send(content)
   //     .then((res) => {
   //      //@todo assert object exists
   //       superagent
   //         .get('http://localhost:3600/notarised/getByHash/  ' + res.body.fileHash)
   //         .set({ Authorization: 'Bearer ' + jwt.accessToken })
   //         .set('Content-Type', 'application/json')
   //         .then((fileHashRes) => {
   //           assert(fileHashRes.id === res.id);
   //           assert(fileHashRes.fileHash === res.fileHash);
   //           assert(fileHashRes.txId === res.txId);
   //           done();
   //         })
   //         .catch((e) => {
   //           assert(false)
   //           //console.log('Something went wrong: ', e)
   //           done()
   //         })
   //     })
   //     .catch((e) => {
   //       assert(false)
   //       //console.log('exception: ', e);
   //       done();
   //     })
   // });

   // perhaps should factor out call and redo
   // or do before each!?
   it('Should post and get data by db id', (done) => {
     superagent
       .post('http://localhost:3600/notarise/file')
       .set({ Authorization: 'Bearer ' + jwt.accessToken })
       .set('Content-Type', 'application/json')
       .send(content)
       .then((res) => {
        //@todo assert object exists
         superagent
           .get('http://localhost:3600/notarised/getById/  ' + res.body.id)
           .set({ Authorization: 'Bearer ' + jwt.accessToken })
           .set('Content-Type', 'application/json')
           .then((idRes) => {
             assert(idRes.id === res.id);
             assert(idRes.fileHash === res.fileHash);
             assert(idRes.txId === res.txId);
             done();
           })
           .catch((e) => {
             done();
           })
       })
       .catch((e) => {
         done()
         // console.log('exception: ', e)
       })
       //.end();
   });

   it('Should post and get data by txId', (done) => {
     superagent
       .post('http://localhost:3600/notarise/file')
       .set({ Authorization: 'Bearer ' + jwt.accessToken })
       .set('Content-Type', 'application/json')
       .send(content)
       .then((res) => {
         //@todo assert object exists
         superagent
           .get('http://localhost:3600/notarised/getByTxId/  ' + res.body.txId)
           .set({ Authorization: 'Bearer ' + jwt.accessToken })
           .set('Content-Type', 'application/json')
           .then((txIdRes) => {
             assert(txIdRes.id === res.id);
             assert(txIdRes.fileHash === res.fileHash);
             assert(txIdRes.txId === res.txId);
             done();
           })
           .catch((e) => {
             done()
           })
       })
       .catch((e) => {
         done()
       })
   });
/*
   it("Should post a hash", (done) => {
     done();
   });
 */

 });

function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

