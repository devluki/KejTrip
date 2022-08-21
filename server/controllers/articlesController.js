require("../models/database");
// const req = require('express/lib/request');
const Post = require("../models/Post");
const Posts = require("../models/Post");
const About = require("../models/About");
const User = require("../models/User");
const Image = require("../models/Image");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const Route = require("../models/Route");
const request = require("request");
const { post } = require("request");
const { render } = require("ejs");

//  Homepage
exports.homepage = async (req, res) => {
  try {
    let showCookies;
    const cookies = req.cookies;
    if (!cookies["Cookies"]) {
      showCookies = 0;
    } else {
      showCookies = 1;
    }
    // Slider latest
    const limitNumberLatest = 4;
    const postsLatest = await Posts.find({
      status: "Publikacja",
    })
      .sort({
        _id: -1,
      })
      .limit(limitNumberLatest);
    // Most likes
    const limitNumberFeatured = 3;
    const postsFeatured = await Posts.find({
      status: "Publikacja",
    })
      .sort({
        likes: -1,
      })
      .limit(limitNumberFeatured);

    res.render("index", {
      title: "KejTrip - blog podróżniczy",
      postsLatest,
      postsFeatured,
      showCookies,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured!",
    });
  }
};

// View allPosts
exports.explorePosts = async (req, res) => {
  // default values
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 8;

  const skip = (page - 1) * limit;
  const numPosts = await Posts.countDocuments();
  // console.log("POst no:", numPosts);

  try {
    let showCookies;

    const cookies = req.cookies;
    if (!cookies["Cookies"]) {
      showCookies = 0;
    } else {
      showCookies = 1;
    }
    const posts = await Posts.find({
      status: "Publikacja",
    })
      .sort({
        _id: -1,
      })
      .skip(skip)
      .limit(limit);

    if (req.query.page) {
      // console.log(numPosts);
      if (skip >= numPosts) throw new Error("This page does not exist");
    }
    // console.log(page);
    res.render("posts", {
      title: "KejTrip - artykuły",
      posts,
      page,
      numPosts,
      limit,
      showCookies,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.about = async (req, res) => {
  const id = process.env.ABOUT_ID;

  try {
    let showCookies;
    const cookies = req.cookies;
    if (!cookies["Cookies"]) {
      showCookies = 0;
    } else {
      showCookies = 1;
    }
    const limitNumberLatest = 4;
    const postsLatest = await Posts.find({
      status: "Publikacja",
    })
      .sort({
        _id: -1,
      })
      .limit(limitNumberLatest);

    const about = await About.findById(id);
    // console.log(about);
    res.render("about", {
      title: "Kejtrip - O mnie",
      about,
      postsLatest,
      showCookies,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured!",
    });
  }
};

// Render post content
exports.readPost = async (req, res) => {
  // const limitNumberLatest = 4;

  const postId = req.params.id;
  const cookiesId = "a" + req.params.id;

  const cookies = req.cookies;
  // console.log(req.cookies["a" + req.params.id], cookies[cookiesId]);
  let showLikes;
  let showCookies;
  try {
    // Cookie
    if (!cookies[cookiesId]) {
      showLikes = 0;
    } else {
      showLikes = 1;
    }

    if (!cookies["Cookies"]) {
      showCookies = 0;
    } else {
      showCookies = 1;
    }

    const post = await Posts.findById(postId);

    const nextPost = await Posts.findOne({
      _id: {
        $gt: postId,
      },
    })
      .sort({
        _id: 1,
      })
      .limit(1);

    const prevPost = await Posts.findOne({
      _id: {
        $lt: postId,
      },
    })
      .sort({
        _id: -1,
      })
      .limit(1);
    // console.log("next/prev", nextPost);

    const limitNumberFeatured = 3;
    const postsFeatured = await Posts.find({
      $and: [
        {
          _id: {
            $ne: postId,
          },
        },
        {
          status: "Publikacja",
        },
      ],
    })
      .sort({
        likes: -1,
      })
      .limit(limitNumberFeatured);
    res.render("post", {
      title: `Kejtrip - ${post.title}`,
      post,
      postsFeatured,
      showLikes,
      showCookies,
      nextPost,
      prevPost,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured!",
    });
  }
};

// POST/search

exports.searchPost = async (req, res) => {
  try {
    let showCookies;

    const cookies = req.cookies;
    if (!cookies["Cookies"]) {
      showCookies = 0;
    } else {
      showCookies = 1;
    }
    let searchTerm = req.body.searchTerm;
    let posts = await Post.find({
      $text: {
        $search: searchTerm,
        $diacriticSensitive: true,
      },
    });
    res.render("search", {
      title: `Kejtrip - ${searchTerm}`,
      posts,
      showCookies,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured!",
    });
  }
};

exports.searchPostQuery = async (req, res) => {
  try {
    let showCookies;

    const cookies = req.cookies;
    if (!cookies["Cookies"]) {
      showCookies = 0;
    } else {
      showCookies = 1;
    }
    let searchTerm = req.query.searchTerm;
    let posts = await Post.find({
      $text: {
        $search: searchTerm,
        $diacriticSensitive: true,
      },
    });
    res.render("search", {
      title: `Kejtrip - ${searchTerm}`,
      posts,
      showCookies,
      // searchTerm
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured!",
    });
  }
};

// Destinations
exports.destinations = async (req, res) => {
  const limitNumberFeatured = 3;
  try {
    let showCookies;

    const cookies = req.cookies;
    if (!cookies["Cookies"]) {
      showCookies = 0;
    } else {
      showCookies = 1;
    }
    const routes = await Route.find({
      status: "Publikacja",
    }).sort({
      id: -1,
    });

    const postsFeatured = await Posts.find({
      status: "Publikacja",
    })
      .sort({
        likes: -1,
      })
      .limit(limitNumberFeatured);

    res.render("destinations", {
      title: "Kejtrip - kierunki",
      routes: routes,
      postsFeatured,
      showCookies,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured!",
    });
  }
};

// Submit post
// Post article -> admin route??
exports.submitPost = async (req, res) => {
  const cookies = req.cookies;
  if (cookies.user__sesion) {
    try {
      const infoErrorsObj = req.flash("infoErrors");
      const infoSubmitObj = req.flash("infoSubmit");
      res.render("submit-post", {
        title: "Kejtrip",
        infoErrorsObj,
        infoSubmitObj,
      });
      // req.flash('infoSubmit', 'Artykuł został dodany!');
      // res.redirect('/submit-post');
    } catch (error) {
      res.status(500).send({
        message: error.message || "Error Occured!",
      });
    }
  } else {
    res.redirect("/login");
  }
};

// Post post article
exports.submitPostArticle = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    let imageCloudPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      // console.log("no files were uploaded");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;
      // console.log(uploadPath);
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
      const result = await cloudinary.uploader.upload(
        uploadPath,
        {
          width: 700,
          q_auto: "good",
        },
        function (error, result) {
          imageCloudPath = result.url;
          if (!error) {
            fs.unlink(uploadPath, () => console.log("succes"));
          }
        }
      );
    }

    const newPost = new Post({
      title: req.body.title,
      category: req.body.category,
      // data: req.body.data || `${new Date().getDate()}.${(new Date().getMonth()+1)}.${new Date().getFullYear()}`,
      data: req.body.data,
      location: req.body.location,
      city: req.body.city,
      postContent: req.body.postContent,
      list: req.body.list,
      image: imageCloudPath,
      status: req.body.status,
    });
    await newPost.save();

    req.flash("infoSubmit", "Post has been added.");
    res.redirect("/submit-post");
  } catch (error) {
    req.flash("infoErrors", error, error.message);
    res.redirect("/submit-post");
  }
};

// Submit about

exports.submitAbout = async (req, res) => {
  try {
    const infoErrorsObj = req.flash("infoErrors");
    const infoSubmitObj = req.flash("infoSubmit");
    res.render("submit-about", {
      title: "Kejtrip",
      infoErrorsObj,
      infoSubmitObj,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Error Occured!",
    });
  }
};

// Post about article
// Use this only once!
// ------------------------------
// exports.submitAboutArticle = async (req, res) => {
//   try {
//     const newAbout = new About({
//       title: req.body.title,
//       postContent: req.body.postContent,
//     });
//     await newAbout.save();

//     req.flash("infoSubmit", "Post has been added.");
//     res.redirect("/submit-about");
//   } catch (error) {
//     req.flash("infoErrors", error, error.message);
//     res.redirect("/submit-about");
//   }
// };
// ----------------------------
// Edit about article

exports.editAbout = async (req, res) => {
  const cookies = req.cookies;
  if (cookies.user__sesion) {
    const id = process.env.ABOUT_ID;
    try {
      const infoErrorsObj = req.flash("infoErrors");
      const infoSubmitObj = req.flash("infoSubmit");
      // console.log(req.params.id);
      const about = await About.findById(id);
      // console.log(post);
      res.render("edit-about", {
        title: "Kejtrip-edycja",

        about: about,

        infoErrorsObj,
        infoSubmitObj,
      });
    } catch (error) {
      res.status(500).send({
        message: "BŁĄD" + error.message || "Error Occured!",
      });
    }
  } else {
    res.redirect("/login");
  }
};

exports.editPutAbout = async (req, res) => {
  const id = process.env.ABOUT_ID;

  try {
    const about = await About.findByIdAndUpdate(
      id,
      {
        $set: {
          title: req.body.title,
          postContent: req.body.postContent,
        },
      },
      {
        new: true,
      }
    );

    await about.save();

    req.flash("infoSubmit", "Post has been edited.");
    res.redirect("/admin-panel");
  } catch (error) {
    req.flash("infoErrors", error, error.message);
    res.redirect("/admin-panel");
  }
};

////////////////////////////////////////////

exports.addLikes = async (req, res, next) => {
  try {
    const id = req.params.id;

    // console.log(post.likes);
    const post = await Posts.findById(id);
    post.likes++;

    post.save();

    res.cookie("a" + id, `${id}`, {
      // One month
      maxAge: 31 * 24 * 60 * 60 * 1000,
    });
    res.send({
      likes: post.likes,
      postId: id,
    });
    res.end();
  } catch (error) {
    res.status(500).send({
      message: "BŁĄD" + error.message || "Error Occured!",
    });
  }
};

// Comemnts

exports.postComment = async (req, res) => {
  try {
    const { id, userName, comment, data } = req.body;
    // console.log(id, userName, comment);

    const post = await Posts.findByIdAndUpdate(id, {
      $push: {
        comments: {
          userName,
          comment,
          data,
        },
      },
    });

    post.commentsCount = post.comments.length + 1;
    post.save();
    res.send({
      text: "comment successfull",
      user: userName,
      comment: comment,
    });
  } catch (error) {
    res.status(500).send({
      message: "BŁĄD" + error.message || "Error Occured!",
    });
  }
};

exports.deletePost = async (req, res) => {
  // console.log(req.params.id);
  let id = req.params.id;
  try {
    await Post.findByIdAndRemove(id);
    res.redirect("/");
  } catch (error) {
    res.status(500).send({
      message: "BŁĄD" + error.message || "Error Occured!",
    });
  }
};

exports.editPost = async (req, res) => {
  try {
    const infoErrorsObj = req.flash("infoErrors");
    const infoSubmitObj = req.flash("infoSubmit");
    const post = await Post.findById(req.params.id);

    res.render("edit-post", {
      title: "Kejtrip-edycja",
      post: post,
      infoErrorsObj,
      infoSubmitObj,
    });
  } catch (error) {
    res.status(500).send({
      message: "BŁĄD" + error.message || "Error Occured!",
    });
  }
};

exports.editPut = async (req, res) => {
  let id = req.params.id;

  try {
    //
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    let imageCloudPath;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("no files were uploaded");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;
      // console.log(uploadPath);
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
      const result = await cloudinary.uploader.upload(
        uploadPath,
        {
          width: 700,
          q_auto: "good",
        },
        function (error, result) {
          imageCloudPath = result.url;
          if (!error) {
            fs.unlink(uploadPath, () => console.log("succes"));
          }
        }
      );
    }

    //

    const post = await Post.findByIdAndUpdate(
      id,
      {
        $set: {
          title: req.body.title,
          category: req.body.category,
          location: req.body.location,
          city: req.body.city,
          postContent: req.body.postContent,
          status: req.body.status,
          //
          image: imageCloudPath,
          //
        },
      },
      {
        new: true,
      }
    );

    await post.save();

    req.flash("infoSubmit", "Post has been edited.");
    res.redirect("/submit-post");
  } catch (error) {
    req.flash("infoErrors", error, error.message);
    res.redirect("/submit-post");
  }
};

// Admin panel

exports.login = async (req, res) => {
  try {
    res.render("login", {
      title: "Kejtrip-login",
    });
  } catch (error) {}
};

exports.loginValidation = async (req, res) => {
  const data = req.body;
  const id = process.env.USER_ID;

  try {
    const userData = await User.findById(id);

    if (userData.login === data.login && userData.password === data.password) {
      //
      res.cookie("user__sesion", true, {
        // 45 mins session
        maxAge: 45 * 60 * 1000,
      });
      res.redirect("/admin-panel");
    } else {
      res.redirect("/login");
    }
    // console.log(req.body);
  } catch (error) {
    res.status(500).send({
      message: "BŁĄD" + error.message || "Error Occured!",
    });
  }
};

exports.adminPanel = async (req, res) => {
  const cookies = req.cookies;
  if (cookies.user__sesion) {
    try {
      res.render("admin-panel", {
        title: "Kejtrip-panel",
      });
    } catch (error) {
      res.status(500).send({
        message: "BŁĄD" + error.message || "Error Occured!",
      });
    }
  } else {
    res.redirect("/login");
  }
};

exports.panelArticles = async (req, res) => {
  const cookies = req.cookies;
  if (cookies.user__sesion) {
    try {
      const posts = await Posts.find({}).sort({
        _id: -1,
      });

      res.render("panel-list", {
        title: "Kejtrip-lista",
        posts,
      });
    } catch (error) {
      res.status(500).send({
        message: "BŁĄD" + error.message || "Error Occured!",
      });
    }
  } else {
    res.redirect("/login");
  }
};
exports.upload = async (req, res) => {
  const cookies = req.cookies;
  if (cookies.user__sesion) {
    try {
      const infoErrorsObj = req.flash("infoErrors");
      const infoSubmitObj = req.flash("infoSubmit");

      res.render("upload", {
        title: "Kejtrip-upload",
        infoErrorsObj,
        infoSubmitObj,
      });
    } catch (error) {
      res.status(500).send({
        message: "BŁĄD" + error.message || "Error Occured!",
      });
    }
  } else {
    res.redirect("/login");
  }
};
exports.uploadPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    let imageCloudPath;
    const infoErrorsObj = req.flash("infoErrors");
    const infoSubmitObj = req.flash("infoSubmit");

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("no files were uploaded");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;
      console.log(uploadPath);
      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
      const result = await cloudinary.uploader.upload(
        uploadPath,
        {
          width: 700,
          q_auto: "good",
        },
        function (error, result) {
          imageCloudPath = result.url;
          if (!error) {
            fs.unlink(uploadPath, () => console.log("succes"));
          } else {
            console.log(error);
          }
        }
      );
    }
    const newImage = new Image({
      path: imageCloudPath,
      description: req.body.description,
      location: req.body.location,
      city: req.body.city,
    });

    await newImage.save();

    req.flash("infoSubmit", "Zdjęcie dodano do galerii!");
    res.redirect("/admin-panel/upload");
    // res.render('upload', {
    //     title: 'Kejtrip',
    //     infoErrorsObj,
    //     infoSubmitObj,

    // })
  } catch (error) {
    req.flash("infoErrors", error, error.message);
    res.redirect("/admin-panel/upload");
  }
};

exports.gallery = async (req, res) => {
  const cookies = req.cookies;
  if (cookies.user__sesion) {
    try {
      const imgs = await Image.find({}).sort({
        _id: -1,
      });

      res.send({
        imgs: imgs,
      });
    } catch (error) {
      res.status(500).send({
        message: "BŁĄD" + error.message || "Error Occured!",
      });
    }
  } else {
    res.redirect("/login");
  }
};

// Cookies

exports.cookies = async (req, res) => {
  try {
    res.cookie("Cookies", `true`, {
      // One month
      maxAge: 31 * 24 * 60 * 60 * 1000,
    });

    res.send({
      cookies: true,
    });

    res.end();
  } catch (error) {
    res.status(500).send({
      message: "BŁĄD" + error.message || "Error Occured!",
    });
  }
};
