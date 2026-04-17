import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Pencil, Plus, Share2, Trash2, X } from "lucide-react"
import api from "@/lib/api"
import { useAuth } from "@/context/AuthContext"

function formatTime(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
}

function initialsFromAlias(alias) {
    if (!alias || typeof alias !== "string") return "A"

    const clean = alias.trim()
    if (!clean) return "A"

    // Pick capitals from camel case aliases like QuietEcho -> QE.
    const capitals = clean.match(/[A-Z]/g)
    if (capitals && capitals.length >= 2) {
        return `${capitals[0]}${capitals[1]}`
    }

    return clean.slice(0, 2).toUpperCase()
}

export default function CommunityComponent() {
    const { user } = useAuth()
    const [posts, setPosts] = useState([])
    const [myPosts, setMyPosts] = useState([])
    const [newPost, setNewPost] = useState("")
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [hasMore, setHasMore] = useState(true)
    const [replyDrafts, setReplyDrafts] = useState({})
    const [activeReplyBox, setActiveReplyBox] = useState(null)
    const [editingReply, setEditingReply] = useState(null)
    const [editingReplyText, setEditingReplyText] = useState("")
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showMyPostsModal, setShowMyPostsModal] = useState(false)
    const [highlightedPostId, setHighlightedPostId] = useState(null)
    const postRefs = useRef({})
    const loadMoreRef = useRef(null)

    const isLoggedIn = Boolean(user?.token)

    const myPostIds = useMemo(() => new Set(myPosts.map((post) => post._id)), [myPosts])

    const updatePostLists = (postId, updater) => {
        setPosts((prev) => prev.map((post) => (post._id === postId ? updater(post) : post)))
        setMyPosts((prev) => prev.map((post) => (post._id === postId ? updater(post) : post)))
    }

    const fetchPostsPage = async (page, { reset = false } = {}) => {
        const { data } = await api.get(`/community/posts?page=${page}&limit=10`)
        if (data.success) {
            setPosts((prev) => (reset ? data.data : [...prev, ...data.data]))
            setCurrentPage(data.pagination?.page || page)
            setHasMore(Boolean(data.pagination?.hasMore))
        }
    }

    const fetchMyPosts = async () => {
        if (!isLoggedIn) {
            setMyPosts([])
            return
        }

        const { data } = await api.get("/community/my-posts")
        if (data.success) {
            setMyPosts(data.data)
        }
    }

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                await fetchPostsPage(1, { reset: true })
                await fetchMyPosts()
            } catch (error) {
                console.error("Failed to load community posts", error)
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [isLoggedIn])

    useEffect(() => {
        if (loading || loadingMore || !hasMore) return
        const target = loadMoreRef.current
        if (!target) return

        const observer = new IntersectionObserver(
            async (entries) => {
                const entry = entries[0]
                if (!entry.isIntersecting) return

                try {
                    setLoadingMore(true)
                    await fetchPostsPage(currentPage + 1)
                } catch (error) {
                    console.error("Failed to load more posts", error)
                } finally {
                    setLoadingMore(false)
                }
            },
            { rootMargin: "250px" }
        )

        observer.observe(target)
        return () => observer.disconnect()
    }, [currentPage, hasMore, loading, loadingMore])

    const requireLogin = (actionName) => {
        if (!isLoggedIn) {
            alert(`Please login to ${actionName}.`)
            return false
        }
        return true
    }

    const handlePost = async () => {
        if (!requireLogin("create a post")) return
        if (!newPost.trim()) return

        try {
            const { data } = await api.post("/community/posts", {
                content: newPost,
                isAnonymous: true,
            })

            if (data.success) {
                setPosts((prev) => [data.data, ...prev])
                setMyPosts((prev) => [data.data, ...prev])
                setNewPost("")
                setShowCreateModal(false)
            }
        } catch (error) {
            console.error("Failed to create post", error)
            alert(error.response?.data?.message || "Failed to create post")
        }
    }

    const toggleLike = async (id) => {
        if (!requireLogin("like posts")) return

        try {
            const { data } = await api.patch(`/community/posts/${id}/like`)
            if (data.success) {
                updatePostLists(id, (post) => ({
                    ...post,
                    likesCount: data.data.likesCount,
                    likedByMe: data.data.likedByMe,
                }))
            }
        } catch (error) {
            console.error("Failed to toggle like", error)
            alert(error.response?.data?.message || "Failed to like post")
        }
    }

    const handleReply = async (postId) => {
        if (!requireLogin("reply")) return
        const content = (replyDrafts[postId] || "").trim()
        if (!content) return

        try {
            const { data } = await api.post(`/community/posts/${postId}/replies`, { content })
            if (data.success) {
                updatePostLists(postId, (post) => ({
                    ...post,
                    repliesCount: data.repliesCount,
                    replies: [...(post.replies || []), data.data],
                }))

                setReplyDrafts((prev) => ({ ...prev, [postId]: "" }))
            }
        } catch (error) {
            console.error("Failed to add reply", error)
            alert(error.response?.data?.message || "Failed to add reply")
        }
    }

    const startEditReply = (postId, reply) => {
        setEditingReply({ postId, replyId: reply._id })
        setEditingReplyText(reply.content)
    }

    const cancelEditReply = () => {
        setEditingReply(null)
        setEditingReplyText("")
    }

    const saveEditReply = async () => {
        if (!editingReply) return
        if (!editingReplyText.trim()) return

        try {
            const { data } = await api.patch(
                `/community/posts/${editingReply.postId}/replies/${editingReply.replyId}`,
                { content: editingReplyText }
            )

            if (data.success) {
                updatePostLists(editingReply.postId, (post) => ({
                    ...post,
                    replies: (post.replies || []).map((reply) =>
                        reply._id === editingReply.replyId ? { ...reply, ...data.data } : reply
                    ),
                }))
                cancelEditReply()
            }
        } catch (error) {
            console.error("Failed to edit reply", error)
            alert(error.response?.data?.message || "Failed to edit reply")
        }
    }

    const deleteReply = async (postId, replyId) => {
        if (!requireLogin("delete replies")) return
        if (!window.confirm("Delete this reply?")) return

        try {
            const { data } = await api.delete(`/community/posts/${postId}/replies/${replyId}`)
            if (data.success) {
                updatePostLists(postId, (post) => ({
                    ...post,
                    repliesCount: data.repliesCount,
                    replies: (post.replies || []).filter((reply) => reply._id !== replyId),
                }))
            }
        } catch (error) {
            console.error("Failed to delete reply", error)
            alert(error.response?.data?.message || "Failed to delete reply")
        }
    }

    const deletePost = async (postId) => {
        if (!requireLogin("delete posts")) return
        if (!window.confirm("Delete this post? This action cannot be undone.")) return

        try {
            const { data } = await api.delete(`/community/posts/${postId}`)
            if (data.success) {
                setPosts((prev) => prev.filter((post) => post._id !== postId))
                setMyPosts((prev) => prev.filter((post) => post._id !== postId))
            }
        } catch (error) {
            console.error("Failed to delete post", error)
            alert(error.response?.data?.message || "Failed to delete post")
        }
    }

    const sharePost = async (postId) => {
        const shareUrl = `${window.location.origin}/community?post=${postId}`
        try {
            await navigator.clipboard.writeText(shareUrl)
            alert("Post link copied to clipboard")
        } catch (error) {
            console.error("Failed to copy post link", error)
            alert("Unable to copy link")
        }
    }

    const closeModals = () => {
        setShowCreateModal(false)
        setShowMyPostsModal(false)
    }

    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === "Escape") {
                closeModals()
            }
        }

        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [])

    const openCreateModal = () => {
        if (!requireLogin("create a post")) return
        setShowCreateModal(true)
    }

    const openMyPostsModal = () => {
        if (!requireLogin("view your posts")) return
        setShowMyPostsModal(true)
    }

    const goToPost = (postId) => {
        setShowMyPostsModal(false)
        setTimeout(() => {
            const target = postRefs.current[postId]
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "center" })
                setHighlightedPostId(postId)
                setTimeout(() => setHighlightedPostId(null), 1800)
            }
        }, 150)
    }

    if (loading) {
        return <div className="text-center text-muted-foreground py-8">Loading community posts...</div>
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3">
                <Button onClick={openCreateModal} className="bg-gradient-primary hover:opacity-90 text-white">
                    <Plus className="w-4 h-4 mr-2" /> Create Post
                </Button>
                <Button variant="outline" onClick={openMyPostsModal}>
                    My Posts
                </Button>
            </div>

            {showCreateModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowCreateModal(false)
                        }
                    }}
                >
                    <Card className="w-full max-w-2xl p-4 md:p-6 bg-card border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg md:text-xl font-semibold text-foreground">Create a Post</h3>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-foreground"
                                onClick={() => setShowCreateModal(false)}
                                aria-label="Close create post modal"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <Textarea
                            placeholder="Share your thoughts anonymously..."
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            className="mb-4 border-primary/20 bg-background/50 min-h-[120px]"
                        />
                        <div className="flex justify-between items-center gap-3">
                            <p className="text-xs text-muted-foreground">
                                Your post will be anonymous and visible to everyone.
                            </p>
                            <Button
                                onClick={handlePost}
                                disabled={!newPost.trim()}
                                className="bg-gradient-primary hover:opacity-90 text-white"
                            >
                                Share with Community
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {showMyPostsModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowMyPostsModal(false)
                        }
                    }}
                >
                    <Card className="w-full max-w-3xl p-4 md:p-6 bg-card border-border max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg md:text-xl font-semibold text-foreground">My Posts</h3>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-foreground"
                                onClick={() => setShowMyPostsModal(false)}
                                aria-label="Close my posts modal"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {myPosts.length === 0 ? (
                            <p className="text-sm text-muted-foreground">You have not posted yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {myPosts.map((post) => (
                                    <div key={post._id} className="p-4 rounded-lg border border-border bg-card/50">
                                        <p className="text-foreground leading-relaxed">{post.content}</p>
                                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground gap-2">
                                            <span>{formatTime(post.createdAt)}</span>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => goToPost(post._id)}
                                                >
                                                    Go to post
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                    onClick={() => deletePost(post._id)}
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            )}

            <div className="space-y-4">
                {posts.map((post) => (
                    <Card
                        key={post._id}
                        ref={(el) => {
                            postRefs.current[post._id] = el
                        }}
                        className={`p-6 border-border bg-card/30 hover:bg-card/50 transition-colors ${
                            highlightedPostId === post._id ? "ring-2 ring-primary/60" : ""
                        }`}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                    <span className="font-bold text-primary">{initialsFromAlias(post.author)}</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{post.author || "Anonymous"}</p>
                                    <p className="text-xs text-muted-foreground">{formatTime(post.createdAt)}</p>
                                </div>
                            </div>
                            {myPostIds.has(post._id) && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                    onClick={() => deletePost(post._id)}
                                    aria-label="Delete post"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        <p className="text-foreground mb-6 leading-relaxed">{post.content}</p>

                        <div className="flex gap-6 pt-4 border-t border-border">
                            <button
                                onClick={() => toggleLike(post._id)}
                                className={`flex items-center gap-2 text-sm transition-colors ${post.likedByMe ? "text-pink-500" : "text-muted-foreground hover:text-pink-500"
                                    }`}
                            >
                                <Heart className={`w-4 h-4 ${post.likedByMe ? "fill-current" : ""}`} />
                                {post.likesCount}
                            </button>
                            <button
                                onClick={() => {
                                    if (!isLoggedIn) {
                                        alert("Please login to reply.")
                                        return
                                    }
                                    setActiveReplyBox((prev) => (prev === post._id ? null : post._id))
                                }}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                {post.repliesCount}
                            </button>
                            <button
                                onClick={() => sharePost(post._id)}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto"
                            >
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>

                        {activeReplyBox === post._id && (
                            <div className="mt-4 space-y-3">
                                <Textarea
                                    value={replyDrafts[post._id] || ""}
                                    onChange={(e) =>
                                        setReplyDrafts((prev) => ({
                                            ...prev,
                                            [post._id]: e.target.value,
                                        }))
                                    }
                                    placeholder="Write an anonymous reply..."
                                    className="border-primary/20 bg-background/50 min-h-[80px]"
                                />
                                <div className="flex justify-end">
                                    <Button
                                        size="sm"
                                        className="bg-gradient-primary hover:opacity-90 text-white"
                                        onClick={() => handleReply(post._id)}
                                        disabled={!(replyDrafts[post._id] || "").trim()}
                                    >
                                        Post Reply
                                    </Button>
                                </div>
                            </div>
                        )}

                        {post.replies?.length > 0 && (
                            <div className="mt-4 space-y-2 border-t border-border pt-3">
                                {post.replies.map((reply) => (
                                    <div key={reply._id} className="rounded-lg bg-muted/40 px-3 py-2">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold text-foreground">{reply.author || "Anonymous"}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs text-muted-foreground">{formatTime(reply.createdAt)}</p>
                                                {reply.canEdit && (
                                                    <button
                                                        onClick={() => startEditReply(post._id, reply)}
                                                        className="text-xs text-primary hover:underline"
                                                    >
                                                        <Pencil className="w-3 h-3 inline mr-1" />Edit
                                                    </button>
                                                )}
                                                {reply.canDelete && (
                                                    <button
                                                        onClick={() => deleteReply(post._id, reply._id)}
                                                        className="text-xs text-red-500 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {editingReply?.postId === post._id && editingReply?.replyId === reply._id ? (
                                            <div className="mt-2 space-y-2">
                                                <Textarea
                                                    value={editingReplyText}
                                                    onChange={(e) => setEditingReplyText(e.target.value)}
                                                    className="border-primary/20 bg-background/60 min-h-[80px]"
                                                />
                                                <div className="flex justify-end gap-2">
                                                    <Button size="sm" variant="outline" onClick={cancelEditReply}>
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-gradient-primary hover:opacity-90 text-white"
                                                        onClick={saveEditReply}
                                                        disabled={!editingReplyText.trim()}
                                                    >
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-foreground mt-1 leading-relaxed">{reply.content}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                ))}

                {posts.length === 0 && (
                    <Card className="p-6 border-border bg-card/50 text-center text-muted-foreground">
                        No posts yet. Be the first one to share.
                    </Card>
                )}

                {posts.length > 0 && (
                    <div ref={loadMoreRef} className="py-3 text-center text-sm text-muted-foreground">
                        {loadingMore ? "Loading more posts..." : hasMore ? "Scroll for more posts" : "You reached the end"}
                    </div>
                )}
            </div>
        </div>
    )
}
