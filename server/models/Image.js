const {
    urlencoded
} = require('express');
const mongoose = require('mongoose');


const imageSchema = new mongoose.Schema({

    path: {
        type: String,
        required: 'This field is required.',

    },



    description: {
        type: String,
        // required: true
    },
    location: {
        type: String,
        // required: true
    },
    city: {
        type: String,
        // required: true
    },



});




// Do wypróbowania wildCard indexing
// postSchema.index({"$**":'text'}) 
module.exports = mongoose.model('image', imageSchema);