const mongoose = require("mongoose");
var bcrypt = require("bcryptjs");

var userSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    avatarPath: { type: String, required: false },
    avatarName: { type: String, required: false },
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
}, { timestamps: true });

const users = module.exports = mongoose.model('Users', userSchema);

module.exports.getUserById = function(id, callback) {
    users.findById(id, callback);
}

module.exports.getUserByName = function(Username, callback) {
    const query = { username: Username };
    users.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(customerPassward, hash, callback) {
    bcrypt.compare(customerPassward, hash, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) return callback(null, isMatch);
    });
}