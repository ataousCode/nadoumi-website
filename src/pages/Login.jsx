import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import AuthHeader from '../features/auth/components/AuthHeader.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import { validate } from '../utils/validation.js';
import { authService } from '../api/auth.service.js';
import { useToast } from '../context/ToastContext.jsx';

function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect');
  const toast = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailError = validate.email(formData.email) || validate.required(formData.email);
    const passwordError = validate.required(formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }
    
    setIsLoading(true);
    try {
      await authService.login(formData.email, formData.password);
      toast.success('Login successful! Welcome back.');
      navigate(redirectPath || '/applications');
    } catch (err) {
      toast.error(err.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row overflow-hidden font-sans">
      {/* Left: Hero Image Section */}
      <div className="hidden md:flex md:w-[45%] relative bg-gray-900 overflow-hidden">
        <img 
          src="/assets/images/auth-hero.png" 
          alt="Modern Chinese Campus" 
          className="absolute inset-0 w-full h-full object-cover opacity-50 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-600/90 via-orange-500/80 to-transparent" />
        
        <div className="relative z-10 p-16 flex flex-col justify-center h-full text-white max-w-xl animate-fade-in-up">
           <div className="w-12 h-1 bg-white mb-8 rounded-full opacity-50" />
           <h1 className="text-5xl lg:text-6xl font-black mb-6 leading-[1.05] tracking-tighter">
             Your Future Begins <br/> in China
           </h1>
           <p className="text-xl text-white/90 font-medium leading-relaxed max-w-sm">
             Join 50,000+ scholars on the most trusted scholarship platform for international students.
           </p>
        </div>
      </div>

      {/* Right: Login Form Section */}
      <div className="w-full md:w-[55%] flex flex-col bg-white">
        <AuthHeader />
        
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-full max-w-sm">
            <div className="mb-12">
              <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Sign In</h2>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
                New here? <Link to="/application" className="text-orange-600 hover:text-orange-700 transition-colors">Create account</Link>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <Input 
                label="Email Address" 
                type="email" 
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                error={errors.email}
                className="rounded-xl border-gray-100 bg-gray-50/50 py-3.5 focus:bg-white transition-all text-sm font-bold"
                icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                required
              />

              <div className="space-y-2">
                <Input 
                  label="Password" 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  error={errors.password}
                  className="rounded-xl border-gray-100 bg-gray-50/50 py-3.5 focus:bg-white transition-all text-sm font-bold"
                  icon={<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
                  required
                />
                <div className="flex justify-end">
                   <Link to="/forgot-password" title="Recover Password" className="text-[10px] font-black text-orange-600 uppercase tracking-widest hover:text-orange-700 transition-colors">
                     Forgot Password?
                   </Link>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4.5 rounded-xl bg-gray-900 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-gray-200 transition-all hover:bg-orange-600 hover:shadow-orange-100 active:scale-[0.98]"
              >
                {isLoading ? 'Signing In...' : 'Go to Dashboard'}
              </button>
            </form>

            <div className="relative my-12">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-50"></div>
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.25em] font-black text-gray-300 bg-white px-4">
                Other access methods
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all font-bold text-[11px] text-gray-600 uppercase tracking-widest">
                <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-4 h-4 grayscale opacity-50 group-hover:grayscale-0 transition-all" alt="Google" />
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-3.5 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-gray-200 transition-all font-bold text-[11px] text-gray-600 uppercase tracking-widest">
                <svg className="w-4 h-4 text-[#07C160]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.527 3.659 1.442 5.166l-1.218 4.453 4.549-1.192C8.196 21.432 10.013 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 1.5c4.694 0 8.5 3.806 8.5 8.5s-3.806 8.5-8.5 8.5c-1.684 0-3.245-.491-4.558-1.332l-.326-.209-2.731.716.732-2.673-.232-.341C3.899 15.316 3.5 13.7 3.5 12c0-4.694 3.806-8.5 8.5-8.5zm-3.5 4a1 1 0 100 2 1 1 0 000-2zm7 0a1 1 0 100 2 1 1 0 000-2zM8 13.5c0 2.209 1.791 4 4 4s4-1.791 4-4H8z"/>
                </svg>
                WeChat
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 text-center border-t border-gray-50 opacity-50">
           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-loose">
             © 2024 Nadoumi Academic Network. All rights reserved. <br/>
             Official partner of Ministry of Education scholarship programs.
           </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
