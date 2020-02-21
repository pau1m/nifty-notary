const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const notaryItemSchema = new Schema({
    txStatus: String,
//    fileHash: String,
//    txId: String,
    fileHash: {
      type: String,
      index: true,
      unique: true
    },
    hashType: String,
    docType: String,
    txId: {
      type: String,
      index: true,
      unique: true
    },
    chainId: String
});

// maybe this is why the other bits arent working
notaryItemSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
notaryItemSchema.set('toJSON', {
    virtuals: true
});

notaryItemSchema.findById = function (cb) {
    return this.model('NotaryItem').find({id: this.id}, cb);
};

// notaryItemSchema.findByTxId = function (cb) {
//     return this.model('NotaryItem').find({txId: this.txId}, cb)
// };
//
// notaryItemSchema.findByFileHash = function (cb) {
//     return this.model('NotaryItem').find({fileHash: this.fileHash}, cb)
// };

const NotaryItem = mongoose.model('NotaryItem', notaryItemSchema);

exports.findById = (id) => {
    return NotaryItem.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.findByTxId = (txId) => {
  return NotaryItem.findOne({txId: txId})
    .then((result) => {
      result = result.toJSON();
      delete result._id;
      delete result.__v;
      return result;
    });

  // return NotaryItem.findByTxId(txId)
  //   .then((result) => {
  //     result = result.toJSON();
  //     delete result._id;
  //     delete result.__v;
  //     return result;
  //   })
};

exports.findByFileHash = (fileHash) => {
  return NotaryItem.findOne({fileHash: fileHash})
    .then((result) => {
      result = result.toJSON();
      delete result._id;
      delete result.__v;
      return result;
    });

  // return NotaryItem.findByFileHash(fileHash)
  //   .then((result) => {
  //     result = result.toJSON();
  //     delete result._id;
  //     delete result.__v;
  //     return result;
  //   })
};

exports.createItem = (notaryItemData) => {
  //@todo sanitize input

    const item = new NotaryItem(notaryItemData);
    return item.save();
    //return () => new Promise(() => notaryItemData);
    // middleware ... or....?
    // perhaps triggers an even in the system...
    // how do we watch to observe...
};

exports.verifyItem = (notaryItemData) => {
  // suppose this would be checking existance on chain


  // @todo do this now
  // should this also verify existence on chain
  // hmmmmmmmm....

  // can use redux or middleware -- get head around that next week

    return notaryIemData;
};

// exports.list = (perPage, page) => {
//     return new Promise((resolve, reject) => {
//         NotaryItem.find()
//             .limit(perPage)
//             .skip(perPage * page)
//             .exec(function (err, users) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(users);
//                 }
//             })
//     });
// };

// exports.patchUser = (id, userData) => {
//     return new Promise((resolve, reject) => {
//         NotaryItem.findById(id, function (err, user) {
//             if (err) reject(err);
//             for (let i in userData) {
//                 user[i] = userData[i];
//             }
//             user.save(function (err, updatedUser) {
//                 if (err) return reject(err);
//                 resolve(updatedUser);
//             });
//         });
//     })
// };

// exports.removeById = (userId) => {
//     return new Promise((resolve, reject) => {
//         NotaryItem.remove({_id: userId}, (err) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(err);
//             }
//         });
//     });
// };

