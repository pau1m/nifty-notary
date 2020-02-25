const userModel = require('../users/models/users.model');
const config = require('../common/config/env.config');
const crypto = require('crypto');

let salt = crypto.randomBytes(16).toString('base64');
let hash = crypto.createHmac('sha512', salt).update(config.testPassword).digest("base64");
const password = salt + "$" + hash;

const testUser = {
  firstName: 'test',
  lastName: 'test',
  email: config.testEmail,
  password: password,
  permissionLevel: config.permissionLevels.PAID_USER,
};





// module.exports = async function ()   {
// //   console.log('Creating user');
// //   const createdUser = await userModel.createUser(testUser);
// //   console.log('Created: ', createdUser);
// //
// //   return createdUser;
// // };





//exports.createUser = createUser;

(async function createUser()   {
  console.log('Creating user');
  const createdUser = await userModel.createUser(testUser);
  console.log('Created: ', createdUser);
  // const fetchedhUser = await userModel.findByEmail(testUser.email);
  // createdUser.id = fetchedUser.
})();



// createUser();
