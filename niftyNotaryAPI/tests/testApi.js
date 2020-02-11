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
    doc: 'hello world', // mod this to use an actual file, cos we will have to deal with
    docType: 'text',    // should probs be utf 8 or something like that
    userId: 'foo@example.com', // consider making random types
    userIdType: 'email', // need to create hard coded types in the receiving code
    token: 'somesecrettobedone',
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

it('Should post data', () => {
    superagent
        .post('http://localhost:3600/notarise')
        .set('Content-Type', 'application/json')
        .send(content)
        .then((res) => {
            console.log(res.body);
            // assertiosn here
            // do some comparisons here!?? is that the right thing to do
            // can always rewrite in furture, just need to take this approach just to get the ball rolling
        })
        .catch((e) => {
           console.log('exception', e)
        })
});

it('Should retrieve hash', () => {
   // or maybe we could check it directly from the application
   // need to do this anyway...
});