import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Lock, Mail, AlertCircle, ShieldCheck, UserCheck, UserPlus, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const Login = () => {
  const location = useLocation();
  const isSignupPath = location.pathname === '/signup';

  const [mode, setMode] = useState(isSignupPath ? 'signup' : 'login');
  
  // Isolated Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Isolated Signup state
  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupCourse, setSignupCourse] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [createdStudent, setCreatedStudent] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, signupStudent } = useAuth();
  const navigate = useNavigate();

  const resetForm = () => {
    setLoginEmail('');
    setLoginPassword('');
    setShowLoginPassword(false);
    setSignupFullName('');
    setSignupEmail('');
    setSignupPhone('');
    setSignupCourse('');
    setSignupPassword('');
    setShowSignupPassword(false);
    setErrorMsg('');
  };

  useEffect(() => {
    setMode(location.pathname === '/signup' ? 'signup' : 'login');
    resetForm();
  }, [location.pathname]);

  // LOGIN SUBMIT
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await login(loginEmail, loginPassword);
    setLoading(false);

    if (res.success) {
      if (res.role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else if (res.role === 'TEACHER') navigate('/teacher/dashboard', { replace: true });
      else navigate('/student/dashboard', { replace: true });
    } else {
      setErrorMsg(res.error || 'Invalid credentials. Please verify your Email/ID and Password.');
    }
  };

  // STUDENT SIGNUP SUBMIT
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = await signupStudent({
      name: signupFullName,
      email: signupEmail,
      password: signupPassword,
      phone: signupPhone,
      course: signupCourse || 'B.Tech Computer Science & Engineering'
    });

    setLoading(false);

    if (res.success) {
      setCreatedStudent(res.user);
      setSignupSuccess(true);
    } else {
      setErrorMsg(res.error || 'Failed to create student account.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-16 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      
      {/* Background Subtle Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gold/10 blur-3xl -z-0" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center space-x-3 group mb-4">
          <img src="/logo.png" alt="Kalpanaaa Crest Logo" className="h-12 w-auto object-contain filter drop-shadow-md" />
          <div className="flex flex-col text-left">
            <span className="text-2xl font-serif font-bold text-navy leading-tight">KALPANAAA</span>
            <span className="text-[10px] font-bold tracking-[0.25em] text-gold uppercase">EDUCATION PORTAL</span>
          </div>
        </Link>

        <h2 className="text-3xl font-serif font-bold text-navy tracking-tight">
          {mode === 'login' ? 'Institutional Portal Login' : 'Student Account Registration'}
        </h2>
        <p className="mt-2 text-xs text-slate-600">
          {mode === 'login' 
            ? 'Enter your registered credentials to access your institutional dashboard.'
            : 'Fill in your details below to register your student account.'
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10">
          
          {/* Mode Switcher Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
            <button
              onClick={() => { setMode('login'); resetForm(); }}
              className={`flex-1 py-2 text-xs font-sans font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5 ${
                mode === 'login' ? 'bg-navy text-gold shadow' : 'text-slate-600 hover:text-navy'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>PORTAL LOGIN</span>
            </button>
            <button
              onClick={() => { setMode('signup'); resetForm(); }}
              className={`flex-1 py-2 text-xs font-sans font-bold rounded-lg transition-colors flex items-center justify-center space-x-1.5 ${
                mode === 'signup' ? 'bg-navy text-gold shadow' : 'text-slate-600 hover:text-navy'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>STUDENT SIGNUP</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-3 font-sans">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form className="space-y-5" onSubmit={handleLoginSubmit} autoComplete="off">
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email / Student ID / Employee ID
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    name="login_identifier_no_autofill"
                    autoComplete="off"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your Email or ID"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="mb-1">
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    name="login_pwd_no_autofill"
                    autoComplete="new-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 transition-colors"
                    title={showLoginPassword ? "Hide password" : "Show password"}
                  >
                    {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg font-sans font-bold text-xs uppercase tracking-widest text-navy-dark bg-gold hover:bg-gold-hover transition-all focus:outline-none disabled:opacity-50"
              >
                {loading ? 'AUTHENTICATING...' : 'LOGIN TO PORTAL'}
                {!loading && <LogIn className="w-4 h-4 ml-2" />}
              </button>

            </form>
          ) : signupSuccess ? (
            <div className="text-center space-y-4 py-4 font-sans">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif font-bold text-navy">Student Account Created!</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your student account has been saved with Student ID: <strong className="text-navy font-num font-bold">{createdStudent?.studentId}</strong>.
              </p>
              <button
                onClick={() => { 
                  setMode('login'); 
                  setLoginEmail(createdStudent?.email || '');
                  setLoginPassword('');
                  setSignupSuccess(false); 
                }}
                className="w-full bg-gold hover:bg-gold-hover text-navy-dark font-sans font-bold text-xs py-3 rounded-xl uppercase tracking-wider shadow"
              >
                LOG IN WITH YOUR NEW STUDENT ACCOUNT
              </button>
            </div>
          ) : (
            <form className="space-y-4 font-sans" onSubmit={handleSignupSubmit} autoComplete="off">
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Student Name *
                </label>
                <input
                  type="text"
                  required
                  name="signup_fullname_field"
                  autoComplete="off"
                  value={signupFullName}
                  onChange={(e) => setSignupFullName(e.target.value)}
                  placeholder="e.g. Priya Sundaram"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Student Email Address *
                </label>
                <input
                  type="email"
                  required
                  name="signup_email_field"
                  autoComplete="off"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="priya@example.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Select Enrolled Course
                </label>
                <select
                  value={signupCourse}
                  onChange={(e) => setSignupCourse(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:border-gold"
                >
                  <option value="">-- Select Enrolled Course --</option>
                  <option value="B.Tech Computer Science & Engineering">B.Tech Computer Science & Engineering</option>
                  <option value="B.Tech Information Technology">B.Tech Information Technology</option>
                  <option value="Master of Business Administration (MBA)">Master of Business Administration (MBA)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Create Password *
                </label>
                <div className="relative">
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    name="signup_password_field"
                    autoComplete="new-password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-gold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1 transition-colors"
                    title={showSignupPassword ? "Hide password" : "Show password"}
                  >
                    {showSignupPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg font-sans font-bold text-xs uppercase tracking-widest text-navy-dark bg-gold hover:bg-gold-hover transition-all focus:outline-none disabled:opacity-50 mt-2"
              >
                {loading ? 'REGISTERING STUDENT...' : 'REGISTER STUDENT ACCOUNT'}
              </button>
            </form>
          )}

        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs font-bold text-slate-500 hover:text-navy transition-colors font-sans">
            &larr; Return to Public College Website
          </Link>
        </div>
      </div>
    </div>
  );
};
