const mongoose = require('mongoose');

const replySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        alias: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
            default: 'QuietEcho',
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

const communityPostSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        alias: {
            type: String,
            required: true,
            trim: true,
            maxlength: 80,
            default: 'QuietEcho',
        },
        content: {
            type: String,
            required: true,
            trim: true,
            maxlength: 1200,
        },
        isAnonymous: {
            type: Boolean,
            default: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        replies: [replySchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model('CommunityPost', communityPostSchema);
