import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CommunityComponent from '@/components/community/Community'

export default function Community() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto w-full">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Community <span className="gradient-text">Wall</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Share your journey anonymously and support others in a safe, judgment-free space.
                    </p>
                </div>
                <CommunityComponent />
            </main>
            <Footer />
        </div>
    )
}
