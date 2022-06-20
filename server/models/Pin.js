const {
    urlencoded
} = require('express');
const mongoose = require('mongoose');


const pinSchema = new mongoose.Schema({

    pinLocation: {
        type: String,
        required: 'This fild is required.',

    },



    pinLongitude: {
        type: Number,
        required: 'This fild is required.',
    },

    pinLatitude: {
        type: Number,
        required: 'This fild is required.',
    },



    status: {
        // Two types 
        type: String,
        enum: ['Produkcja', 'Publikacja'],
        // required: 'This field is required.',
    },
});



module.exports = mongoose.model('Pin', pinSchema);