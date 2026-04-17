import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, RefreshCw } from "lucide-react"

export default function AssessmentComponent() {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [scores, setScores] = useState([])
    const [showResults, setShowResults] = useState(false)

    const questions = [
        "How often do you feel overwhelmed by stress?",
        "How is your sleep quality?",
        "Do you feel connected to your support network?",
        "How often do you experience anxiety?",
        "Rate your overall life satisfaction",
        "How well do you manage emotions?",
        "Do you have healthy coping mechanisms?",
        "How often do you practice self-care?",
    ]

    const handleAnswer = (score) => {
        const newScores = [...scores, score]
        setScores(newScores)

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
        } else {
            setShowResults(true)
        }
    }

    const getResultLevel = () => {
        const average = scores.reduce((a, b) => a + b, 0) / scores.length
        if (average >= 4) return "Excellent"
        if (average >= 3) return "Good"
        if (average >= 2) return "Fair"
        return "Needs Attention"
    }

    if (showResults) {
        return (
            <Card className="p-8 text-center bg-card/50 backdrop-blur border-border shadow-xl">
                <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-6 animate-float">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl font-bold text-foreground mb-2">Assessment Complete</h2>
                <p className="text-muted-foreground mb-8">Here's your wellness summary</p>

                <div className="bg-muted/50 rounded-2xl p-8 mb-8 border border-border">
                    <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Overall Status</p>
                    <p className="text-5xl font-bold gradient-text mb-4">{getResultLevel()}</p>
                    <p className="text-muted-foreground max-w-md mx-auto">
                        Based on your responses, your current mental wellness status appears to be {getResultLevel().toLowerCase()}.
                        We recommend exploring our resources and community for continued support.
                    </p>
                </div>

                <Button
                    onClick={() => {
                        setCurrentQuestion(0)
                        setScores([])
                        setShowResults(false)
                    }}
                    size="lg"
                    className="gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Retake Assessment
                </Button>
            </Card>
        )
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
        <Card className="p-8 bg-card/50 backdrop-blur border-border shadow-xl">
            <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-muted-foreground">
                        Question {currentQuestion + 1} of {questions.length}
                    </span>
                    <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
            </div>

            <div className="min-h-[120px] mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                    {questions[currentQuestion]}
                </h3>
            </div>

            <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((score) => (
                    <Button
                        key={score}
                        onClick={() => handleAnswer(score)}
                        variant="outline"
                        className="h-16 text-xl font-bold hover:bg-gradient-primary hover:text-white hover:border-transparent transition-all duration-300"
                    >
                        {score}
                    </Button>
                ))}
            </div>

            <div className="flex justify-between mt-4 px-2">
                <span className="text-xs text-muted-foreground">Not at all</span>
                <span className="text-xs text-muted-foreground">Very much</span>
            </div>
        </Card>
    )
}
