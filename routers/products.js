var express = require("express");
var router = express.Router();
var multer = require("multer");
var mongoose = require("mongoose");
var Blog = require("../model/products");



var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname);
    }
})

var upload = multer({ storage: storage });



router.post('/addBlog', upload.single('avatar'), (req, res) => {
    if (req.file) {
        avpath = req.file.path;
        avlength = avpath.length;
        av = avpath.slice(6, avlength);
        var newBlog = new Blog({
            title: req.body.title,
            catagory: req.body.catagory,
            auther: req.body.auther,
            content: req.body.content,
            avatarPath: av,
            avatarName: req.file.originalname
        });
    } else {
        var newBlog = new Blog({
            title: req.body.title,
            catagory: req.body.catagory,
            auther: req.body.auther,
            content: req.body.content,

        });
    }


    Blog.addBlog(newBlog, (err, result) => {
        if (err) throw err;
        res.json({ success: true, data: result });
    });
});

router.get('/getAll', (req, res) => {
    Blog.getBlog((err, result) => {
        if (err) throw err;
        res.json({ success: true, data: result });
    })
})

router.delete('/deleteBlog/:id', (req, res) => {
    const id = req.params.id;
    Blog.removeBlogById(id, (err, result) => {
        if (err) throw err;
        res.json({ success: true, data: result });
    })
})

router.put('/updateBlog/:id', (req, res) => {
    const id = req.params.id;
    const ob = req.body;
    Blog.updateBlogById(id, ob, (err, result) => {
        if (err) throw err;
        res.json({ success: true, data: result });
    })
});

router.get('/searchBlog', (req, res) => {
    const key = req.query.key;
    const value = req.query.value;

    Blog.search(key, value, (err, result) => {
        if (err) throw err;
        res.json({ success: true, data: result });

    });
});

router.get('/getOne', (req, res) => {
    const id = req.query.id;
    Blog.getBlogById(id, (err, result) => {
        res.json({ success: true, data: result });
    })
})

router.get('/getDashboardAll', (req, res) => {
    id = req.query.id;
    Blog.getDashboardBlog(id, (err, result) => {
        res.json({ success: true, data: result });
    })
})

module.exports = router;