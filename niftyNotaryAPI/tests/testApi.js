const frisby = require('frisby');
const superagent = require('superagent');



// create object -- do we also need mocha for this and chai
// const config = {
//   url: 'http://localhost
//port: 3600
// };

const content = {
    file: 'hello world', // mod this to use an actual file, cos we will have to deal with
    fileType: 'text',    // should probs be utf 8 or something like that
    userId: 'foo@example.com', // consider making random types
    userIdType: 'email', // need to create hard coded types in the receiving code
    token: 'somesecrettobedone',
};


//@todo also have to deal with auth
//@todo should we prepend path

it('should be a teapot', () => {
    // Return the Frisby.js Spec in the 'it()' (just like a promise)
    return frisby.get('http://httpbin.org/status/418')
        .expect('status', 418);
});

it('Should post data', () => {
    superagent
        .post('http://localhost:3600/notarise')
        .set('Content-Type', 'application/json')
        .send(content)
        .then((res) => {
            console.log(res);
            // assertiosn here
            // do some comparisons here!?? is that the right thing to do
            // can always rewrite in furture, just need to take this approach just to get the ball rolling
        })
});

it('Should retrieve hash', () => {
   // or maybe we could check it directly from the application
   // need to do this anyway...
});