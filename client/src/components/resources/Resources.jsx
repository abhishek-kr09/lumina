import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Play, BookOpen, Sparkles } from "lucide-react"

export default function ResourcesComponent() {
    const [searchTerm, setSearchTerm] = useState("")

    const resources = {
        meditation: [
            { title: "Guided Breathing", duration: "5 min", description: "Calm your mind with deep breathing" },
            { title: "Body Scan Meditation", duration: "10 min", description: "Release tension throughout your body" },
            { title: "Loving Kindness", duration: "8 min", description: "Cultivate compassion and self-love" },
            { title: "Sleep Meditation", duration: "15 min", description: "Prepare for restful sleep" },
        ],
        exercises: [
            { title: "5-4-3-2-1 Grounding", description: "Sensory grounding technique for anxiety" },
            { title: "Box Breathing", description: "Regulate your nervous system" },
            { title: "Progressive Muscle Relaxation", description: "Release physical tension" },
            { title: "Journaling Prompts", description: "Process emotions through writing" },
        ],
        strategies: [
            { title: "Stress Management", description: "Practical techniques for daily stress" },
            { title: "Sleep Hygiene", description: "Tips for better sleep quality" },
            { title: "Social Connection", description: "Build meaningful relationships" },
            { title: "Self-Compassion", description: "Treat yourself with kindness" },
        ],
    }

    const filteredResources = (type) => {
        return resources[type].filter(
            (r) =>
                r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                r.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    }

    return (
        <div className="space-y-8">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-primary/20 bg-card/50 backdrop-blur focus-visible:ring-primary/50"
                />
            </div>

            <Tabs defaultValue="meditation" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="meditation" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Meditation</TabsTrigger>
                    <TabsTrigger value="exercises" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Exercises</TabsTrigger>
                    <TabsTrigger value="strategies" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Strategies</TabsTrigger>
                </TabsList>

                <TabsContent value="meditation" className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredResources("meditation").map((item, i) => (
                            <Card key={i} className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 bg-card/50 backdrop-blur group">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                        <div className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                                            <Sparkles className="w-3 h-3" />
                                            {item.duration}
                                        </div>
                                    </div>
                                    <Button size="icon" className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
                                        <Play className="w-4 h-4 ml-0.5" />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="exercises" className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredResources("exercises").map((item, i) => (
                            <Card key={i} className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 bg-card/50 backdrop-blur group">
                                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                                <Button size="sm" variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                                    Start Exercise
                                </Button>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="strategies" className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredResources("strategies").map((item, i) => (
                            <Card key={i} className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 bg-card/50 backdrop-blur group">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                        <Button size="sm" variant="link" className="p-0 h-auto text-primary">
                                            Read more →
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
