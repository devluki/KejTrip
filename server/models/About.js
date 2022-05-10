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

const aboutSchema = new mongoose.Schema({

    title: {
        type: String,
        required: 'This fild is required.',

    },



    postContent: {
        type: String,
        required: true
    },

    sanitizedHtml: {
        type: String,
        required: true
    },


    image: {
        type: String,
        // required: 'This fild is required.',
    }

});


// Walidacja
aboutSchema.pre('validate', function (next) {
    if (this.postContent) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.postContent))
        console.log(this.sanitizedHtml);



    } else {
        console.log('Nie ma markdown');
    }


    next()
})


module.exports = mongoose.model('About', aboutSchema);