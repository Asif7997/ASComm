import React, { useState } from 'react';
import { Globe, LogIn, UserPlus } from 'lucide-react';
import { login, signup } from '../services/authService';

interface AuthFormProps {
    onLoginSuccess: (user: any) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState(''); // ✅ Added
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const user = isLogin
                ? await login(email, password)
                : await signup({
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation // ✅ Fixed
                });
            onLoginSuccess(user);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error, please try again');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute -bottom-8 right-0 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

            <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                        <Globe className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">TradeFlow Pro</h1>
                    <p className="text-slate-500 mt-2">
                        {isLogin ? 'Global Import-Export Intelligence' : 'Create your account'}
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="w-full border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        className="w-full border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {!isLogin && (
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={passwordConfirmation}
                            onChange={e => setPasswordConfirmation(e.target.value)}
                            required
                            className="w-full border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : isLogin ? 'Login' : 'Sign Up'}
                        {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
                    </button>
                </form>

                <div className="mt-6 text-center text-slate-500">
                    {isLogin ? (
                        <p>
                            Don’t have an account?{' '}
                            <span
                                onClick={() => setIsLogin(false)}
                                className="text-blue-600 cursor-pointer font-semibold hover:underline"
                            >
                                Sign Up
                            </span>
                        </p>
                    ) : (
                        <p>
                            Already have an account?{' '}
                            <span
                                onClick={() => setIsLogin(true)}
                                className="text-blue-600 cursor-pointer font-semibold hover:underline"
                            >
                                Login
                            </span>
                        </p>
                    )}
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                    <p className="text-xs text-slate-400">© 2024 TradeFlow Technologies Inc. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;
