const UserModel = require('../../users/models/users.model');
const crypto = require('crypto');
//import isEmail from 'validator/lib/isEmail';

const validator = require('validator');

exports.hasAuthValidFields = (req, res, next) => {
  let errors = [];

  if (req.body) {
    if (!req.body.email) {
      errors.push('Missing email field');
    }
    if (!req.body.password) {
      errors.push('Missing password field');
    }
    if (!validator.isEmail(req.body.email)) {
      errors.push('Malformed email');
    }

    if (errors.length) {
      return res.status(400).send({errors: errors.join(',')});
    } else {
      return next();
    }
  } else {
    return res.status(400).send({errors: 'Missing email and password fields'});
  }
};

exports.userWithEmailAlreadyExists = (req, res, next) => {
  UserModel.findByEmail(req.body.email)
    .then((user) => {
      if(user[0]) {
        res.status(409).send('email already in use'); // is this a security anti pattern <- revealing that user already exists
      } else {
        return next();
      }
    });
};

//@todo make email field in database unique!!!!
exports.isPasswordAndUserMatch = (req, res, next) => {
  UserModel.findByEmail(req.body.email)
    .then((user)=>{
      if(!user[0]){
        res.status(404).send({});
      } else {
        // hmmmmmmm, field needs to be set in adavance so how do we axctualyly pass a suer
        // hmmm salt per password field
        let passwordFields = user[0].password.split('$'); // so at what point
        let salt = passwordFields[0];
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        if (hash === passwordFields[1]) {
          req.body = {
            userId: user[0]._id,
            email: user[0].email,
            permissionLevel: user[0].permissionLevel,
            provider: 'email',
            name: user[0].firstName + ' ' + user[0].lastName,
          };
          return next();
        } else {
          return res.status(400).send({errors: ['Invalid e-mail or password']});
        }
      }
    });
};


exports.validEmail = (req, res, next) => {
  // @todo consider adding field level in db @see https://www.npmjs.com/package/mongoose-type-email
  if (validator.isEmail(req.body.email)) {
    return next();
  } else {
    return res.status(422).send('Invalid email');
  }
};