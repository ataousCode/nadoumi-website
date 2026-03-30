import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthHeader from '../features/auth/components/AuthHeader.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { validate } from '../utils/validation.js';
import { authService } from '../api/auth.service.js';
import { useToast } from '../context/ToastContext.jsx';

function ForgotPassword() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validate.email(email) || validate.required(email);
    if (emailError) {
      setError(emailError);
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      toast.success('Recovery email sent successfully!');
      setIsSent(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send recovery email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-hidden">
      <AuthHeader className="border-b border-gray-50" />
      
      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(#ea580c05_1px,transparent_1px)] [background-size:32px_32px]" />
        
        <div className="w-full max-w-[400px] relative z-10 animate-fade-in-up">
          <div className="bg-white rounded-[32px] p-10 md:p-12 shadow-premium border border-gray-100/50 text-center">
            
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tighter leading-none">Recover Access</h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-10 leading-loose">
              Enter your email to receive a recovery link
            </p>

            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="text-left">
                  <Input 
                    label="University Email" 
                    type="email" 
                    placeholder="name@example.edu"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    error={error}
                    className="rounded-xl border-gray-100 bg-gray-50/50 py-3.5 focus:bg-white transition-all text-sm font-bold"
                    icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-gray-900 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-gray-200"
                >
                   {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            ) : (
              <div className="bg-orange-50/30 rounded-2xl p-8 border border-orange-100/50">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-100">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-gray-900 font-black text-lg mb-2 tracking-tight">Email Sent</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">
                  We've sent recovery instructions to <br/>
                  <span className="font-extrabold text-gray-900">{email}</span>
                </p>
                <button 
                  onClick={() => setIsSent(false)}
                  disabled={isLoading}
                  className="mt-6 text-orange-600 font-black text-[10px] uppercase tracking-widest hover:text-orange-700 transition-colors"
                >
                  Resend Link
                </button>
              </div>
            )}

            <div className="mt-10 pt-8 border-t border-gray-50">
               <Link to="/login" className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-orange-600 transition-colors flex items-center justify-center gap-2 group">
                 <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16l-4-4m0 0l4-4m-4 4h18" /></svg>
                 Return to Login
               </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center bg-white opacity-50">
           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-loose">
             © 2024 Nadoumi Academic Network. All rights reserved. <br/>
             Authorized partner of Ministry of Education scholarship programs.
           </p>
      </footer>
    </div>
  );
}

export default ForgotPassword;
