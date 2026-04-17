import { Card } from '@/components/ui/card'
import { MessageCircle, Brain, Users, FileText, Phone, BarChart3 } from 'lucide-react'

export default function Features() {
    const features = [
        {
            icon: MessageCircle,
            title: "AI Chatbot",
            description: "Talk to our AI about your feelings and get instant support and suggestions",
        },
        {
            icon: Brain,
            title: "Self-Assessment",
            description: "Understand your mental health with our guided wellness questionnaire",
        },
        {
            icon: FileText,
            title: "Resources",
            description: "Access meditation guides, breathing exercises, and coping strategies",
        },
        {
            icon: Users,
            title: "Community Wall",
            description: "Connect with peers anonymously and share your journey",
        },
        {
            icon: Phone,
            title: "Counseling",
            description: "Request sessions with professional mental health counselors",
        },
        {
            icon: BarChart3,
            title: "Emergency Help",
            description: "Quick access to crisis hotlines and emergency resources",
        },
    ]

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-20 bg-muted/20">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Comprehensive <span className="gradient-text">Mental Health Support</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Everything you need for your wellness journey, all in one place.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50 group bg-card/50 backdrop-blur-sm">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                    <Icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                                </div>
                                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
