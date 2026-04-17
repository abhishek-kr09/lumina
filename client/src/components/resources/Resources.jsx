import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Play, BookOpen, Sparkles, X } from "lucide-react"

export default function ResourcesComponent() {
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("meditation")
    const [activeVideo, setActiveVideo] = useState(null)
    const [activeExercise, setActiveExercise] = useState(null)
    const [activeStrategy, setActiveStrategy] = useState(null)

    const resources = {
        meditation: [
            {
                id: "guided-breathing",
                title: "Guided Breathing",
                duration: "5 min",
                description: "Calm your mind with deep breathing",
                embedUrl: "https://www.youtube.com/embed/8vkYJf8DOsc"
            },
            {
                id: "body-scan",
                title: "Body Scan Meditation",
                duration: "30 min",
                description: "Release tension throughout your body",
                embedUrl: "https://www.youtube.com/embed/15q-N-_kkrU"
            },
            {
                id: "loving-kindness",
                title: "Loving Kindness",
                duration: "15 min",
                description: "Cultivate compassion and self-love",
                embedUrl: "https://www.youtube.com/embed/sz7cpV7ERsM"
            },
            {
                id: "sleep-meditation",
                title: "Sleep Meditation",
                duration: "10 min",
                description: "Prepare for restful sleep",
                embedUrl: "https://www.youtube.com/embed/aEqlQvczMJQ"
            },
        ],
        exercises: [
            {
                id: "grounding-54321",
                title: "5-4-3-2-1 Grounding",
                description: "Sensory grounding technique for anxiety",
                steps: [
                    "Pause and take one slow breath.",
                    "Name 5 things you can see.",
                    "Name 4 things you can feel.",
                    "Name 3 things you can hear.",
                    "Name 2 things you can smell.",
                    "Name 1 thing you can taste.",
                ]
            },
            {
                id: "box-breathing",
                title: "Box Breathing",
                description: "Regulate your nervous system",
                steps: [
                    "Sit comfortably and relax your shoulders.",
                    "Inhale slowly for 4 seconds.",
                    "Hold your breath for 4 seconds.",
                    "Exhale slowly for 4 seconds.",
                    "Hold again for 4 seconds.",
                    "Repeat this cycle for 2 to 5 minutes.",
                ]
            },
            {
                id: "pmr",
                title: "Progressive Muscle Relaxation",
                description: "Release physical tension",
                steps: [
                    "Start from your toes and tense muscles for 5 seconds.",
                    "Release and notice the relaxed feeling for 10 seconds.",
                    "Move to calves, thighs, and hips one by one.",
                    "Continue through stomach, hands, arms, and shoulders.",
                    "Finish with face and jaw, then breathe deeply.",
                ]
            },
            {
                id: "journaling-prompts",
                title: "Journaling Prompts",
                description: "Process emotions through writing",
                steps: [
                    "Write: What am I feeling right now?",
                    "Write: What triggered this feeling today?",
                    "Write: What is one kind thing I can do for myself now?",
                    "Write: What is one small action I can take next?",
                    "Close with one line of gratitude.",
                ]
            },
        ],
        strategies: [
            {
                id: "stress-management",
                title: "Stress Management",
                description: "Practical techniques for daily stress",
                overview:
                    "Stress is your body’s alert system, and it becomes harmful when your mind stays in alert mode for too long. Instead of trying to eliminate stress completely, the goal is to lower its intensity and recover faster after pressure peaks.",
                practicalTip:
                    "Use a 3-part rhythm each day: 25-40 minutes of focused work, 5 minutes of recovery, then a quick reset (water, stretch, breathing) before the next task.",
                steps: [
                    "Write down your top 3 priorities for today. Ignore everything else until these are done.",
                    "Break each priority into the smallest next action (for example: open notes, write first paragraph, send one message).",
                    "Set a timer and work in short focus blocks with tiny breaks.",
                    "When overwhelmed, pause and do 6 slow breaths before resuming.",
                    "At night, note one win and one lesson instead of replaying the whole day.",
                ]
            },
            {
                id: "sleep-hygiene",
                title: "Sleep Hygiene",
                description: "Tips for better sleep quality",
                overview:
                    "Better sleep is built through consistency, not just tiredness. A stable routine trains your body clock so you fall asleep faster, wake up clearer, and reduce emotional reactivity during the day.",
                practicalTip:
                    "Protect the last 45-60 minutes before bed as a wind-down zone: lower lights, reduce phone stimulation, and avoid difficult conversations or heavy work.",
                steps: [
                    "Pick a realistic fixed sleep and wake time, even on weekends.",
                    "Stop caffeine at least 6-8 hours before bedtime.",
                    "Keep your room cool, dark, and quiet.",
                    "If your mind races, do a 2-minute brain dump on paper before bed.",
                    "If you cannot sleep after about 20 minutes, get up briefly, do a calm activity, then return to bed.",
                ]
            },
            {
                id: "social-connection",
                title: "Social Connection",
                description: "Build meaningful relationships",
                overview:
                    "Meaningful connection improves resilience and lowers stress load. You do not need a large circle; one or two emotionally safe people can make a major difference to mental wellbeing.",
                practicalTip:
                    "Aim for depth over frequency: one honest 15-minute conversation can be more healing than constant surface-level chat.",
                steps: [
                    "Choose one person you trust and send a simple check-in message today.",
                    "Use clear language: 'I have been feeling low/stressed lately and wanted to talk.'",
                    "Schedule one recurring weekly connection call or walk.",
                    "In conversations, ask one genuine question and share one real feeling.",
                    "If support feels unavailable, join one campus/community group aligned with your interests.",
                ]
            },
            {
                id: "self-compassion",
                title: "Self-Compassion",
                description: "Treat yourself with kindness",
                overview:
                    "Self-compassion is not weakness or giving up. It means responding to your mistakes with honesty and care, so you can recover and improve instead of getting stuck in shame.",
                practicalTip:
                    "When you notice self-criticism, ask: 'What would I say to a close friend in this same situation?' Then use those exact words for yourself.",
                steps: [
                    "Catch one harsh thought and rewrite it in a kinder, realistic way.",
                    "Name the feeling without judgment: 'I feel anxious/disappointed right now.'",
                    "Remind yourself: 'Struggling does not mean I am failing. I am learning.'",
                    "Take one caring action now (water, walk, stretch, rest, reach out).",
                    "End the day with one sentence of appreciation for your effort.",
                ]
            },
        ],
    }

    const filteredResources = (type) => {
        const query = searchTerm.trim().toLowerCase()
        if (!query) return resources[type]

        return resources[type].filter(
            (r) =>
                r.title.toLowerCase().includes(query) ||
                r.description.toLowerCase().includes(query) ||
                (r.duration && r.duration.toLowerCase().includes(query)) ||
                (r.overview && r.overview.toLowerCase().includes(query)) ||
                (r.practicalTip && r.practicalTip.toLowerCase().includes(query)) ||
                (r.steps && r.steps.join(" ").toLowerCase().includes(query)),
        )
    }

    useEffect(() => {
        const query = searchTerm.trim()
        if (!query) return

        const resultsByTab = {
            meditation: filteredResources("meditation").length,
            exercises: filteredResources("exercises").length,
            strategies: filteredResources("strategies").length,
        }

        if (resultsByTab[activeTab] > 0) return

        const firstMatchingTab = Object.entries(resultsByTab).find(([, count]) => count > 0)
        if (firstMatchingTab) {
            setActiveTab(firstMatchingTab[0])
        }
    }, [searchTerm, activeTab])

    return (
        <div className="space-y-8">
            {activeVideo && (
                <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center">
                    <Card className="w-full max-w-4xl p-4 md:p-6 bg-card border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg md:text-xl font-semibold text-foreground">{activeVideo.title}</h3>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-foreground"
                                onClick={() => setActiveVideo(null)}
                                aria-label="Close video"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg border border-border">
                            <iframe
                                title={activeVideo.title}
                                src={activeVideo.embedUrl}
                                className="absolute top-0 left-0 w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </Card>
                </div>
            )}

            {activeExercise && (
                <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center">
                    <Card className="w-full max-w-3xl p-4 md:p-6 bg-card border-border max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg md:text-xl font-semibold text-foreground">{activeExercise.title}</h3>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-foreground"
                                onClick={() => setActiveExercise(null)}
                                aria-label="Close exercise"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{activeExercise.description}</p>
                        <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                            <p className="text-sm font-medium text-foreground mb-2">Simple Steps</p>
                            <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                                {activeExercise.steps.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </Card>
                </div>
            )}

            {activeStrategy && (
                <div className="fixed inset-0 z-50 bg-black/70 p-4 flex items-center justify-center">
                    <Card className="w-full max-w-3xl p-4 md:p-6 bg-card border-border max-h-[85vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg md:text-xl font-semibold text-foreground">{activeStrategy.title}</h3>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-foreground"
                                onClick={() => setActiveStrategy(null)}
                                aria-label="Close strategy"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{activeStrategy.overview}</p>
                        <p className="mt-3 text-foreground/90 leading-relaxed">
                            <span className="font-semibold text-foreground">Quick tip: </span>
                            {activeStrategy.practicalTip}
                        </p>
                        <div className="mt-4 p-4 rounded-lg border border-border bg-muted/40">
                            <p className="text-foreground font-semibold mb-2">Simple Action Plan</p>
                            <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                                {activeStrategy.steps.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                ))}
                            </ol>
                        </div>
                    </Card>
                </div>
            )}

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 border-primary/20 bg-card/50 backdrop-blur focus-visible:ring-primary/50"
                />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="meditation" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Meditation</TabsTrigger>
                    <TabsTrigger value="exercises" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Exercises</TabsTrigger>
                    <TabsTrigger value="strategies" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Strategies</TabsTrigger>
                </TabsList>

                <TabsContent value="meditation" className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredResources("meditation").map((item) => (
                            <Card key={item.id} className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 bg-card/50 backdrop-blur group">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                        <div className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                                            <Sparkles className="w-3 h-3" />
                                            {item.duration}
                                        </div>
                                    </div>
                                    <Button
                                        size="icon"
                                        className="rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                                        onClick={() => setActiveVideo(item)}
                                        aria-label={`Play ${item.title}`}
                                    >
                                        <Play className="w-4 h-4 ml-0.5" />
                                    </Button>
                                </div>
                            </Card>
                        ))}

                        {filteredResources("meditation").length === 0 && (
                            <Card className="p-6 border-border bg-card/50 text-center text-muted-foreground md:col-span-2">
                                No meditation resources found for "{searchTerm}".
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="exercises" className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredResources("exercises").map((item) => (
                            <Card key={item.id} className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 bg-card/50 backdrop-blur group">
                                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all"
                                    onClick={() => setActiveExercise(item)}
                                >
                                    Start Exercise
                                </Button>
                            </Card>
                        ))}

                        {filteredResources("exercises").length === 0 && (
                            <Card className="p-6 border-border bg-card/50 text-center text-muted-foreground md:col-span-2">
                                No exercises found for "{searchTerm}".
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="strategies" className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredResources("strategies").map((item) => (
                            <Card key={item.id} className="p-6 hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 bg-card/50 backdrop-blur group">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                                        <Button
                                            size="sm"
                                            variant="link"
                                            className="p-0 h-auto text-primary"
                                            onClick={() => setActiveStrategy(item)}
                                        >
                                            Read more →
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}

                        {filteredResources("strategies").length === 0 && (
                            <Card className="p-6 border-border bg-card/50 text-center text-muted-foreground md:col-span-2">
                                No strategies found for "{searchTerm}".
                            </Card>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
