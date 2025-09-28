import React, { useState } from 'react';
import { UserData } from '../context/UserContext';
import { useNavigate, Link } from 'react-router-dom';
import { LoadingAnimation } from '../components/Loading';
import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");
  const { btnLoading, forgotUser } = UserData();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    // Simple validation
    if (!email.trim()) {
      setFormError("Please enter your email address");
      return;
    }

    setFormError("");
    forgotUser(email, navigate);
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
            Forgot Password
          </motion.p>
          <motion.p
            className='text-xs text-muted-foreground mt-1'
            variants={itemVariants}
          >
            Enter your email to reset your password
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

            <motion.button
              type='submit'
              className='w-full py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98] mt-4'
              disabled={btnLoading}
              variants={itemVariants}
            >
              {btnLoading ? <LoadingAnimation /> : "SEND RESET LINK"}
            </motion.button>
          </form>

          <motion.div className='mt-4 text-center' variants={itemVariants}>
            <div className='text-xs text-muted-foreground'>
              Remember your password?{' '}
              <Link to="/login" className='font-semibold text-primary hover:text-primary/90 transition-colors duration-200'>
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Forgot;
