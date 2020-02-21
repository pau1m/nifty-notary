// const frisby = require('frisby');
const superagent = require('superagent');
const { assert, expect } = require('chai')

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
//@todo end point for just user
// does a user really want to attach it to their name
// can start to consider refactoring of contracta
// erc721 no reason not to use that above all else...
// @todo update end points
 describe('API Happy Path', () => {
   it('Should post and get data by file hash', (done) => {
     superagent
       .post('http://localhost:3600/notarise/file')
       .set('Content-Type', 'application/json')
       .send(content)
       .then((res) => {
         // console.log(res);
         // assert stuff
         superagent
           .get('http://localhost:3600/notarised/getByHash/  ' + res.body.fileHash)
           .set('Content-Type', 'application/json')
           .then((fileHashRes) => {
             assert(fileHashRes.id === res.id);
             assert(fileHashRes.fileHash === res.fileHash);
             assert(fileHashRes.txId === res.txId);
             console.log('asserted');
             done();
           })
           .catch((e) => {
             console.log('Something went wrong: ', e)
           })
       })
       .catch((e) => {
         console.log('exception: ', e);
         done()
       })
   });

   it('Should post and get data by db id', (done) => {
     superagent
       .post('http://localhost:3600/notarise/file')
       .set('Content-Type', 'application/json')
       .send(content)
       .then((res) => {
         // console.log(res);
         // assert stuff
         superagent
           .get('http://localhost:3600/notarised/getById/  ' + res.body.id)
           .set('Content-Type', 'application/json')
           .then((idRes) => {
             assert(idRes.id === res.id);
             assert(idRes.fileHash === res.fileHash);
             assert(idRes.txId === res.txId);
             console.log('asserted');
             done();
           })
           .catch(done)
       })
       .catch((e) => {
         done()
         // console.log('exception: ', e)
       })
   });

   it('Should post and get data by txId', (done) => {
     superagent
       .post('http://localhost:3600/notarise/file')
       .set('Content-Type', 'application/json')
       .send(content)
       .then((res) => {
         // console.log(res);
         // assert stuff
         superagent
           .get('http://localhost:3600/notarised/getByTxId/  ' + res.body.txId)
           .set('Content-Type', 'application/json')
           .then((txIdRes) => {
             assert(txIdRes.id === res.id);
             assert(txIdRes.fileHash === res.fileHash);
             assert(txIdRes.txId === res.txId);
             console.log('asserted');
             done();
           })
           .catch((e) => {
             done(e)
           })
       })
       .catch((e) => {
         done()
       })
   });

   it("Should post a hash", (done) => {
     done();
   });

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

