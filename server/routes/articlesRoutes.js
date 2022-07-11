const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articlesController');

//  App Routes - linked to recipe contoller
//  po kropce nazwa strony np. home itd
router.get('/', articlesController.homepage);
// router.get('/posts', recipeController.explorePosts);
router.get('/posts', articlesController.explorePosts);
// About
router.get('/about', articlesController.about);
// Post id
router.get('/post/:id', articlesController.readPost);
// Search
router.post('/search', articlesController.searchPost);
router.get('/search', articlesController.searchPostQuery);
// Directions
router.get('/destinations', articlesController.destinations)
// Post a post :) 
router.get('/submit-post', articlesController.submitPost)
router.post('/submit-post', articlesController.submitPostArticle)
// Delete post 
router.delete('/post/delete/:id', articlesController.deletePost);
// Edit post
router.get('/post/edit/:id', articlesController.editPost);
router.put('/put/:id', articlesController.editPut)
// likes
router.post('/post/:id', articlesController.addLikes)

// comments

router.post('/post-comment', articlesController.postComment);

// About
router.get('/submit-about', articlesController.submitAbout)
router.post('/submit-about', articlesController.submitAboutArticle)
// Edit about
router.get('/about/edit/6277aa34772ff87e9fe3119c', articlesController.editAbout);
router.put('/about/put/6277aa34772ff87e9fe3119c', articlesController.editPutAbout)


// Admin panel
router.get('/login', articlesController.login)
router.post('/login', articlesController.loginValidation)

router.get('/admin-panel', articlesController.adminPanel)
router.get('/admin-panel/list', articlesController.panelArticles)
// Uploads
router.get('/admin-panel/upload', articlesController.upload);
router.post('/admin-panel/upload', articlesController.uploadPost);

// Gallery API
router.get('/admin-panel/upload/gallery', articlesController.gallery)

// Map
router.get('/admin-panel/map', articlesController.map)
// Add pins
router.get('/admin-panel/map/add-pins', articlesController.addPins)
router.post('/admin-panel/map/add-pins', articlesController.submitAddPins)
// Pin list /edit/delete + pin API
router.get('/admin-panel/map/pins-list', articlesController.pinsList)
router.delete('/pin/delete/:id', articlesController.deletePin);
router.get('/admin-panel/map/edit-pin/:id', articlesController.editPin)
router.put('/admin-panel/map/put-pin/:id', articlesController.editPinPut)
// API pins
router.get('/map/pins', articlesController.pinsAPI)
// Add route
router.get('/admin-panel/map/add-route', articlesController.addRoute)
router.post('/admin-panel/map/add-route', articlesController.submitAddRoute)
// Route list/edit/delete
router.get('/admin-panel/map/edit-route/:id', articlesController.editRoute)
router.put('/admin-panel/map/put-route/:id', articlesController.editRoutePut)
router.get('/admin-panel/map/route-list', articlesController.routeList)
router.delete('/route/delete/:id', articlesController.deleteRoute);






module.exports = router;