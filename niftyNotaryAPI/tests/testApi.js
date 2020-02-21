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
    // userId: 'feoseo@example.com', // consider making random types
    // userIdType: 'email', // need to create hard coded types in the receiving code
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
// describe('API', () => {
    it('Should post and get data', (done) => {
      superagent
            .post('http://localhost:3600/notarise/file')
            .set('Content-Type', 'application/json')
            .send(content)
            .then(async (res) => {
                console.log(res);
                // assert stuff
                await superagent
                  .get('http://localhost:3600/notarised/getByHash/' + res.body.fileHash)
                  .set('Content-Type', 'application/json')
                  .then((res4) => {
                      // assert stuff here
                      console.log('res4: ', res4.body);
                      done();
                  })
                  .catch(done)

                // superagent
                //     .get('http://localhost:3600/notarise/getById/' + res.body.dbId)
                //     .set('Content-Type', 'application/json')
                //     .then((res2) => {
                //         // assert stuff here
                //         console.log('res2: ', res2.body);
                //     });

                // superagent
                //     .get('http://localhost:3600/notarised/getTxByTxId/' + res.body.txId)
                //     .set('Content-Type', 'application/json')
                //     .then((res3) => {
                //         // assert stuff here
                //         console.log('res3: ', res3.body);
                //     });
            })
            .catch((e) => {
                console.log('exception: ', e)
            })
    });



    // We dont need all the bits of content
// it('Should post and get simple adata', () => {
//     superagent
//       .post('http://localhost:3600/notarise')
//       .set('Content-Type', 'application/json')
//       .send(content)
//       .then((res) => {
//           // assert stuff
//
//           superagent
//             .get('http://localhost:3600/notarise/getById/' + res.body.dbId)
//             .set('Content-Type', 'application/json')
//             .then((res2) => {
//                 // assert stuff here
//                 console.log('res2: ', res2.body);
//             });
//
//           superagent
//             .get('http://localhost:3600/notarise/getTxByTxId/' + res.body.txId)
//             .set('Content-Type', 'application/json')
//             .then((res3) => {
//                 // assert stuff here
//                 console.log('res3: ', res3.body);
//             });
//       })
//       .catch((e) => {
//           console.log('exception: ', e)
//       })
// });
// });

function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

