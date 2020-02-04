const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const notaryItemSchema = new Schema({
    file: String,
    tokenId: String,
    onChain: false
});

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

const NotaryItem = mongoose.model('NotaryItem', notaryItemSchema);


// exports.findByEmail = (email) => {
//     return User.find({email: email});
// };
// exports.findById = (id) => {
//     return User.findById(id)
//         .then((result) => {
//             result = result.toJSON();
//             delete result._id;
//             delete result.__v;
//             return result;
//         });
// };

exports.createItem = (notaryItemData) => {
    const item = new NotaryItem(notaryItemData);
    return item.save();
    //return () => new Promise(() => notaryItemData);
    // middleware ... or....?
    // perhaps triggers an even in the system...
    // how do we watch to observe...

};

exports.verifyItem = (notaryIemData) => {
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

