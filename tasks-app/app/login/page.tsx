import AuthForm from '@/components/AuthForm'
import Image from 'next/image'

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full relative flex items-center justify-start px-4 sm:px-12 lg:px-24 overflow-hidden">
            {/* Background Image */}
            <Image
                src="/login-bg.png"
                alt="Login Background"
                fill
                className="object-cover z-0"
                priority
                quality={100}
            />

            {/* Gradient Overlay for better text readability and blending */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent z-0"></div>

            {/* Auth Content */}
            <div className="z-10 w-full max-w-md">
                <AuthForm />
            </div>
        </div>
    )
}
