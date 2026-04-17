import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

const THEME_STORAGE_KEY = 'lumina-theme'

function getInitialTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => getInitialTheme())

    useEffect(() => {
        const root = document.documentElement
        const body = document.body
        const isDark = theme === 'dark'

        // Keep both html and body in sync so dark-mode classes and global backgrounds update reliably.
        root.classList.toggle('dark', isDark)
        body.classList.toggle('dark', isDark)
        root.style.colorScheme = isDark ? 'dark' : 'light'
        localStorage.setItem(THEME_STORAGE_KEY, theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    }

    const isDark = theme === 'dark'

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg text-foreground hover:bg-primary/10 transition-colors"
        >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
    )
}
