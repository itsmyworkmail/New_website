'use client'

import { useState, useTransition } from 'react'
import { login, signup, signInWithGoogle } from '@/app/login/actions'
import { Chrome } from 'lucide-react'

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setMessage(null)
        setError(null)
        startTransition(async () => {
            if (isLogin) {
                const res = await login(formData)
                if (res?.error) setError(res.error)
            } else {
                const res = await signup(formData)
                if (res?.error) setError(res.error)
                if (res?.success) setMessage(res.message!)
            }
        })
    }

    return (
        <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2 text-white">
                    Welcome <span className="inline-block animate-wave origin-bottom-right">👋</span>
                </h1>
                <p className="text-gray-300">
                    {isLogin ? 'Login to access your tasks account' : 'Create your tasks account'}
                </p>
            </div>

            <form action={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-200">Name</label>
                        <input
                            name="full_name"
                            type="text"
                            required
                            placeholder="John Doe"
                            className="input-field bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/70 focus:bg-white/10 focus:ring-0 transition-all font-light force-white-text"
                        />
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="mail@abc.com"
                        className="input-field bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/70 focus:bg-white/10 focus:ring-0 transition-all font-light"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Password</label>
                    <input
                        name="password"
                        type="password"
                        required
                        placeholder="••••••••••••"
                        className="input-field bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/70 focus:bg-white/10 focus:ring-0 transition-all font-light"
                    />
                </div>

                {isLogin && (
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-600 bg-transparent text-primary focus:ring-primary" />
                            <span className="text-gray-300">Remember Me</span>
                        </label>
                        <a href="#" className="text-gray-300 hover:text-white transition-colors">Forgot Password?</a>
                    </div>
                )}

                {error && <div className="p-3 text-sm text-red-200 bg-red-900/50 rounded-lg border border-red-500/50">{error}</div>}
                {message && <div className="p-3 text-sm text-green-200 bg-green-900/50 rounded-lg border border-green-500/50">{message}</div>}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full btn-primary shadow-lg shadow-primary/20"
                >
                    {isPending ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>

            <div className="relative flex items-center justify-center mt-8">
                <div className="w-full border-t border-white/10"></div>
                <span className="px-4 text-sm text-gray-400 bg-transparent shrink-0">Or</span>
                <div className="w-full border-t border-white/10"></div>
            </div>

            <button
                onClick={() => signInWithGoogle()}
                className="mt-6 w-full bg-white text-gray-900 font-semibold py-3 px-4 rounded-full flex items-center justify-center space-x-2 hover:bg-gray-100 transition-colors shadow-lg"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                <span>Continue with Google</span>
            </button>


            <div className="mt-6 text-center text-sm">
                <span className="text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="font-semibold text-white underline decoration-primary decoration-2 underline-offset-4 hover:text-primary transition-colors"
                >
                    {isLogin ? 'Sign Up' : 'Login'}
                </button>
            </div>
        </div >
    )
}
