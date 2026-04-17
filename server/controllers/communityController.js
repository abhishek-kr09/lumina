const CommunityPost = require('../models/CommunityPost');

const ALIAS_POOL = [
    'WillowWhisper', 'RiverRipple', 'SageSpirit', 'AspenLeaf', 'MossyPath', 'CedarSoul',
    'RainDrop', 'QuietEcho', 'SoftVeil', 'HushedGalaxy', 'VelvetMood', 'EtherealShade',
    'AmberGlow', 'BraveHeart', 'InnerHarmony', 'ResilientPulse', 'ClarityQuest', 'ThriveSpace',
    'CalmCypress', 'SereneLine', 'GentleGlow', 'MindfulMusing', 'PeacePulse', 'SolaceSpot',
    'RadiantRoute', 'BalanceBlueprint', 'HealthySprout', 'JoyfulJourney', 'BloomBright', 'SoulSync',
    'HavenHeart', 'HealingHarmony', 'KindredSpirit', 'QuietReflections', 'StillWaters', 'GroundedSteps',
    'OpenOrchid', 'MutedAzure', 'WhisperingPine', 'SteadyCurrent', 'SoftBreeze', 'MorningMist',
    'SilverLining', 'GoldenGully', 'TealTide',
];

const aliasFromId = (id) => {
    const idString = String(id || '');
    let hash = 0;
    for (let i = 0; i < idString.length; i += 1) {
        hash = (hash << 5) - hash + idString.charCodeAt(i);
        hash |= 0;
    }
    const index = Math.abs(hash) % ALIAS_POOL.length;
    return ALIAS_POOL[index];
};

const shapePostForResponse = (post, viewerId = null) => {
    const viewerIdStr = viewerId ? viewerId.toString() : null;
    const likes = post.likes || [];
    const isPostOwner = viewerIdStr ? post.userId?.toString() === viewerIdStr : false;

    return {
        _id: post._id,
        author: post.userId ? aliasFromId(post.userId) : (post.alias || aliasFromId(post._id)),
        content: post.content,
        isAnonymous: post.isAnonymous,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        likesCount: likes.length,
        likedByMe: viewerIdStr ? likes.some((id) => id.toString() === viewerIdStr) : false,
        repliesCount: post.replies?.length || 0,
        isOwner: isPostOwner,
        replies: (post.replies || []).map((reply) => ({
            _id: reply._id,
            author: reply.userId ? aliasFromId(reply.userId) : (reply.alias || aliasFromId(reply._id)),
            content: reply.content,
            createdAt: reply.createdAt,
            isOwner: viewerIdStr ? reply.userId?.toString() === viewerIdStr : false,
            canEdit: viewerIdStr ? reply.userId?.toString() === viewerIdStr : false,
            canDelete: viewerIdStr
                ? reply.userId?.toString() === viewerIdStr || isPostOwner
                : false,
        })),
    };
};

// @desc    Public feed (login optional)
// @route   GET /api/community/posts
// @access  Public
const getPosts = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
        const skip = (page - 1) * limit;

        const [posts, totalCount] = await Promise.all([
            CommunityPost.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            CommunityPost.countDocuments(),
        ]);

        const viewerId = req.user?.id || null;
        const data = posts.map((post) => shapePostForResponse(post, viewerId));
        const totalPages = Math.max(Math.ceil(totalCount / limit), 1);
        const hasMore = page < totalPages;

        res.status(200).json({
            success: true,
            count: data.length,
            data,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages,
                hasMore,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    My posts
// @route   GET /api/community/my-posts
// @access  Private
const getMyPosts = async (req, res) => {
    try {
        const posts = await CommunityPost.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .lean();

        const data = posts.map((post) => shapePostForResponse(post, req.user.id));
        res.status(200).json({ success: true, count: data.length, data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Create post
// @route   POST /api/community/posts
// @access  Private
const createPost = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: 'Post content is required' });
        }

        const post = await CommunityPost.create({
            userId: req.user.id,
            alias: aliasFromId(req.user.id),
            content: content.trim(),
            isAnonymous: true,
        });

        res.status(201).json({ success: true, data: shapePostForResponse(post.toObject(), req.user.id) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete own post
// @route   DELETE /api/community/posts/:id
// @access  Private
const deletePost = async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();
        res.status(200).json({ success: true, message: 'Post deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Toggle like
// @route   PATCH /api/community/posts/:id/like
// @access  Private
const toggleLike = async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const existingIndex = post.likes.findIndex((id) => id.toString() === req.user.id);

        if (existingIndex >= 0) {
            post.likes.splice(existingIndex, 1);
        } else {
            post.likes.push(req.user.id);
        }

        await post.save();

        res.status(200).json({
            success: true,
            data: {
                likesCount: post.likes.length,
                likedByMe: existingIndex < 0,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add reply
// @route   POST /api/community/posts/:id/replies
// @access  Private
const addReply = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: 'Reply content is required' });
        }

        const post = await CommunityPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        post.replies.push({
            userId: req.user.id,
            alias: aliasFromId(req.user.id),
            content: content.trim(),
        });

        await post.save();

        const latestReply = post.replies[post.replies.length - 1];
        res.status(201).json({
            success: true,
            data: {
                _id: latestReply._id,
                author: aliasFromId(latestReply.userId),
                content: latestReply.content,
                createdAt: latestReply.createdAt,
                isOwner: true,
                canEdit: true,
                canDelete: true,
            },
            repliesCount: post.replies.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Edit reply (reply owner only)
// @route   PATCH /api/community/posts/:postId/replies/:replyId
// @access  Private
const editReply = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content || !content.trim()) {
            return res.status(400).json({ success: false, message: 'Reply content is required' });
        }

        const post = await CommunityPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const reply = post.replies.id(req.params.replyId);
        if (!reply) {
            return res.status(404).json({ success: false, message: 'Reply not found' });
        }

        if (reply.userId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to edit this reply' });
        }

        reply.content = content.trim();
        await post.save();

        res.status(200).json({
            success: true,
            data: {
                _id: reply._id,
                author: aliasFromId(reply.userId),
                content: reply.content,
                createdAt: reply.createdAt,
                isOwner: true,
                canEdit: true,
                canDelete: true,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete reply (reply owner or post owner)
// @route   DELETE /api/community/posts/:postId/replies/:replyId
// @access  Private
const deleteReply = async (req, res) => {
    try {
        const post = await CommunityPost.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        const reply = post.replies.id(req.params.replyId);
        if (!reply) {
            return res.status(404).json({ success: false, message: 'Reply not found' });
        }

        const isReplyOwner = reply.userId.toString() === req.user.id;
        const isPostOwner = post.userId.toString() === req.user.id;

        if (!isReplyOwner && !isPostOwner) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this reply' });
        }

        reply.deleteOne();
        await post.save();

        res.status(200).json({
            success: true,
            message: 'Reply deleted',
            repliesCount: post.replies.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getPosts,
    getMyPosts,
    createPost,
    deletePost,
    toggleLike,
    addReply,
    editReply,
    deleteReply,
};
