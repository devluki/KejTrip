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

const postSchema = new mongoose.Schema({

    title: {
        type: String,
        required: 'This fild is required.',

    },

    category: {
        // Two types 
        type: String,
        enum: ['Poradnik', 'Relacja'],
    },
    data: {
        type: Date,
        default: new Date,
        //     // 
        //     // required: 'This fild is required.',
    },
    likes: {
        type: Number,
        default: 0,

    },

    location: {
        type: String,
    },

    city: {
        type: String,
    },

    // postContent: {
    //     type: Array,
    //     // type: Array,
    //     // required: 'This fild is required.',
    // },

    // markdown: {
    //     type: String,
    //     required: true
    // },
    postContent: {
        type: String,
        required: true
    },

    sanitizedHtml: {
        type: String,
        required: true
    },

    list: {
        type: Array,
    },

    image: {
        type: String,
        // required: 'This fild is required.',
    },
    comments: {
        type: Array,
    },
    commentsCount: {
        type: Number,
        default: 0,
    }
});


// Walidacja
postSchema.pre('validate', function (next) {
    if (this.postContent) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.postContent))
        console.log(this.sanitizedHtml);



    } else {
        console.log('Nie ma markdown');
    }


    next()
})

// Wyszukiwanie po indexach ---->

postSchema.index({
    title: 'text',
    location: 'text',
    city: 'text'
});
// Do wypróbowania wildCard indexing
// postSchema.index({"$**":'text'}) 
module.exports = mongoose.model('Post', postSchema);