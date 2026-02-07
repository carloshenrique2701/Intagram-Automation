// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 2000
    },
    datePost: {
        type: Date,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    driveFileId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'posted', 'failed'],
        default: 'pending'
    }
}, { 
    timestamps: true 
});

// Índice para melhor performance
postSchema.index({ userId: 1, datePost: 1 });

module.exports = mongoose.model('Post', postSchema);