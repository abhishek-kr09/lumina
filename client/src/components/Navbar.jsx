import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import ProfileDropdown from './ProfileDropdown'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const { user } = useAuth()

    const links = [
        { href: '/', label: 'Home' },
        { href: '/chatbot', label: 'AI Chat' },
        { href: '/assessment', label: 'Assessment' },
        { href: '/resources', label: 'Resources' },
        { href: '/community', label: 'Community' },
        { href: '/counseling', label: 'Counseling' },
        { href: '/emergency', label: 'Emergency' },
    ]

    const roleLinks = []
    if (user?.role === 'admin') {
        roleLinks.push({ href: '/admin', label: 'Admin' })
    }
    if (user?.role === 'counselor') {
        roleLinks.push({ href: '/counselor-dashboard', label: 'Counselor Dashboard' })
    }

    const visibleLinks = [...links, ...roleLinks]

    return (
        <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                        <div className="p-2 rounded-lg bg-gradient-primary">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        <span className="gradient-text">Lumina</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-1 items-center">
                        {visibleLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-gradient-primary hover:text-white transition-all duration-300"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <ThemeToggle />
                        {user ? (
                            <ProfileDropdown />
                        ) : (
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-gradient-primary hover:text-white transition-all duration-300"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-1">
                        <ThemeToggle />
                        <button
                            className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4 space-y-2">
                        {visibleLinks.map((link) => (
                            <Link
                                key={link.href}
                                to={link.href}
                                className="block px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-gradient-primary hover:text-white transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {!user && (
                            <Link
                                to="/login"
                                className="block px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-gradient-primary hover:text-white transition-all duration-300"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                        {user && (
                            <div className="px-4 py-2">
                                <ProfileDropdown />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}
