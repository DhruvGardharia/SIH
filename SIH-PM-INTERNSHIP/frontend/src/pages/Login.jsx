import React, { useState, useEffect } from 'react'
import { UserData } from '../context/UserContext'
import { useNavigate, Link } from 'react-router-dom'
import { LoadingAnimation } from '../components/Loading'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { FaGoogle } from "react-icons/fa";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [formError, setFormError] = useState("")
    
    const { loginUser, btnLoading } = UserData()
    const navigate = useNavigate()
   
    // Check if there's saved email in localStorage
    useEffect(() => {
        const savedEmail = localStorage.getItem('proimg_email')
        if (savedEmail) {
            setEmail(savedEmail)
            setRememberMe(true)
        }
    }, [])
    
    const submitHandler = (e) => {
        e.preventDefault()
        
        // Simple validation
        if (!email.trim() || !password.trim()) {
            setFormError("Please fill in all fields")
            return
        }
        
        // Save email if remember me is checked
        if (rememberMe) {
            localStorage.setItem('proimg_email', email)
        } else {
            localStorage.removeItem('proimg_email')
        }
        
        setFormError("")
        loginUser(email, password, navigate)
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
                        PROIMG
                    </motion.h1>
                    <motion.p 
                        className='text-base text-foreground font-medium' 
                        variants={itemVariants}
                    >
                        Welcome Back
                    </motion.p>
                    <motion.p 
                        className='text-xs text-muted-foreground mt-1' 
                        variants={itemVariants}
                    >
                        Sign in to your account
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
                        >
                            {formError}
                        </motion.div>
                    )}
                    
                    <form onSubmit={submitHandler} className='space-y-3'>
                        <motion.div variants={itemVariants}>
                            <label htmlFor="email" className='block text-xs font-semibold text-foreground mb-1 uppercase tracking-wide'>
                                Email Address
                            </label>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <FaEnvelope className='text-muted-foreground text-xs' />
                                </div>
                                <input 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    type="email" 
                                    id='email' 
                                    className='w-full py-2.5 pl-9 pr-3 border border-input bg-background/80 rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200' 
                                    placeholder='Enter your email'
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
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    type={showPassword ? "text" : "password"} 
                                    id='password' 
                                    className='w-full py-2.5 pl-9 pr-9 border border-input bg-background/80 rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200' 
                                    placeholder='Enter your password'
                                />
                                <div 
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 
                                        <FaEyeSlash className='text-muted-foreground hover:text-foreground transition-colors duration-200 text-xs' /> : 
                                        <FaEye className='text-muted-foreground hover:text-foreground transition-colors duration-200 text-xs' />
                                    }
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div className='flex items-center justify-between py-1' variants={itemVariants}>
                            <div className='flex items-center'>
                                <input 
                                    type="checkbox" 
                                    id="remember" 
                                    className='h-3 w-3 text-primary focus:ring-primary border-input rounded bg-background'
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                                <label htmlFor="remember" className='ml-2 block text-xs text-muted-foreground'>
                                    Remember me
                                </label>
                            </div>
                            <Link to="/forgot" className='text-xs font-medium text-primary hover:text-primary/90 transition-colors duration-200'>
                                Forgot password?
                            </Link>
                        </motion.div>
                        
                        <motion.button 
                            type='submit' 
                            className='w-full py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98] mt-4'
                            disabled={btnLoading}
                            variants={itemVariants}
                        >
                            {btnLoading ? <LoadingAnimation /> : "SIGN IN"}
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
                            Don't have an account?{' '}
                            <Link to="/register" className='font-semibold text-primary hover:text-primary/90 transition-colors duration-200'>
                                Create an account
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    )
}

export default Login