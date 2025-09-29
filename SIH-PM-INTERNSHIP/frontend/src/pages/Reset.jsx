import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { LoadingAnimation } from "../components/Loading";
import { motion } from 'framer-motion';
import { FaKey, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Reset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const { resetUser, btnLoading } = UserData();
  const navigate = useNavigate();
  const { token } = useParams();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 0;
    const regex = {
      length: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    };
    
    // Count how many criteria are met
    Object.values(regex).forEach(met => {
      if (met) strength++;
    });
    
    if (strength <= 2) return "weak";
    if (strength <= 4) return "medium";
    return "strong";
  };

  const getPasswordStrengthColor = (password) => {
    const strength = checkPasswordStrength(password);
    if (strength === "weak") return "bg-red-500";
    if (strength === "medium") return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = (password) => {
    if (!password) return "";
    const strength = checkPasswordStrength(password);
    if (strength === "weak") return "Weak";
    if (strength === "medium") return "Medium";
    return "Strong";
  };

  const submitHandler = (e) => {
    e.preventDefault();
    
    // Validation
    if (!otp.trim() || !password.trim() || !confirmPassword.trim()) {
      setFormError("All fields are required");
      return;
    }
    
    if (otp.length !== 6) {
      setFormError("OTP must be 6 digits");
      return;
    }
    
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long");
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError("Passwords do not match");
      return;
    }
    
    setFormError("");
    resetUser(token, otp, password, navigate);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div 
      className='min-h-screen flex flex-col'
      style={{
        background: "linear-gradient(to right, rgba(255,153,51,0.15) 0%, rgba(255,255,255,0.95) 33%, rgba(255,255,255,0.95) 67%, rgba(19,136,8,0.15) 100%)",
      }}
    >
      {/* Decorative Pattern Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6B35' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Main Content */}
      <div className='flex-grow flex items-center justify-center p-6 relative z-10'>
        <motion.div 
          className='w-full max-w-md'
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Reset Password Card */}
          <div className='rounded-2xl shadow-lg overflow-hidden bg-white/95 backdrop-blur-md border border-orange-100/50'>
            {/* Header Section */}
            <div className='px-8 pt-10 pb-6 text-center'>
              <motion.div 
                className="flex items-center justify-center mb-4"
                variants={itemVariants}
              >
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                  style={{ 
                    background: "linear-gradient(135deg, #FF9933 0%, #FF6B35 100%)",
                  }}
                >
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </motion.div>

              <motion.h1 
                className='text-4xl font-bold mb-2' 
                variants={itemVariants}
                style={{ 
                  fontFamily: "Playfair Display, serif", 
                  background: "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Reset Password
              </motion.h1>

              <motion.div 
                className="flex items-center justify-center mb-4"
                variants={itemVariants}
              >
                <div className="flex space-x-1">
                  <div className="w-3 h-1 rounded-full bg-orange-400"></div>
                  <div className="w-8 h-1 rounded-full bg-blue-500"></div>
                  <div className="w-3 h-1 rounded-full bg-green-500"></div>
                </div>
              </motion.div>
              
              <motion.p 
                className='text-base leading-relaxed' 
                variants={itemVariants}
                style={{ 
                  fontFamily: "Inter, sans-serif", 
                  color: "#4B5563"
                }}
              >
                Enter the verification code and create a new password
              </motion.p>
            </div>

            {/* Form Section */}
            <div className='px-8 pb-10'>
              {formError && (
                <motion.div 
                  className='mb-4 p-3 bg-red-50/80 border border-red-200/50 rounded-xl backdrop-blur-md'
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span 
                      className="text-sm"
                      style={{ fontFamily: "Inter, sans-serif", color: "#DC2626" }}
                    >
                      {formError}
                    </span>
                  </div>
                </motion.div>
              )}
              
              <form onSubmit={submitHandler} className='space-y-5'>
                <motion.div variants={itemVariants}>
                  <label 
                    htmlFor="otp" 
                    className='block text-sm font-semibold mb-2'
                    style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}
                  >
                    Verification Code
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <FaKey className='text-gray-400' />
                    </div>
                    <input 
                      value={otp} 
                      onChange={(e) => {
                        // Only allow digits
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 6) {
                          setOtp(value);
                        }
                      }} 
                      required 
                      type="text" 
                      id='otp' 
                      className='w-full py-3 pl-11 pr-4 border border-orange-100 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 shadow-sm tracking-widest text-center font-mono' 
                      placeholder='Enter 6-digit code'
                      maxLength={6}
                      style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}
                    />
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label 
                    htmlFor="password" 
                    className='block text-sm font-semibold mb-2'
                    style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}
                  >
                    New Password
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <FaLock className='text-gray-400' />
                    </div>
                    <input 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      type={showPassword ? "text" : "password"} 
                      id='password' 
                      className='w-full py-3 pl-11 pr-11 border border-orange-100 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 shadow-sm' 
                      placeholder='Create new password'
                      minLength={8}
                      style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}
                    />
                    <div 
                      className='absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 
                        <FaEyeSlash className='text-gray-400 hover:text-gray-600 transition-colors duration-200' /> : 
                        <FaEye className='text-gray-400 hover:text-gray-600 transition-colors duration-200' />
                      }
                    </div>
                  </div>
                  
                  {password && (
                    <div className='mt-3'>
                      <div className='flex items-center justify-between mb-2'>
                        <span 
                          className='text-xs'
                          style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}
                        >
                          Password strength:
                        </span>
                        <span 
                          className='text-xs font-medium'
                          style={{ 
                            fontFamily: "Inter, sans-serif",
                            color: getPasswordStrengthColor(password).replace('bg-red', '#EF4444').replace('bg-yellow', '#EAB308').replace('bg-green', '#16A34A')
                          }}
                        >
                          {getPasswordStrengthText(password)}
                        </span>
                      </div>
                      <div className='w-full h-1.5 bg-gray-200 rounded-full overflow-hidden'>
                        <motion.div 
                          className={`h-full ${getPasswordStrengthColor(password)}`}
                          initial={{ width: 0 }}
                          animate={{ 
                            width: password ? 
                              (checkPasswordStrength(password) === "weak" ? "33%" : 
                              checkPasswordStrength(password) === "medium" ? "66%" : "100%") 
                              : "0%" 
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div 
                        className='mt-2 text-xs'
                        style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}
                      >
                        Use at least 8 characters with uppercase, lowercase, numbers, and special characters.
                      </div>
                    </div>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <label 
                    htmlFor="confirmPassword" 
                    className='block text-sm font-semibold mb-2'
                    style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}
                  >
                    Confirm Password
                  </label>
                  <div className='relative'>
                    <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                      <FaLock className='text-gray-400' />
                    </div>
                    <input 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      required 
                      type={showConfirmPassword ? "text" : "password"} 
                      id='confirmPassword' 
                      className='w-full py-3 pl-11 pr-11 border border-orange-100 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 shadow-sm' 
                      placeholder='Confirm new password'
                      style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}
                    />
                    <div 
                      className='absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer'
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? 
                        <FaEyeSlash className='text-gray-400 hover:text-gray-600 transition-colors duration-200' /> : 
                        <FaEye className='text-gray-400 hover:text-gray-600 transition-colors duration-200' />
                      }
                    </div>
                  </div>
                  {password && confirmPassword && (
                    <div className='mt-2 text-xs text-right' style={{ fontFamily: "Inter, sans-serif" }}>
                      {password === confirmPassword ? 
                        <span style={{ color: "#16A34A" }}>Passwords match</span> : 
                        <span style={{ color: "#DC2626" }}>Passwords don't match</span>
                      }
                    </div>
                  )}
                </motion.div>
                
                <motion.button 
                  type='submit' 
                  className='group w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center mt-6'
                  disabled={btnLoading}
                  variants={itemVariants}
                  style={{
                    background: "linear-gradient(135deg, #138808 0%, #059669 100%)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {btnLoading ? (
                    <LoadingAnimation />
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <span>RESET PASSWORD</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </motion.button>
              </form>
              
              <motion.div className='mt-6' variants={itemVariants}>
                <div className='relative mb-6'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-orange-100'></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span 
                      className='px-3 bg-white'
                      style={{ fontFamily: "Inter, sans-serif", color: "#9CA3AF" }}
                    >
                      or
                    </span>
                  </div>
                </div>
                
                <div 
                  className='text-center text-sm'
                  style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}
                >
                  Remember your password?{' '}
                  <Link 
                    to="/login" 
                    className='font-semibold transition-colors duration-200'
                    style={{ color: "#FF9933" }}
                    onMouseEnter={(e) => e.target.style.color = "#FF6B35"}
                    onMouseLeave={(e) => e.target.style.color = "#FF9933"}
                  >
                    Sign in
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-white/95 backdrop-blur-md border-t border-orange-100/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Decorative Element */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-0.5 bg-gradient-to-r from-orange-400 to-orange-300 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-400 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
              </div>
              <div className="w-8 h-0.5 bg-gradient-to-l from-green-400 to-green-300 rounded-full"></div>
            </div>
            
            {/* Footer Text */}
            <div className="text-center">
              <p
                className="text-lg font-semibold"
                style={{ 
                  fontFamily: "Playfair Display, serif", 
                  background: "linear-gradient(135deg, #FF9933 0%, #138808 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                भारत सरकार | Government of India
              </p>
              <p
                className="text-sm text-gray-500 mt-1"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Skill Development & Entrepreneurship Initiative
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Reset;