import React, { useState, useEffect } from 'react'
import { UserData } from '../context/UserContext'
import { useNavigate, Link } from 'react-router-dom'
import { LoadingAnimation } from '../components/Loading'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [formError, setFormError] = useState("")
    const [passwordStrength, setPasswordStrength] = useState(0)
    
    const { registerUser, btnLoading } = UserData()
    const navigate = useNavigate()
    
    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({
            ...prev,
            [id]: value
        }))
        
        if (id === 'password') {
            checkPasswordStrength(value)
        }
    }
    
    const checkPasswordStrength = (password) => {
        let strength = 0
        
        // Length check
        if (password.length >= 8) strength += 1
        
        // Character variety checks
        if (/[A-Z]/.test(password)) strength += 1
        if (/[0-9]/.test(password)) strength += 1
        if (/[^A-Za-z0-9]/.test(password)) strength += 1
        
        setPasswordStrength(strength)
    }
    
    const submitHandler = (e) => {
        e.preventDefault()
        
        const { name, email, password } = formData
        
        // Enhanced validation
        if (!name.trim() || !email.trim() || !password.trim()) {
            setFormError("Please fill in all fields")
            return
        }
        
        if (password.length < 6) {
            setFormError("Password must be at least 6 characters long")
            return
        }
        
        if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            setFormError("Please enter a valid email address")
            return
        }
        
        setFormError("")
        registerUser(name, email, password, navigate)
    }
    
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
    }
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    }
    
    // Password strength indicator colors
    const strengthColors = [
        'bg-red-500', // Very weak
        'bg-orange-500', // Weak
        'bg-yellow-500', // Medium
        'bg-green-400', // Good
        'bg-green-600'  // Strong
    ]
    
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
                    {/* Register Card */}
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
                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
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
                                Create Account
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
                                Join us to explore amazing opportunities
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
                                    role="alert"
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
                            
                            <form onSubmit={submitHandler} className='space-y-5' noValidate>
                                <motion.div variants={itemVariants}>
                                    <label 
                                        htmlFor="name" 
                                        className='block text-sm font-semibold mb-2'
                                        style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}
                                    >
                                        Full Name
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                            <FaUser className='text-gray-400' />
                                        </div>
                                        <input 
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            required 
                                            type="text" 
                                            id='name' 
                                            className='w-full py-3 pl-11 pr-4 border border-orange-100 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 shadow-sm' 
                                            placeholder='Enter your full name'
                                            aria-required="true"
                                            style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}
                                        />
                                    </div>
                                </motion.div>
                                
                                <motion.div variants={itemVariants}>
                                    <label 
                                        htmlFor="email" 
                                        className='block text-sm font-semibold mb-2'
                                        style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}
                                    >
                                        Email Address
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                            <FaEnvelope className='text-gray-400' />
                                        </div>
                                        <input 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            required 
                                            type="email" 
                                            id='email' 
                                            className='w-full py-3 pl-11 pr-4 border border-orange-100 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 shadow-sm' 
                                            placeholder='Enter your email address'
                                            aria-required="true"
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
                                        Password
                                    </label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
                                            <FaLock className='text-gray-400' />
                                        </div>
                                        <input 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            required 
                                            type={showPassword ? "text" : "password"} 
                                            id='password' 
                                            className='w-full py-3 pl-11 pr-11 border border-orange-100 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 shadow-sm' 
                                            placeholder='Create a secure password'
                                            aria-required="true"
                                            minLength="6"
                                            style={{ fontFamily: "Inter, sans-serif", color: "#1F2937" }}
                                        />
                                        <button
                                            type="button"
                                            className='absolute inset-y-0 right-0 pr-4 flex items-center'
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? 
                                                <FaEyeSlash className='text-gray-400 hover:text-gray-600 transition-colors duration-200' /> : 
                                                <FaEye className='text-gray-400 hover:text-gray-600 transition-colors duration-200' />
                                            }
                                        </button>
                                    </div>
                                    
                                    {formData.password && (
                                        <div className="mt-3">
                                            <div className="flex space-x-1 mb-2">
                                                {[0, 1, 2, 3].map((index) => (
                                                    <div 
                                                        key={index} 
                                                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                                            passwordStrength > index 
                                                                ? strengthColors[passwordStrength] 
                                                                : 'bg-gray-200'
                                                        }`}
                                                    ></div>
                                                ))}
                                            </div>
                                            <p 
                                                className='text-xs'
                                                style={{ 
                                                    fontFamily: "Inter, sans-serif",
                                                    color: passwordStrength === 0 ? "#EF4444" :
                                                           passwordStrength === 1 ? "#F97316" :
                                                           passwordStrength === 2 ? "#EAB308" :
                                                           passwordStrength === 3 ? "#4ADE80" :
                                                           "#16A34A"
                                                }}
                                            >
                                                {passwordStrength === 0 && "Very weak password"}
                                                {passwordStrength === 1 && "Weak password"}
                                                {passwordStrength === 2 && "Medium strength"}
                                                {passwordStrength === 3 && "Good password"}
                                                {passwordStrength === 4 && "Strong password"}
                                            </p>
                                        </div>
                                    )}
                                    
                                    <p 
                                        className='mt-2 text-xs'
                                        style={{ fontFamily: "Inter, sans-serif", color: "#6B7280" }}
                                    >
                                        Password must be at least 6 characters
                                    </p>
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
                                            <span>CREATE ACCOUNT</span>
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
                                    Already have an account?{' '}
                                    <Link 
                                        to="/login" 
                                        className='font-semibold transition-colors duration-200'
                                        style={{ color: "#FF9933" }}
                                        onMouseEnter={(e) => e.target.style.color = "#FF6B35"}
                                        onMouseLeave={(e) => e.target.style.color = "#FF9933"}
                                    >
                                        Sign in instead
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
    )
}

export default Register