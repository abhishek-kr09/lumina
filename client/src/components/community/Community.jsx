import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react"

export default function CommunityComponent() {
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: "Anonymous",
            content: "Just finished my first meditation! Feeling so calm.",
            likes: 24,
            comments: 3,
            time: "2h ago"
        },
        {
            id: 2,
            author: "Peer Support",
            content: "Struggled today but remembered I am stronger than my anxiety. Sending love to everyone here.",
            likes: 42,
            comments: 7,
            time: "5h ago"
        },
    ])
    const [newPost, setNewPost] = useState("")
    const [likedPosts, setLikedPosts] = useState(new Set())

    const handlePost = () => {
        if (!newPost.trim()) return
        const post = {
            id: posts.length + 1,
            author: "You",
            content: newPost,
            likes: 0,
            comments: 0,
            time: "Just now"
        }
        setPosts([post, ...posts])
        setNewPost("")
    }

    const toggleLike = (id) => {
        const newLiked = new Set(likedPosts)
        if (newLiked.has(id)) {
            newLiked.delete(id)
        } else {
            newLiked.add(id)
        }
        setLikedPosts(newLiked)
    }

    return (
        <div className="space-y-8">
            <Card className="p-6 bg-card/50 backdrop-blur border-border shadow-lg">
                <h3 className="font-semibold mb-4">Create a Post</h3>
                <Textarea
                    placeholder="Share your thoughts anonymously... (optional)"
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="mb-4 border-primary/20 bg-background/50 min-h-[100px]"
                />
                <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Your post will be anonymous</p>
                    <Button onClick={handlePost} disabled={!newPost.trim()} className="bg-gradient-primary hover:opacity-90 text-white">
                        Share with Community
                    </Button>
                </div>
            </Card>

            <div className="space-y-4">
                {posts.map((post) => (
                    <Card key={post.id} className="p-6 border-border bg-card/30 hover:bg-card/50 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                    <span className="font-bold text-primary">{post.author[0]}</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{post.author}</p>
                                    <p className="text-xs text-muted-foreground">{post.time}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                            </Button>
                        </div>

                        <p className="text-foreground mb-6 leading-relaxed">{post.content}</p>

                        <div className="flex gap-6 pt-4 border-t border-border">
                            <button
                                onClick={() => toggleLike(post.id)}
                                className={`flex items-center gap-2 text-sm transition-colors ${likedPosts.has(post.id) ? "text-pink-500" : "text-muted-foreground hover:text-pink-500"
                                    }`}
                            >
                                <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-current" : ""}`} />
                                {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                            </button>
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <MessageCircle className="w-4 h-4" />
                                {post.comments}
                            </button>
                            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors ml-auto">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
