import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '@/lib/api'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Shield, GraduationCap } from 'lucide-react'

export default function Register() {
    // Default to 'student' role
    const [role, setRole] = useState('student')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        speciality: '',
        credentials: ''
    })

    const handleRegister = async (e) => {
        e.preventDefault()
        try {
            // Include role in registration data
            const { data } = await api.post('/auth/register', { ...formData, role });
            if (data.success) {
                if (role === 'counselor') {
                    alert('Registration successful! Your account is pending approval. You can login now, but features will be limited until an admin approves your credentials.');
                    window.location.href = '/login';
                } else {
                    localStorage.setItem('user', JSON.stringify({
                        ...data,
                        token: data.token
                    }));
                    alert(`Registration successful! Welcome ${data.name}`);
                    window.location.href = '/';
                }
            }
        } catch (error) {
            console.error('Registration error:', error);
            const message = error.response?.data?.message || 'Registration failed';
            alert(message);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-secondary/20 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            <Card className="w-full max-w-md border-border bg-card/80 backdrop-blur-md shadow-xl">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold gradient-text">Create Account</CardTitle>
                    <CardDescription>
                        Join Lumina to start your journey
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="student" className="w-full" onValueChange={(value) => setRole(value)}>
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="student" className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" /> Student
                            </TabsTrigger>
                            <TabsTrigger value="counselor" className="flex items-center gap-2">
                                <User className="w-4 h-4" /> Counselor
                            </TabsTrigger>
                            <TabsTrigger value="admin" className="flex items-center gap-2">
                                <Shield className="w-4 h-4" /> Admin
                            </TabsTrigger>
                        </TabsList>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">
                                    Full Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="John Doe"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                                    Password
                                </label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            {role === 'counselor' && (
                                <>
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <label className="text-sm font-medium leading-none" htmlFor="speciality">
                                            Speciality
                                        </label>
                                        <Input
                                            id="speciality"
                                            name="speciality"
                                            placeholder="e.g. Anxiety, Depression, Academic Stress"
                                            required={role === 'counselor'}
                                            value={formData.speciality}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
                                        <label className="text-sm font-medium leading-none" htmlFor="credentials">
                                            Proof of Credibility
                                        </label>
                                        <Input
                                            id="credentials"
                                            name="credentials"
                                            placeholder="License No. or LinkedIn URL"
                                            required={role === 'counselor'}
                                            value={formData.credentials}
                                            onChange={handleChange}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Your account will be pending approval by an administrator.
                                        </p>
                                    </div>
                                </>
                            )}

                            <Button type="submit" className="w-full bg-gradient-primary text-white shadow-lg hover:shadow-xl transition-all duration-300">
                                Sign Up as {role.charAt(0).toUpperCase() + role.slice(1)}
                            </Button>
                        </form>
                    </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 text-center text-sm text-muted-foreground">
                    <div>
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline font-medium">
                            Sign in
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
