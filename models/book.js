const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    pdfPath: {
        type: String,
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true
    }
});

const books = mongoose.model('books', bookSchema);

module.exports = books