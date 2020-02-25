const userModel = require('../users/models/users.model');
const config = require('../common/config/env.config');
// const authCoontroller

const testUser = {
  firstName: 'test',
  lastName: 'test',
  email: config.testEmail,
  password: config.testPassword,
  permissionLevel: config.permissionLevels.PAID_USER,
};


//uhm.... but we still need to request a token
//should either fetch or generate that here!
// create and fetch a token or this user
module.exports = async function ()   {
  console.log('Creating user');
  const createdUser = await userModel.createUser(testUser);
  console.log('Created: ', createdUser);lll
  // oh, actuall we already have the id
  // fetch userId
  // const fetchedhUser = await userModel.findByEmail(testUser.email);
  // createdUser.id = fetchedUser.
  //
  // console.log("Created: ", createdUser);
  // we also need to grab the user id...

  return createdUser;


  // also have to get a token for this user!!!
  // import the auth stuff too....
  // break;
};

//exports.createUser = createUser;






// (async function createUser()   {
//   console.log('Creating user');
//   const createdUser = await userModel.createUser(testUser);
//   // oh, actuall we already have the id
//   // fetch userId
//   // const fetchedhUser = await userModel.findByEmail(testUser.email);
//   // createdUser.id = fetchedUser.
//   //
//   // console.log("Created: ", createdUser);
//   // we also need to grab the user id...
//
//   return createdUser;
//
//
//   // also have to get a token for this user!!!
//   // import the auth stuff too....
//   // break;
// })();



// createUser();
