const superagent = require('superagent');
const { assert, expect } = require('chai');
const config = require('../common/config/env.config');
const crypto = require('crypto');
//@todo refactor: de-duplicate

//create new and user  db and then trash db
//const createUser = require('./createUser');
// @todo
// other tests
// test user access
// test end points
// make sure swagger matches api
// @todo add contractId to response, make it a unqiue field...
// @todo how to deal with....
// @todo,,, wait, this could be a springboard to any nft contract

// if we change content as a function this will work....

const content = () => {
  return {
    file: makeId(200), // mod this to use an actual file, cos we will have to deal with
    hashType: 'sha3-256',
    link: 'https://ipfs.io/ipfs/Qmc5gCcjYypU7y28oCALwfSvxCBskLuPKWpK4qpterKC7z',
  }
};

const itemHash = () => '0x' + crypto.createHash('sha3-256').update(content()['file']).digest('hex');

// need to make sure we add the
const signHash = async (itemHash, pvtKey) => {
  const prefix = '\x19Ethereum Signed Message:\n' + String.fromCharCode(message.length);
  const prefixedItemHash = prefix + message;

  await web3.eth.accounts.sign(prefixedItemHash, config.signKey);
};

const recoverSigner = async (itemHash, sig) => await web3.eth.accounts.recover(itemHash, sig, false);

 describe('API Happy Path', () => {
   // Assumes user already created
   const authRequest = {
     email: config.testEmail,
     password: config.testPassword
     //  userId: config.testUserI
   };

   let jwt = {};

   before('login and fetch token', (done) => {
     const result = superagent
       .post('http://localhost:3600/auth')
       .send(authRequest)
       .then((res) => {
         jwt = res.body;
         done()
       })
       .catch((err) => {
         done(err)
       });
   });

  describe('Post a hash', () => {

     it('Should post hash and get data by db id and txid', (done) => {
       superagent
         .post('http://localhost:3600/notarise/hash')
         .set({Authorization: 'Bearer ' + jwt.accessToken})
         .set('Content-Type', 'application/json')
         .send({hash: itemHash(content()['file']), hashType: 3})
         .then((res) => {

           superagent
             .get('http://localhost:3600/notarised/getById/' + res.body.id)
             .set({Authorization: 'Bearer ' + jwt.accessToken})
             .set('Content-Type', 'application/json')
             .end((err, idRes) => {
               assert(err === null, 'err');
               console.log('fetched by id: ', idRes.body.fileHash);
               assert(idRes.id === idRes.id);
               assert(idRes.fileHash === idRes.fileHash);
               assert(idRes.txId === idRes.txId);

               superagent
                 .get('http://localhost:3600/notarised/getByTxId/' + idRes.body.txId)
                 .set({Authorization: 'Bearer ' + jwt.accessToken})
                 .set('Content-Type', 'application/json')
                 .end((err, txIdRes) => {
                   assert(err === null, 'err');
                   console.log('fetched by txId: ', txIdRes.body.txId);
                   assert(txIdRes.id === txIdRes.id);
                   assert(txIdRes.fileHash === txIdRes.fileHash);
                   assert(txIdRes.txId === txIdRes.txId);
                   done();
                   // superagent
                   //   .get('http://localhost:3600/notarised/getByHash/' + fHashRes.body.txId)
                   //   .set({Authorization: 'Bearer ' + jwt.accessToken})
                   //   .set('Content-Type', 'application/json')
                   //   .end((err, txIdRes) => {
                   //     assert(err === null, 'err');
                   //     console.log('fetched by txId: ', txIdRes.body.txId);
                   //     assert(txIdRes.id === txIdRes.id);
                   //     assert(txIdRes.fileHash === txIdRes.fileHash);
                   //     assert(txIdRes.txId === txIdRes.txId);
                   //     done()
                   //   })
                 })
             })
         })
         .catch((e) => {
           done(e);
           assert(false, e)
         })
     });
   });

   // post by file
   describe('Post a file', () => {

     before(done => setTimeout(done, 250));

     it('Should post file and get data by db id and txid', (done) => {
       superagent
         .post('http://localhost:3600/notarise/file')
         .set({Authorization: 'Bearer ' + jwt.accessToken})
         .set('Content-Type', 'application/json')
         .send(content())
         .then((res) => {
           console.log('second');
           superagent
             .get('http://localhost:3600/notarised/getById/' + res.body.id)
             .set({Authorization: 'Bearer ' + jwt.accessToken})
             .set('Content-Type', 'application/json')
             .end((err, idRes) => {
               assert(err === null, 'err')
               console.log('fetched by id: ', idRes.body.fileHash)
               assert(idRes.id === idRes.id);
               assert(idRes.fileHash === idRes.fileHash);
               assert(idRes.txId === idRes.txId);

               superagent
                 .get('http://localhost:3600/notarised/getByTxId/' + res.body.txId)
                 .set({Authorization: 'Bearer ' + jwt.accessToken})
                 .set('Content-Type', 'application/json')
                 .end((err, txIdRes) => {

                   assert(err === null, 'err');
                   console.log('fetched by txId: ', txIdRes.body.fileHash);
                   assert(txIdRes.id === res.id);
                   assert(txIdRes.fileHash === txIdRes.fileHash);
                   assert(txIdRes.txId === txIdRes.txId);
                   done();
                 })
             })
         })
         .catch((e) => {
           console.error(e);
           done()
         })
     });
   });

   // post by file
   describe('Post a file', () => {

     before(done => setTimeout(done, 250));

     it('Should post file and get data by db id and txid', (done) => {
       superagent
         .post('http://localhost:3600/notarise/file')
         .set({Authorization: 'Bearer ' + jwt.accessToken})
         .set('Content-Type', 'application/json')
         .send(content())
         .then((res) => {
           console.log('second');
           superagent
             .get('http://localhost:3600/notarised/getById/' + res.body.id)
             .set({Authorization: 'Bearer ' + jwt.accessToken})
             .set('Content-Type', 'application/json')
             .end((err, idRes) => {
               assert(err === null, 'err')
               console.log('fetched by id: ', idRes.body.fileHash)
               assert(idRes.id === idRes.id);
               assert(idRes.fileHash === idRes.fileHash);
               assert(idRes.txId === idRes.txId);

               superagent
                 .get('http://localhost:3600/notarised/getByTxId/' + res.body.txId)
                 .set({Authorization: 'Bearer ' + jwt.accessToken})
                 .set('Content-Type', 'application/json')
                 .end((err, txIdRes) => {

                   assert(err === null, 'err');
                   console.log('fetched by txId: ', txIdRes.body.fileHash);
                   assert(txIdRes.id === res.id);
                   assert(txIdRes.fileHash === txIdRes.fileHash);
                   assert(txIdRes.txId === txIdRes.txId);
                   done();
                 })
             })
         })
         .catch((e) => {
           console.error(e)
           done(e)
         })
     });
   });
 });


 describe ('Post has with signature', () => {
   before(done => setTimeout(done, 500));


 });


  describe('Verify stuff', () => {

  });




function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    console.log('MAKEID', result);
    return result;
}

