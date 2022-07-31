const { urlencoded } = require("express");
const mongoose = require("mongoose");
const { marked } = require("marked");

const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const dompurify = createDomPurify(new JSDOM().window);

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "This fild is required.",
  },

  data: {
    type: Date,
    default: new Date(),
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

  postContent: {
    type: String,
    required: "This field is required.",
  },

  sanitizedHtml: {
    type: String,
    required: true,
  },

  image: {
    type: String,
    required: "This field is required.",
  },
  comments: {
    type: Array,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },

  status: {
    // Two types
    type: String,
    enum: ["Produkcja", "Publikacja"],
    // required: 'This field is required.',
  },
});

// Walidacja
postSchema.pre("validate", function (next) {
  if (this.postContent) {
    this.sanitizedHtml = dompurify.sanitize(marked(this.postContent));
    console.log(this.sanitizedHtml);
  } else {
    console.log("Nie ma markdown");
  }

  next();
});

// Wyszukiwanie po indexach ---->

postSchema.index({
  title: "text",
  location: "text",
  city: "text",
});
// Do wypróbowania wildCard indexing
// postSchema.index({"$**":'text'})
module.exports = mongoose.model("Post", postSchema);
