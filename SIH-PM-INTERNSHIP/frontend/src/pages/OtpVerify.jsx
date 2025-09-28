import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { LoadingAnimation } from "../components/Loading";
import { motion } from 'framer-motion';
import { FaKey } from 'react-icons/fa';

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const [formError, setFormError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const { verify, btnLoading } = UserData();
  const navigate = useNavigate();
  const { token } = useParams();
  const inputRef = useRef(null);

  // Timer countdown effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // Basic validation
    if (!otp.trim()) {
      setFormError("Please enter the verification code");
      return;
    }

    if (otp.length !== 6) {
      setFormError("Verification code must be 6 digits");
      return;
    }

    setFormError("");
    verify(token, otp, navigate);
  };

  const handleResendOtp = () => {
    // Logic for resending OTP would go here
    setTimeLeft(300); // Reset timer
    // You would need to call an API function here to resend the OTP
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
            Verify OTP
          </motion.p>
          <motion.p
            className='text-xs text-muted-foreground mt-1'
            variants={itemVariants}
          >
            Enter the 6-digit verification code sent to your email
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
              <label htmlFor="otp" className='block text-xs font-semibold text-foreground mb-1 uppercase tracking-wide'>
                Verification Code
              </label>
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FaKey className='text-muted-foreground text-xs' />
                </div>
                <input
                  ref={inputRef}
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
                  className='w-full py-2.5 pl-9 pr-3 border border-input bg-background/80 rounded-lg text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent tracking-widest text-center font-mono'
                  placeholder='Enter 6-digit code'
                  maxLength={6}
                  pattern="\d{6}"
                />
              </div>
            </motion.div>

            <motion.div className='text-center' variants={itemVariants}>
              <p className={`text-xs ${timeLeft > 60 ? 'text-muted-foreground' : 'text-red-600'}`}>
                Code expires in {formatTime(timeLeft)}
              </p>
            </motion.div>

            <motion.button
              type='submit'
              className='w-full py-2.5 px-4 border border-transparent rounded-lg shadow-lg text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 flex items-center justify-center transform hover:scale-[1.02] active:scale-[0.98] mt-4'
              disabled={btnLoading}
              variants={itemVariants}
            >
              {btnLoading ? <LoadingAnimation /> : "VERIFY CODE"}
            </motion.button>
          </form>

          <motion.div className='mt-4 text-center' variants={itemVariants}>
            <button
              onClick={handleResendOtp}
              disabled={timeLeft > 0}
              className={`text-xs font-medium ${timeLeft > 0 ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:underline cursor-pointer'}`}
            >
              {timeLeft > 0 ? "Resend code available after countdown" : "Didn't receive the code? Resend"}
            </button>

            <div className='mt-4 text-xs text-muted-foreground'>
              <Link to="/login" className='font-semibold text-primary hover:text-primary/90 transition-colors duration-200'>
                Return to login
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpVerify;
