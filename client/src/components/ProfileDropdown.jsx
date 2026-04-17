import { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function ProfileDropdown() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <div className="relative ml-3" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:opacity-90 transition-all shadow-md flex items-center justify-center border-2 border-background ring-2 ring-primary/20"
                aria-label="User menu"
            >
                {user?.name ? (
                    <span className="text-lg font-bold">
                        {user.name.charAt(0).toUpperCase()}
                    </span>
                ) : (
                    <User className="w-5 h-5" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-popover shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-border">
                    <div className="py-1">
                        <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                            <p className="font-medium truncate">{user?.email}</p>
                            <p className="text-xs capitalize text-primary mt-0.5">{user?.role}</p>
                        </div>

                        <button
                            onClick={() => {
                                logout();
                                setIsOpen(false);
                            }}
                            className="group flex w-full items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                            Sign out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
