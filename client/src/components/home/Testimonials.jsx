import { Card } from '@/components/ui/card'
import { Star } from 'lucide-react'

export default function Testimonials() {
    const testimonials = [
        {
            name: "Abhishek",
            role: "Computer Science Student",
            content: "Lumina's personalized resources have been a game-changer for my mental well-being. It's exactly what students need.",
            rating: 5,
        },
        {
            name: "Harmeet",
            role: "Medical Student",
            content: "I've never felt more understood. The community here is so supportive and non-judgmental.",
            rating: 5,
        },
        {
            name: "Retik",
            role: "Engineering Graduate",
            content: "The AI chatbot is surprisingly effective. It really helps me process my thoughts during stressful times.",
            rating: 5,
        },
        {
            name: "Utkarsh",
            role: "Design Student",
            content: "Booking a counseling session was so easy. I'm glad I took that step towards better mental health.",
            rating: 5,
        },
        {
            name: "Akash",
            role: "Business Student",
            content: "The daily check-ins help me stay grounded. Highly recommended app for anyone feeling overwhelmed.",
            rating: 5,
        },
        {
            name: "Gautam Gambhir",
            role: "Sports Psychology Student",
            content: "The mental toughness resources here are exceptional. They really help in maintaining focus and resilience under pressure.",
            rating: 5,
        },
    ]

    return (
        <section className="px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Stories from <span className="gradient-text">Our Community</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">See how Lumina is helping students</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="p-6 border-border bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                            <div className="flex gap-1 mb-4">
                                {Array(testimonial.rating)
                                    .fill(null)
                                    .map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                                    ))}
                            </div>
                            <p className="text-foreground mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                                    {testimonial.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
