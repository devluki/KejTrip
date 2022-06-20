const {
    urlencoded
} = require('express');
const mongoose = require('mongoose');
const {
    marked
} = require('marked')


const createDomPurify = require('dompurify');
const {
    JSDOM
} = require('jsdom');

const dompurify = createDomPurify(new JSDOM().window);

const routeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,

    },

    startLocation: {
        type: String,
        required: true,
    },

    startLongitude: {
        type: String,
        required: true,
    },

    startLatitude: {
        type: String,
        required: true,
    },
    endLocation: {
        type: String,
        required: true,
    },
    endLongitude: {
        type: String,
        required: true,
    },

    endLatitude: {
        type: String,
        required: true,
    },
    midPoints: {
        type: String,
        required: true,
    },

    routing: {
        type: Array,
        default: ''
    },

    distance: {
        type: Number,
        default: ''
    },




    routeDescription: {
        type: String,
        required: true,
    },

    sanitizedHtml: {
        type: String,
        required: true
    },

    status: {
        // Two types 
        type: String,
        enum: ['Produkcja', 'Publikacja'],
        required: true,
    },
});


// Walidacja
routeSchema.pre('validate', function (next) {
    if (this.routeDescription) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.routeDescription))
        console.log(this.sanitizedHtml);



    } else {
        console.log('Nie ma markdown');
    }


    next()
})


module.exports = mongoose.model('Routes', routeSchema);