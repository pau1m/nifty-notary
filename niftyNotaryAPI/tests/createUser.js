const userModel = require('../users/models/users.model');
const config = require('../common/config/env.config');

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

(async function createUser()   {
  console.log('Creating user');
  const createdUser = await userModel.createUser(testUser);
  console.log("Created: ", createdUser);
  return createdUser;

  // also have to get a token for this user!!!
  // import the auth stuff too....
  // break;
})();



// createUser();
