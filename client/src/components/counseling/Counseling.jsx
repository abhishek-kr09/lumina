import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, CheckCircle2, AlertCircle } from "lucide-react"
import api from '@/lib/api'
import { useNavigate } from 'react-router-dom'

export default function CounselingComponent() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        counselorId: "",
        date: "",
        time: "",
        concern: "",
        anonymous: false,
    })
    const [counselors, setCounselors] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchCounselors()
    }, [])

    const fetchCounselors = async () => {
        try {
            const { data } = await api.get('/auth/counselors')
            if (data.success) {
                setCounselors(data.data)
            }
        } catch (error) {
            console.error("Failed to fetch counselors", error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            if (!formData.counselorId) {
                setError("Please select a counselor")
                setSubmitting(false)
                return
            }

            const { data } = await api.post('/appointment/book', formData)
            if (data.success) {
                setSubmitted(true)
                setTimeout(() => {
                    navigate('/student-dashboard')
                }, 3000)
            }
        } catch (error) {
            console.error("Booking error:", error)
            setError(error.response?.data?.message || "Failed to book appointment")
        } finally {
            setSubmitting(false)
        }
    }

    const selectCounselor = (id) => {
        setFormData({ ...formData, counselorId: id })
    }

    if (submitted) {
        return (
            <Card className="p-8 text-center bg-card/50 backdrop-blur border-border shadow-xl">
                <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-6 animate-float">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Request Submitted</h2>
                <p className="text-muted-foreground">Your appointment request has been sent. Redirecting...</p>
            </Card>
        )
    }

    return (
        <Tabs defaultValue="counselors" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 bg-muted/50 p-1 rounded-xl mb-8">
                <TabsTrigger value="counselors" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Select Counselor</TabsTrigger>
                <TabsTrigger value="request" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Book Session</TabsTrigger>
            </TabsList>

            <TabsContent value="counselors" className="space-y-4">
                {loading ? (
                    <p>Loading counselors...</p>
                ) : counselors.length === 0 ? (
                    <p className="text-center text-muted-foreground">No counselors available at the moment.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {counselors.map((counselor) => (
                            <Card
                                key={counselor._id}
                                onClick={() => selectCounselor(counselor._id)}
                                className={`p-6 border-border bg-card/50 backdrop-blur hover:border-primary/50 transition-all duration-300 group cursor-pointer ${formData.counselorId === counselor._id ? 'border-primary ring-1 ring-primary' : ''}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground mb-1">{counselor.name}</h3>
                                        <p className="text-sm text-primary font-medium mb-2">{counselor.email}</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                                            <Clock className="w-3 h-3" />
                                            Available this week
                                        </div>
                                        <Button
                                            size="sm"
                                            className={`border-0 ${formData.counselorId === counselor._id ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'}`}
                                        >
                                            {formData.counselorId === counselor._id ? 'Selected' : 'Select Counselor'}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </TabsContent>

            <TabsContent value="request">
                <Card className="p-6 md:p-8 bg-card/50 backdrop-blur border-border">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 rounded bg-red-100 dark:bg-red-900/20 text-red-600 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        {!formData.counselorId && (
                            <div className="p-3 rounded bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 text-sm flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" />
                                Please go to "Select Counselor" tab and choose a counselor first.
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Preferred Date *</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                        className="pl-10 bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Preferred Time *</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        required
                                        className="pl-10 bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">What would you like to discuss?</label>
                            <Textarea
                                value={formData.concern}
                                onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                                placeholder="Share what's on your mind... (required)"
                                required
                                className="bg-background/50 border-primary/20 focus-visible:ring-primary/50 min-h-[120px]"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="anonymous"
                                checked={formData.anonymous}
                                onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                                className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary"
                            />
                            <label htmlFor="anonymous" className="text-sm text-muted-foreground cursor-pointer select-none">
                                Keep session details private (Counselor will still see your name)
                            </label>
                        </div>

                        <Button
                            type="submit"
                            disabled={submitting || !formData.counselorId}
                            className="w-full bg-gradient-primary hover:opacity-90 text-white h-12 text-lg"
                        >
                            {submitting ? 'Submitting...' : 'Request Counseling Session'}
                        </Button>
                    </form>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
