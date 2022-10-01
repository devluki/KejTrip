const {
    urlencoded
} = require('express');
const mongoose = require('mongoose');


const resTestSchema = new mongoose.Schema({







    resContent: {
        type: String,
        // required: 'This fild is required.',
    },


});



module.exports = mongoose.model('ResTest', resTestSchema);