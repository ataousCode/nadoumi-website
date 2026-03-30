import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '../../features/auth/components/AuthHeader.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import { validate } from '../../utils/validation.js';
import { authService } from '../../api/auth.service.js';
import { useToast } from '../../context/ToastContext.jsx';
import logo from '../../assets/icons/logo.jpg';

function AdminLogin() {
  const navigate = useNavigate();
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
      await authService.adminLogin(formData.email, formData.password);
      toast.success('Admin access granted. Welcome to Nadoumi Portal.');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Invalid admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl shadow-blue-100/50 p-10 border border-gray-100">
        <div className="flex flex-col items-center mb-10 text-center">
          <img 
            src={logo} 
            alt="Nadoumi" 
            className="w-16 h-16 rounded-2xl shadow-lg ring-4 ring-gray-50 object-cover mb-6" 
          />
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter leading-none mb-2">Admin Portal</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Admin Email" 
            type="email" 
            placeholder="admin@nadoumi.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            error={errors.email}
            className="rounded-xl border-gray-100 bg-gray-50/50 py-3.5 focus:bg-white transition-all text-sm font-bold"
            required
          />

          <Input 
            label="Security Password" 
            type="password" 
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            error={errors.password}
            className="rounded-xl border-gray-100 bg-gray-50/50 py-3.5 focus:bg-white transition-all text-sm font-bold"
            required
          />

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4.5 rounded-xl bg-gray-900 text-white font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-gray-200 transition-all hover:bg-blue-600 hover:shadow-blue-100 active:scale-[0.98]"
          >
            {isLoading ? 'Verifying...' : 'Authenticate'}
          </Button>
        </form>

        <div className="mt-10 text-center pt-8 border-t border-gray-50 text-[9px] font-bold text-gray-300 uppercase tracking-[0.2em] leading-relaxed">
          Nadoumi Academic Network <br/>
          Secure Administration Layer v1.0
        </div>
      </div>
      
      <button 
        onClick={() => navigate('/login')}
        className="mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
      >
        Return to Student Login
      </button>
    </div>
  );
}

export default AdminLogin;
