import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, CheckCircle2, AlertCircle } from "lucide-react"
import api from '@/lib/api'
import { useNavigate } from 'react-router-dom'

const START_HOUR = 8
const END_HOUR = 20

const getTodayISO = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const to12HourLabel = (hour24, minute) => {
    const meridiem = hour24 >= 12 ? 'PM' : 'AM'
    const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12
    return `${String(hour12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${meridiem}`
}

const parseTime12ToMinutes = (time12) => {
    const match = time12.match(/^(\d{1,2}):(\d{2})\s(AM|PM)$/)
    if (!match) return null

    const hourPart = Number(match[1])
    const minutePart = Number(match[2])
    const meridiem = match[3]

    let hour24 = hourPart % 12
    if (meridiem === 'PM') hour24 += 12

    return hour24 * 60 + minutePart
}

const buildAllSlots = () => {
    const slots = []
    for (let hour = START_HOUR; hour <= END_HOUR; hour += 1) {
        for (const minute of [0, 30]) {
            if (hour === END_HOUR && minute > 0) continue
            slots.push(to12HourLabel(hour, minute))
        }
    }
    return slots
}

export default function CounselingComponent() {
    const navigate = useNavigate()
    const todayISO = getTodayISO()
    const [formData, setFormData] = useState({
        counselorId: "",
        date: "",
        time: "",
        concern: "",
        contactPhone: "",
        anonymous: false,
    })
    const [counselors, setCounselors] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState(null)
    const [bookedTimes, setBookedTimes] = useState([])
    const [loadingBookedTimes, setLoadingBookedTimes] = useState(false)
    const [showTimePicker, setShowTimePicker] = useState(false)
    const timePickerRef = useRef(null)

    const availableTimeSlots = useMemo(() => {
        const slots = buildAllSlots()
        if (!formData.date) return slots

        if (formData.date !== todayISO) return slots

        const now = new Date()
        const nowMinutes = now.getHours() * 60 + now.getMinutes()
        return slots.filter((slot) => {
            const slotMinutes = parseTime12ToMinutes(slot)
            return slotMinutes !== null && slotMinutes > nowMinutes
        })
    }, [formData.date, todayISO])

    const selectableTimeSlots = useMemo(() => {
        if (!bookedTimes.length) return availableTimeSlots
        const blocked = new Set(bookedTimes)
        return availableTimeSlots.filter((slot) => !blocked.has(slot))
    }, [availableTimeSlots, bookedTimes])

    const bookedTimesSet = useMemo(() => new Set(bookedTimes), [bookedTimes])

    useEffect(() => {
        if (formData.time && !selectableTimeSlots.includes(formData.time)) {
            setFormData((prev) => ({ ...prev, time: "" }))
        }
    }, [selectableTimeSlots, formData.time])

    useEffect(() => {
        if (!showTimePicker) return

        const handleClickOutside = (event) => {
            if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
                setShowTimePicker(false)
            }
        }

        const handleEscClose = (event) => {
            if (event.key === 'Escape') {
                setShowTimePicker(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleEscClose)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscClose)
        }
    }, [showTimePicker])

    useEffect(() => {
        fetchCounselors()
    }, [])

    useEffect(() => {
        const fetchBookedSlots = async () => {
            if (!formData.counselorId || !formData.date) {
                setBookedTimes([])
                setShowTimePicker(false)
                return
            }

            setLoadingBookedTimes(true)
            try {
                const { data } = await api.get('/appointment/booked-slots', {
                    params: {
                        counselorId: formData.counselorId,
                        date: formData.date,
                    },
                })

                if (data.success) {
                    setBookedTimes(data.data.bookedTimes || [])
                }
            } catch (fetchError) {
                console.error('Failed to fetch booked slots', fetchError)
                setBookedTimes([])
            } finally {
                setLoadingBookedTimes(false)
            }
        }

        fetchBookedSlots()
    }, [formData.counselorId, formData.date])

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

            if (!formData.date || formData.date < todayISO) {
                setError("Please select today or a future date")
                setSubmitting(false)
                return
            }

            const selectedMinutes = parseTime12ToMinutes(formData.time)
            if (selectedMinutes === null) {
                setError("Please select a valid time")
                setSubmitting(false)
                return
            }

            if (formData.date === todayISO) {
                const now = new Date()
                const nowMinutes = now.getHours() * 60 + now.getMinutes()
                if (selectedMinutes <= nowMinutes) {
                    setError("Please select a time that has not passed")
                    setSubmitting(false)
                    return
                }
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
                                        min={todayISO}
                                        required
                                        className="pl-10 bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Preferred Time *</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (!formData.counselorId || !formData.date || loadingBookedTimes) return
                                            setShowTimePicker((prev) => !prev)
                                        }}
                                        disabled={!formData.counselorId || !formData.date || loadingBookedTimes}
                                        className="w-full h-10 rounded-md pl-10 pr-3 text-sm bg-background/50 border border-primary/20 text-foreground text-left focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {loadingBookedTimes ? 'Loading slots...' : (formData.time || 'Select time (AM/PM)')}
                                    </button>

                                    <input type="hidden" required value={formData.time} readOnly />

                                    {showTimePicker && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-20 bg-black/40 md:hidden"
                                                onClick={() => setShowTimePicker(false)}
                                            />
                                            <div
                                                ref={timePickerRef}
                                                className="fixed left-4 right-4 top-1/2 -translate-y-1/2 z-30 rounded-lg border border-primary/20 bg-card shadow-xl p-3 max-h-[70vh] overflow-y-auto md:absolute md:left-0 md:right-0 md:top-auto md:translate-y-0 md:mt-2 md:max-h-none"
                                            >
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-xs text-muted-foreground">Select a slot</p>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowTimePicker(false)}
                                                    className="text-xs text-muted-foreground hover:text-foreground"
                                                >
                                                    Close
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
                                                {availableTimeSlots.map((slot) => {
                                                    const isBooked = bookedTimesSet.has(slot)
                                                    const isSelected = formData.time === slot
                                                    return (
                                                        <button
                                                            key={slot}
                                                            type="button"
                                                            disabled={isBooked}
                                                            onClick={() => {
                                                                setFormData((prev) => ({ ...prev, time: slot }))
                                                                setShowTimePicker(false)
                                                            }}
                                                            className={`px-2 py-2 rounded text-xs font-medium border transition-colors ${
                                                                isBooked
                                                                    ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 opacity-60 cursor-not-allowed'
                                                                    : isSelected
                                                                        ? 'bg-green-600 text-white border-green-600'
                                                                        : 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
                                                            }`}
                                                        >
                                                            {slot}
                                                        </button>
                                                    )
                                                })}
                                            </div>

                                            <div className="flex items-center gap-4 mt-3 text-[11px]">
                                                <span className="inline-flex items-center gap-1 text-green-700 dark:text-green-300">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                                    Available
                                                </span>
                                                <span className="inline-flex items-center gap-1 text-red-700 dark:text-red-300">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                                    Booked
                                                </span>
                                            </div>
                                        </div>
                                        </>
                                    )}
                                </div>
                                {!formData.date && (
                                    <p className="text-xs text-muted-foreground">Please pick a date first to view available slots.</p>
                                )}
                                {formData.date && !formData.counselorId && (
                                    <p className="text-xs text-muted-foreground">Please select a counselor first.</p>
                                )}
                                {formData.date === todayISO && availableTimeSlots.length === 0 && (
                                    <p className="text-xs text-yellow-600">No slots left for today. Please choose another date.</p>
                                )}
                                {formData.counselorId && formData.date && !loadingBookedTimes && selectableTimeSlots.length === 0 && (
                                    <p className="text-xs text-red-500">No available slots for this counselor on the selected date.</p>
                                )}
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

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Contact Phone Number *</label>
                            <Input
                                type="tel"
                                inputMode="tel"
                                value={formData.contactPhone}
                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                placeholder="e.g. +91 9876543210"
                                required
                                className="bg-background/50 border-primary/20 focus-visible:ring-primary/50"
                            />
                            <p className="text-xs text-muted-foreground">
                                This number is used only for appointment coordination and urgent counselor follow-up.
                            </p>
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

                        <p className="text-xs text-muted-foreground">
                            {formData.anonymous
                                ? "Private is ON: your request is marked private. Only you, your assigned counselor, and admin can view session details."
                                : "Private is OFF: your appointment follows normal visibility rules inside your counselor and admin workflow."}
                        </p>

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
