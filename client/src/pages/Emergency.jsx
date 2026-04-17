import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import EmergencyComponent from '@/components/emergency/Emergency'

export default function Emergency() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-12 max-w-6xl mx-auto w-full">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Emergency & <span className="text-destructive">Crisis Support</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Immediate help is always available. You are not alone.
                    </p>
                </div>
                <EmergencyComponent />
            </main>
            <Footer />
        </div>
    )
}
