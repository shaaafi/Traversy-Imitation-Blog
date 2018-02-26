var mongoose = require("mongoose");

var blogSchema = mongoose.Schema({
    title: { type: String, required: true },
    catagory: { type: String, required: true },
    content: { type: String, required: true },
    avatarPath: { type: String, required: false },
    avatarName: { type: String, required: false },
    auther: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' }
}, { timestamps: true });



const blogs = module.exports = mongoose.model('Blog', blogSchema);

module.exports.addBlog = function(blog, callback) {
    blog.save(callback);
}

module.exports.getBlog = function(callback) {
    blogs.find().populate('auther').exec(callback);
}

module.exports.getDashboardBlog = function(id, callback) {
    const ob = { auther: id };
    blogs.find(ob).populate('auther').exec(callback);
}

module.exports.getBlogById = function(id, callback) {
    blogs.findById(id).populate('auther').exec(callback);
}

module.exports.updateBlogById = function(id, productOb, callback) {
    blogs.findByIdAndUpdate(id, productOb, callback);
}

module.exports.removeBlogById = function(id, callback) {
    blogs.findByIdAndRemove(id, callback);
}

module.exports.search = function(key, value, callback) {
    const regex = new RegExp(escapeRegex(value), 'gi');
    if (key == "type") {
        const ob = { type: regex };
        blogs.find(ob).exec(callback);
    } else if (key == "name") {
        const ob = { name: regex };
        blogs.find(ob).exec(callback);
    }
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};