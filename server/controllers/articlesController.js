require('../models/database');
// const req = require('express/lib/request');
const Post = require('../models/Post');
const Posts = require('../models/Post');
const About = require('../models/About')
const User = require('../models/User');
const fs = require('fs')
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'devluki',
    api_key: '848194944323474',
    api_secret: '-6z9SMUE86RZgYK4UtxLaH1c7oY'
});

//  Homepage
exports.homepage = async (req, res) => {

    try {
        // Slider latest
        const limitNumberLatest = 4;
        const postsLatest = await Posts.find({}).sort({
            _id: -1
        }).limit(limitNumberLatest);
        // Most likes
        const limitNumberFeatured = 3
        const postsFeatured = await Posts.find({}).sort({
            likes: -1
        }).limit(limitNumberFeatured);



        res.render('index', {
            title: 'Kejtrip - Home',
            postsLatest,
            postsFeatured,
        });

    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured!"
        })
    }



}

// View allPosts
exports.explorePosts = async (req, res) => {

    // default values
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 2;

    const skip = (page - 1) * limit;
    const numPosts = await Posts.countDocuments()

    try {
        const posts = await Posts.find({}).sort({
            _id: -1
        }).skip(skip).limit(limit);


        if (req.query.page) {

            console.log(numPosts);
            if (skip >= numPosts) throw new Error('This page does not exist')
        }
        console.log(page);
        res.render('posts', {
            title: 'Kejtrip - posty',
            posts,
            page,
            numPosts,
            limit


        });

    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }

}

exports.about = async (req, res) => {
    // const id -> only one about article
    const id = '6277aa34772ff87e9fe3119c';
    let show;

    try {

        const limitNumberLatest = 4;
        const postsLatest = await Posts.find({}).sort({
            _id: -1
        }).limit(limitNumberLatest);

        const about = await About.findById(id);
        console.log(about);
        res.render('about', {
            title: 'Kejtrip - O mnie',
            about,
            postsLatest
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured!"
        })
    }


}

// Render post content
exports.readPost = async (req, res) => {
    const limitNumberLatest = 4;
    let postId = req.params.id;
    let show;
    try {

        // Cookie
        if (req.session.id === postId) {
            show = !req.session.like;
        } else {
            show = 1;
        }


        const post = await Posts.findById(postId);

        const postsLatest = await Posts.find({}).sort({
            _id: -1
        }).limit(limitNumberLatest);
        res.render('post', {
            title: 'Kejtrip - post',
            post,
            postsLatest,
            show
        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured!"
        })
    }


}


// POST/search

exports.searchPost = async (req, res) => {

    try {
        let searchTerm = req.body.searchTerm;
        let posts = await Post.find({
            $text: {
                $search: searchTerm,
                $diacriticSensitive: true
            }
        })
        res.render('search', {
            title: 'Kejtrip - post',
            posts
        })

    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured!"
        })

    }

}

// Destinations ??? TO DO
exports.destinations = async (req, res) => {

    try {

        res.render('destinations', {
            title: 'Kejtrip - kierunki',

        })

    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured!"
        })

    }

}


// Submit post
// Post article -> admin route??
exports.submitPost = async (req, res) => {
    try {
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        res.render('submit-post', {
            title: 'Kejtrip',
            infoErrorsObj,
            infoSubmitObj,

        })
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured!"
        })
    }
}



// Post post article
exports.submitPostArticle = async (req, res) => {
    try {

        let imageUploadFile;
        let uploadPath;
        let newImageName;
        let imageCloudPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            console.log('no files were uploaded');
        } else {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;
            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function (err) {
                if (err) return res.status(500).send(err)
            })
            const result = await cloudinary.uploader.upload(uploadPath, function (error, result) {

                imageCloudPath = result.url;
                if (!error) {
                    fs.unlink(uploadPath, () => console.log('succes'))
                }
            });


        }


        const newPost = new Post({
            title: req.body.title,
            category: req.body.category,
            data: req.body.data,
            location: req.body.location,
            city: req.body.city,
            postContent: req.body.postContent,
            list: req.body.list,
            image: imageCloudPath,

        })
        await newPost.save();

        req.flash('infoSubmit', 'Post has been added.');
        res.redirect('/submit-post');

    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('/submit-post');

    }


}

// Submit about

exports.submitAbout = async (req, res) => {
    try {
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        res.render('submit-about', {
            title: 'Kejtrip',
            infoErrorsObj,
            infoSubmitObj,

        })
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured!"
        })
    }
}



// Post about article
exports.submitAboutArticle = async (req, res) => {
    try {
        const newAbout = new About({
            title: req.body.title,
            postContent: req.body.postContent,


        })
        await newAbout.save();

        req.flash('infoSubmit', 'Post has been added.');
        res.redirect('/submit-about');

    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('/submit-about');

    }


}



// Edit about article

exports.editAbout = async (req, res) => {
    const id = '6277aa34772ff87e9fe3119c';
    try {
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        // console.log(req.params.id);
        const about = await About.findById(id);
        // console.log(post);
        res.render('edit-about', {
            title: 'Kejtrip-edycja',

            about: about,

            infoErrorsObj,
            infoSubmitObj
        })

    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}


exports.editPutAbout = async (req, res) => {


    const id = '6277aa34772ff87e9fe3119c';

    try {


        const about = await About.findByIdAndUpdate(id, {
            $set: {
                "title": req.body.title,
                "postContent": req.body.postContent
            },



        }, {
            new: true
        })

        await about.save();

        req.flash('infoSubmit', 'Post has been edited.');
        res.redirect('/submit-about');

    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('/submit-about');

    }
}




////////////////////////////////////////////


exports.addLikes = async (req, res) => {
    try {

        const id = req.params.id;
        const post = await Posts.findById(id);
        post.likes++;
        req.session.like = 1;
        req.session.id = id;
        post.save();

        res.send({
            likes: post.likes,
            postId: id
        })
    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}



// Comemnts



exports.postComment = async (req, res) => {
    try {
        const {
            id,
            userName,
            comment
        } = req.body;
        console.log(id, userName, comment);

        const post = await Posts.findByIdAndUpdate(id, {
            $push: {
                "comments": {
                    userName,
                    comment
                }
            }
        })


        post.commentsCount = post.comments.length + 1;
        post.save();
        res.send({
            text: 'comment successfull',
            user: userName,
            comment: comment
        })

    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }

}

exports.deletePost = async (req, res) => {
    console.log(req.params.id);
    let id = req.params.id;
    try {

        await Post.findByIdAndRemove(id);
        res.redirect('/')
    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }


}

exports.editPost = async (req, res) => {
    try {
        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        const post = await Post.findById(req.params.id);

        res.render('edit-post', {
            title: 'Kejtrip-edycja',
            post: post,
            infoErrorsObj,
            infoSubmitObj
        })

    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}


exports.editPut = async (req, res) => {


    let id = req.params.id;

    try {

        const post = await Post.findByIdAndUpdate(id, {
            $set: {
                "title": req.body.title,
                "category": req.body.category,
                "location": req.body.location,
                "city": req.body.city,
                "postContent": req.body.postContent
            },

        }, {
            new: true
        })

        await post.save();

        req.flash('infoSubmit', 'Post has been edited.');
        res.redirect('/submit-post');

    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('/submit-post');

    }
}

// Admin panel

exports.login = async (req, res) => {
    try {


        res.render('login', {
            title: 'Kejtrip-login',

        })

    } catch (error) {

    }
}

exports.loginValidation = async (req, res) => {
    const data = req.body
    const id = '62796ea9f2271d8e26aad268'
    try {
        const userData = await User.findById(id)
        if (userData.login === data.login && userData.password === data.password) {
            // 
            console.log('Logowanie udane!!!!!');
            res.redirect('/admin-panel')
        } else {
            console.log('Nie udało się zalogować!!!');
            res.redirect('/login')
        }
        // console.log(req.body);


    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}

exports.adminPanel = async (req, res) => {
    try {
        res.render('admin-panel', {
            title: 'Kejtrip-panel',

        })
    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}

exports.panelArticles = async (req, res) => {
    try {

        const posts = await Posts.find({}).sort({
            _id: -1
        })

        res.render('panel-list', {
            title: 'Kejtrip-lista',
            posts

        })
    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}