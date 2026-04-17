import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-card border-t border-border py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-gradient-primary">
                                <Heart className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold gradient-text">Lumina</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Supporting your mental wellness journey</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/chatbot" className="text-muted-foreground hover:text-primary transition-colors">
                                    AI Chat
                                </Link>
                            </li>
                            <li>
                                <Link to="/resources" className="text-muted-foreground hover:text-primary transition-colors">
                                    Resources
                                </Link>
                            </li>
                            <li>
                                <Link to="/community" className="text-muted-foreground hover:text-primary transition-colors">
                                    Community
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/counseling" className="text-muted-foreground hover:text-primary transition-colors">
                                    Get Counseling
                                </Link>
                            </li>
                            <li>
                                <Link to="/emergency" className="text-muted-foreground hover:text-primary transition-colors">
                                    Emergency Help
                                </Link>
                            </li>
                            <li>
                                <a href="mailto:help@lumina.com" className="text-muted-foreground hover:text-primary transition-colors">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-muted-foreground hover:text-primary transition-colors">
                                    Cookie Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; 2025 Lumina. All rights reserved. Supporting mental wellness for everyone.</p>
                </div>
            </div>
        </footer>
    )
}
