require('../models/database');
// const req = require('express/lib/request');
const Post = require('../models/Post');
const Posts = require('../models/Post');
const About = require('../models/About')
const User = require('../models/User');
const Image = require('../models/Image');
const Pin = require('../models/Pin');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'devluki',
    api_key: '848194944323474',
    api_secret: '-6z9SMUE86RZgYK4UtxLaH1c7oY'
});
// const ResTest = require('../models/ResTest')
const Route = require('../models/Route');
const request = require('request');
const {
    post
} = require('request');









const getRouteGeometry = async function (coords) {

    const res = await axios({
            method: 'POST',
            url: 'https://api.openrouteservice.org/v2/directions/foot-walking/geojson',
            headers: {
                'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
                'Authorization': '5b3ce3597851110001cf6248760b2fe52b484167892f758fd156fa66',
                'Content-Type': 'application/json; charset=utf-8'
            },
            data: {
                'coordinates': `[[-91.9833294,15.6166642],[ -91.47233,15.308832098],[-91.5166646,14.83333],[-90.7333304,14.5666644],[-91.28333,14.7],[-91.272,14.694]]}`,
            }
        })
        .then(function (response) {
            console.log(response);
        }).catch(function (error) {
            console.log(error)
        })
    console.log(res);

}






//  Homepage
exports.homepage = async (req, res) => {

    try {
        // Slider latest
        const limitNumberLatest = 4;
        const postsLatest = await Posts.find({
            'status': 'Publikacja'
        }).sort({
            _id: -1
        }).limit(limitNumberLatest);
        // Most likes
        const limitNumberFeatured = 3
        const postsFeatured = await Posts.find({
            'status': 'Publikacja'
        }).sort({
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
        const posts = await Posts.find({
            'status': 'Publikacja'
        }).sort({
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
        const postsLatest = await Posts.find({
            'status': 'Publikacja'
        }).sort({
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
    // const limitNumberLatest = 4;



    const postId = req.params.id;
    const cookiesId = 'a' + req.params.id;

    const cookies = req.cookies;
    console.log(req.cookies['a' + req.params.id], cookies[cookiesId]);
    let show;
    try {

        // Cookie
        if (!cookies[cookiesId]) {
            show = 0;
        } else {
            show = 1;
        }


        const post = await Posts.findById(postId);

        const limitNumberFeatured = 3
        const postsFeatured = await Posts.find({
            'status': 'Publikacja'
        }).sort({
            likes: -1
        }).limit(limitNumberFeatured);
        res.render('post', {
            title: 'Kejtrip - post',
            post,
            postsFeatured,
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

exports.searchPostQuery = async (req, res) => {

    try {
        let searchTerm = req.query.searchTerm;
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
    const limitNumberFeatured = 3
    try {

        const routes = await Route.find({
            'status': 'Publikacja'
        }).sort({
            id: -1
        })

        const postsFeatured = await Posts.find({
            'status': 'Publikacja'
        }).sort({
            likes: -1
        }).limit(limitNumberFeatured);

        res.render('destinations', {
            title: 'Kejtrip - kierunki',
            routes: routes,
            postsFeatured,

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
            console.log(uploadPath);
            imageUploadFile.mv(uploadPath, function (err) {
                if (err) return res.status(500).send(err)
            })
            const result = await cloudinary.uploader.upload(uploadPath, {
                width: 700,
                q_auto: 'good'
            }, function (error, result) {

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
            status: req.body.status

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


exports.addLikes = async (req, res, next) => {
    try {

        const id = req.params.id;

        // console.log(post.likes);
        const post = await Posts.findById(id);
        post.likes++;
        // req.session.like = 1;
        // req.session.id = id;
        post.save();


        res.cookie('a' + id, `${id}`, {
            maxAge: 360000
        })
        res.send({
            likes: post.likes,
            postId: id
        })
        res.end()





    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}
// exports.addLikes = async (req, res, next) => {
//     try {

//         const id = req.params.id;

//         // console.log(post.likes);
//         const post = await Posts.findById(id);
//         post.likes++;
//         req.session.like = 1;
//         req.session.id = id;
//         post.save();

//         res.send({
//             likes: post.likes,
//             postId: id
//         })





//     } catch (error) {
//         res.status(500).send({
//             message: 'BŁĄD' + error.message || "Error Occured!"
//         })
//     }
// }



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
            comment: comment,
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
                "postContent": req.body.postContent,
                "status": req.body.status

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
exports.upload = async (req, res) => {
    try {





        res.render('upload', {
            title: 'Kejtrip-lista',


        })
    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}
exports.uploadPost = async (req, res) => {
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
            console.log(uploadPath);
            imageUploadFile.mv(uploadPath, function (err) {
                if (err) return res.status(500).send(err)
            })
            const result = await cloudinary.uploader.upload(uploadPath, {
                width: 700,
                q_auto: 'good'
            }, function (error, result) {

                imageCloudPath = result.url;
                if (!error) {
                    fs.unlink(uploadPath, () => console.log('succes'))
                } else {
                    console.log(error);
                }
            });
        }
        const newImage = new Image({
            path: imageCloudPath,
            description: req.body.description,
            location: req.body.location,
            city: req.body.city,
        })

        await newImage.save();




        res.redirect('/admin-panel/upload')


    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}

exports.gallery = async (req, res) => {
    try {


        const imgs = await Image.find({

        }).sort({
            _id: -1
        })


        res.send({
            imgs: imgs,
        })
    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}

// map
exports.map = async (req, res) => {


    try {

        res.render('map-menu', {
            title: 'Kejtrip - mapa',

        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured!"
        })
    }


}
// Map add pins view
exports.addPins = async (req, res) => {


    try {

        res.render('map-addPins', {
            title: 'Kejtrip - mapa/dodawania punktów',

        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured!"
        })
    }


}

// Map submit add pins
exports.submitAddPins = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    try {


        const newPin = new Pin({
            pinLocation: req.body.pinLocation,
            pinLink: req.body.pinLink,
            pinLongitude: req.body.pinLongitude,
            pinLatitude: req.body.pinLatitude,
            status: req.body.status,


        })
        await newPin.save();

        req.flash('infoSubmit', 'Pin has been added.');

        res.render('map-addPins', {
            title: 'Kejtrip-edycja',
            infoErrorsObj,
            infoSubmitObj
        })


    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('/submit-post');

    }


}

exports.pinsList = async (req, res) => {
    try {

        const pins = await Pin.find({}).sort({
            _id: -1
        })

        res.render('pins-list', {
            title: 'Kejtrip-lista',
            pins

        })
    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}

exports.deletePin = async (req, res) => {
    console.log(req.params.id);
    let id = req.params.id;
    try {

        await Pin.findByIdAndRemove(id);
        res.redirect('/')
    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }


}

///


exports.editPin = async (req, res) => {
    let id = req.params.id;
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    try {

        const pin = await Pin.findById(req.params.id);
        console.log(pin);
        res.render('map-editPins', {
            title: 'Kejtrip-edycja',
            pin: pin,
            infoErrorsObj,
            infoSubmitObj
        })

    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}


exports.editPinPut = async (req, res) => {


    let id = req.params.id;

    try {

        const pin = await Pin.findByIdAndUpdate(id, {
            $set: {



                "pinLocation": req.body.pinLocation,
                "pinLongitude": req.body.pinLongitude,
                "pinLatitude": req.body.pinLatitude,
                "status": req.body.status

            },

        }, {
            new: true
        })

        await pin.save();

        // req.flash('infoSubmit', 'Pin has been edited.');
        // res.redirect('/admin-panel/map/add-pins');

    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('/submit-post');

    }
}

// API
exports.pinsAPI = async (req, res) => {

    try {
        const data = await Pin.find({
            'status': 'Publikacja'
        })


        res.json(data);

    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}

// Map add routes
// Main form view
exports.addRoute = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');

    try {

        res.render('map-addRoute', {
            title: 'Kejtrip - mapa/dodawania tras',
            infoErrorsObj,
            infoSubmitObj,

        });
    } catch (error) {
        res.status(500).send({
            message: error.message || "Error Occured!"
        })
    }


}
// Function - get routing and update
const requestRoute = (dataCords, name) => {
    const route = request({

        method: 'POST',
        url: 'https://api.openrouteservice.org/v2/directions/foot-walking/geojson',

        body: `{"coordinates": ${dataCords},"units": "km"}`,
        headers: {
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            'Authorization': '5b3ce3597851110001cf6248760b2fe52b484167892f758fd156fa66',
            'Content-Type': 'application/json; charset=utf-8',

        }
    }, async function (error, response, body) {


        const updateRoute = await Route.findOneAndUpdate({
            name: name
        }, {
            $set: {

                "routing": JSON.parse(body).features[0].geometry,
                "distance": JSON.parse(body).features[0].properties.summary.distance

            },

        }, {
            new: true
        })

        await updateRoute.save();



    });

}




// Submit route
exports.submitAddRoute = async (req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    try {


        const newRoute = new Route({
            name: req.body.name,
            startLocation: req.body.startLocation,
            startLongitude: req.body.startLongitude,
            startLatitude: req.body.startLatitude,
            endLocation: req.body.endLocation,
            endLongitude: req.body.endLongitude,
            endLatitude: req.body.endLatitude,
            midPoints: req.body.midPoints,
            routeDescription: req.body.routeDescription,
            status: req.body.status,

        })

        await newRoute.save();


        const name = req.body.name;

        let dataCords = `[[${req.body.startLongitude},${req.body.startLatitude}],${req.body.midPoints},[${req.body.endLongitude},${req.body.endLatitude}]]`;
        console.log('dataCords:', dataCords);
        requestRoute(dataCords, name)



        req.flash('infoSubmit', 'Route has been added.');
        res.redirect('/admin-panel/map/add-route');




    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('admin-panel/map/add-route');

    }


}

// 
exports.routeList = async (req, res) => {
    try {

        const routes = await Route.find({}).sort({
            _id: -1
        })

        res.render('route-list', {
            title: 'Kejtrip-lista',
            routes

        })
    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}
// 

exports.deleteRoute = async (req, res) => {
    console.log(req.params.id);
    let id = req.params.id;
    try {

        await Route.findByIdAndRemove(id);
        res.redirect('/')
    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }


}
// 

exports.editRoute = async (req, res) => {
    // let id = req.params.id;
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    const id = req.params.id;
    try {

        const route = await Route.findById(id);
        res.render('map-editRoute', {
            title: 'Kejtrip-edycja',
            route: route,
            infoErrorsObj,
            infoSubmitObj
        })

    } catch (error) {
        res.status(500).send({
            message: 'BŁĄD' + error.message || "Error Occured!"
        })
    }
}


exports.editRoutePut = async (req, res) => {


    let id = req.params.id;

    try {

        const route = await Route.findByIdAndUpdate(id, {
            $set: {
                "name": req.body.name,
                "startLocation": req.body.startLocation,
                "startLongitude": req.body.startLongitude,
                "startLatitude": req.body.startLatitude,
                "endLocation": req.body.endLocation,
                "endLongitude": req.body.endLongitude,
                "endLatitude": req.body.endLatitude,
                "midPoints": req.body.midPoints,
                "routeDescription": req.body.routeDescription,
                "status": req.body.status,


            },

        }, {
            new: true
        })

        await route.save();

        const name = req.body.name;
        let dataCords = `[[${req.body.startLongitude},${req.body.startLatitude}],${req.body.midPoints},[${req.body.endLongitude},${req.body.endLatitude}]]`;
        requestRoute(dataCords, name)

        req.flash('infoSubmit', 'Route has been edited.');
        res.redirect('/admin-panel/map/route-list');

    } catch (error) {
        req.flash('infoErrors', error, error.message)
        res.redirect('/submit-post');

    }
}


// 