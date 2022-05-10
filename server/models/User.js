const {
    urlencoded
} = require('express');
const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    login: {
        type: String,
        required: 'This fild is required.',

    },



    password: {
        type: String,
        required: true
    },



});




// Do wypróbowania wildCard indexing
// postSchema.index({"$**":'text'}) 
module.exports = mongoose.model('user', userSchema);