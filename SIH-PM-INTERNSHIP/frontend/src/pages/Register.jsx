import React, { useState, useEffect } from 'react'
import { UserData } from '../context/UserContext'
import { useNavigate, Link } from 'react-router-dom'
import { LoadingAnimation } from '../components/Loading'
import { motion } from 'framer-motion'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa'

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
        <div className='min-h-screen flex items-center justify-center p-4'>
            <motion.div 
                className='w-80 glass-card rounded-xl shadow-2xl border border-border overflow-hidden'
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {/* Header Section */}
                <div className='px-5 pt-6 pb-4 text-center'>
                    <motion.h1 
                        className='text-xl font-bold text-primary mb-1' 
                        variants={itemVariants}
                    >
                        INTERNCONNECT
                    </motion.h1>
                    <motion.p 
                        className='text-base text-foreground font-medium' 
                        variants={itemVariants}
                    >
                        Create Account
                    </motion.p>
                    <motion.p 
                        className='text-xs text-muted-foreground mt-1' 
                        variants={itemVariants}
                    >
                        Sign up to get started
                    </motion.p>
                </div>

                {/* Form Section */}
                <div className='px-5 pb-6'>
                    {formError && (
                        <motion.div 
                            className='mb-3 p-2 bg-destructive/15 border border-destructive rounded-lg text-destructive-foreground text-xs text-center'
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            role="alert"
                        >
                            {formError}
                        </motion.div>
                    )}
                    
                    <form onSubmit={submitHandler} className='space-y-3' noValidate>
                        <motion.div variants={itemVariants}>
                            <label htmlFor="name" className='block text-xs font-semibold text-foreground mb-1 uppercase tracking-wide'>
                                Full Name
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <FaUser className='text-muted-foreground text-xs' />
                                </div>
                                <input 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    required 
                                    type="text" 
                                    id='name' 
                                    className='w-full py-2.5 pl-9 pr-3 border border-input bg-background/80 rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200' 
                                    placeholder='Enter your full name'
                                    aria-required="true"
                                />
                            </div>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <label htmlFor="email" className='block text-xs font-semibold text-foreground mb-1 uppercase tracking-wide'>
                                Email Address
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <FaEnvelope className='text-muted-foreground text-xs' />
                                </div>
                                <input 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    required 
                                    type="email" 
                                    id='email' 
                                    className='w-full py-2.5 pl-9 pr-3 border border-input bg-background/80 rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200' 
                                    placeholder='Enter your email address'
                                    aria-required="true"
                                />
                            </div>
                        </motion.div>
                        
                        <motion.div variants={itemVariants}>
                            <label htmlFor="password" className='block text-xs font-semibold text-foreground mb-1 uppercase tracking-wide'>
                                Password
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <FaLock className='text-muted-foreground text-xs' />
                                </div>
                                <input 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    required 
                                    type={showPassword ? "text" : "password"} 
                                    id='password' 
                                    className='w-full py-2.5 pl-9 pr-9 border border-input bg-background/80 rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200' 
                                    placeholder='Create a secure password'
                                    aria-required="true"
                                    minLength="6"
                                />
                                <button
                                    type="button"
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? 
                                        <FaEyeSlash className='text-muted-foreground hover:text-foreground transition-colors duration-200 text-xs' /> : 
                                        <FaEye className='text-muted-foreground hover:text-foreground transition-colors duration-200 text-xs' />
                                    }
                                </button>
                            </div>
                            
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex space-x-1 mb-1">
                                        {[0, 1, 2, 3].map((index) => (
                                            <div 
                                                key={index} 
                                                className={`h-1 flex-1 rounded-full ${
                                                    passwordStrength > index 
                                                        ? strengthColors[passwordStrength] 
                                                        : 'bg-muted'
                                                }`}
                                            ></div>
                                        ))}
                                    </div>
                                    <p className='text-xs text-muted-foreground'>
                                        {passwordStrength === 0 && "Very weak"}
                                        {passwordStrength === 1 && "Weak"}
                                        {passwordStrength === 2 && "Medium"}
                                        {passwordStrength === 3 && "Good"}
                                        {passwordStrength === 4 && "Strong"}
                                    </p>
                                </div>
                            )}
                            
                            <p className='mt-1 text-xs text-muted-foreground'>Password must be at least 6 characters</p>
                        </motion.div>
                        
                        <motion.button 
                            type='submit' 
                            className='w-full py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98] mt-4'
                            disabled={btnLoading}
                            variants={itemVariants}
                        >
                            {btnLoading ? <LoadingAnimation /> : "CREATE ACCOUNT"}
                        </motion.button>
                    </form>
                    
                    <motion.div className='mt-4' variants={itemVariants}>
                        <div className='relative mb-4'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-border'></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className='px-2 bg-transparent text-muted-foreground'>or</span>
                            </div>
                        </div>
                        
                        <div className='text-center text-xs text-muted-foreground'>
                            Already have an account?{' '}
                            <Link to="/login" className='font-semibold text-primary hover:text-primary/90 transition-colors duration-200'>
                                Sign in instead
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default Register