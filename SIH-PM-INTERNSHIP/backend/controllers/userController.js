import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import TryCatch from "../utils/TryCatch.js";
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import validator from 'validator';
import cloudinary from 'cloudinary';
import axios from 'axios';


dotenv.config();



const TEMP_USERS = {}; 

export const registerWithOtp = TryCatch(async (req, res) => {
  const { name, email, password } = req.body;

   
   if (Array.isArray(email) || !validator.isEmail(email)) {
    return res.status(400).json({
      message: "Invalid email format",
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: "An account with this email already exists",
    });
  }

  const otp = crypto.randomInt(100000, 999999); // Generate OTP
  console.log(otp);
  TEMP_USERS[email] = {
    name,
    password,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // OTP valid for 5 minutes
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.MY_GMAIL,
      pass: process.env.MY_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.MY_GMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

    const token = jwt.sign({ email }, process.env.JWT_SEC, { expiresIn: "5m" });
    console.log(token);
    
    res.status(200).json({
      message: "OTP sent successfully. Please verify to complete registration.",
      token,
    });
  }catch (error) {
    console.error("Error sending OTP:", error);
    if (process.env.SKIP_EMAIL === 'true' || process.env.NODE_ENV === 'development') {
      const token = jwt.sign({ email }, process.env.JWT_SEC, { expiresIn: "5m" });
      console.log("[DEV] SKIP_EMAIL enabled - returning token despite email failure");
      return res.status(200).json({
        message: "Email send failed, but SKIP_EMAIL is enabled. Use OTP from server console.",
        token,
      });
    }
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
});

export const verifyOtpAndRegister = TryCatch(async (req, res) => {
  const { otp } = req.body;
  const { token}=req.params;

  if (!otp || !token) {
    return res.status(400).json({ message: "OTP and token are required" });
  }

  try {
    const { email } = jwt.verify(token, process.env.JWT_SEC);

    const tempUser = TEMP_USERS[email];
    if (!tempUser) {
      return res.status(400).json({ message: "No OTP request found for this email" });
    }

    if (tempUser.expiresAt < Date.now()) {
      delete TEMP_USERS[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    if (parseInt(tempUser.otp) !== parseInt(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

   
    const hashPassword = await bcrypt.hash(tempUser.password, 10);
    const user = await User.create({
      name: tempUser.name,
      email,
      password: hashPassword,
    });

    delete TEMP_USERS[email]; //

    generateToken(user, res);

    res.status(201).json({
      user,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
});




export const loginUser=TryCatch(async(req,res)=>{
    const{email,password }=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({
            message:"Email or Password Incorrect.",
        });
    }
    const comaparePassword=await bcrypt.compare(password,user.password);


    if(!comaparePassword){
        return res.status(400).json({
            message:"Email or Password Incorrect.",
        });

    }
    generateToken(user,res);


    res.json({
        user,
        message:"Logged In",

    })

});
 
export const forgetPassword=TryCatch(async(req,res)=>{
  const {email} =req.body;

   
if (Array.isArray(email) || !validator.isEmail(email)) {
  return res.status(400).json({
    message: "Invalid email format",
  });
}
  const user= await User.findOne({email})
  if(!user)
      return res.status(400).json({
          message:"No user found",
  })

  const otp = crypto.randomInt(100000, 999999);
  TEMP_USERS[email] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, 
  };
  
  const transporter = nodemailer.createTransport({
      service:"gmail",
      secure:true,
      auth:{
          user:process.env.MY_GMAIL,
          pass:process.env.MY_PASS,
      }
  })
  console.log(otp);
  
  try {
    
    await transporter.sendMail({
      from: process.env.MY_GMAIL,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`,
    });

   
    const token = jwt.sign({ email }, process.env.JWT_SEC, { expiresIn: "5m" });

    res.status(200).json({
      message: "OTP sent successfully.",
      token,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    if (process.env.SKIP_EMAIL === 'true' || process.env.NODE_ENV === 'development') {
      const token = jwt.sign({ email }, process.env.JWT_SEC, { expiresIn: "5m" });
      console.log("[DEV] SKIP_EMAIL enabled - returning token despite email failure");
      return res.status(200).json({
        message: "Email send failed, but SKIP_EMAIL is enabled. Use OTP from server console.",
        token,
      });
    }
    res.status(500).json({
      message: "Failed to send OTP",
      error: error.message,
    });
  }
})

export const resetPassword = TryCatch(async (req, res) => {
const { token } = req.params;
const { otp, password } = req.body;

if (!password) {
  return res.status(400).json({ message: "Password is required" });
}

if (!otp || !token) {
  return res.status(400).json({ message: "OTP and token are required" });
}

let email;
try {
  ({ email } = jwt.verify(token, process.env.JWT_SEC));
} catch (error) {
  return res.status(400).json({ message: "Invalid or expired token" });
}

const tempUser = TEMP_USERS[email];
if (!tempUser) {
  console.log("TEMP_USERS:", TEMP_USERS);
  return res.status(400).json({ message: "No OTP request found for this email" });
}

console.log("Stored OTP:", tempUser.otp);
console.log("Provided OTP:", otp);

if (tempUser.expiresAt < Date.now()) {
  console.log("OTP expired. ExpiresAt:", tempUser.expiresAt, "Current time:", Date.now());
  delete TEMP_USERS[email];
  return res.status(400).json({ message: "OTP expired" });
}

if (tempUser.otp.toString() !== otp.toString()) {
  console.log("Invalid OTP. Stored:", tempUser.otp, "Provided:", otp);
  return res.status(400).json({ message: "Invalid OTP" });
}

const user = await User.findOne({ email });
if (!user) {
  return res.status(404).json({ message: "User not found" });
}

user.password = await bcrypt.hash(password, 10);
await user.save();

delete TEMP_USERS[email];
res.json({ message: "Password reset successful" });
});


export const myProfile=TryCatch(async(req,res)=>{
    const user=await User.findById(req.user._id)
    res.json(user);
})

export const userProfile= TryCatch(async(req,res)=>{
    const user= await User.findById(req.params.id).select("-password");
    res.json(user);

})


export const logOutUser=TryCatch(async(req,res)=>{
    res.cookie("token","",{maxAge:0});
    res.json({
        message:"Logged out successfully",
    });
});

// ========== Profile Step Handlers ==========
const computeStepsCompleted = (user) => {
  const steps = {
    basic: Boolean(user.dob || user.gender || user.regionType),
    education: Array.isArray(user.education) && user.education.length > 0,
    preferences: (
      (user.preferredSectors && user.preferredSectors.length) ||
      (user.preferredLocations && user.preferredLocations.length) ||
      (user.internshipTypes && user.internshipTypes.length) ||
      Boolean(user.expectedStipend)
    ) ? true : false,
    projectsCerts: (
      (user.projects && user.projects.length) ||
      (user.certifications && user.certifications.length)
    ) ? true : false,
  };
  return steps;
};

export const updateBasicInfo = TryCatch(async (req, res) => {
  const { name, email, phone, dob, gender, regionType } = req.body;

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email;
  if (phone !== undefined) updates.phone = phone;
  if (dob !== undefined) updates.dob = dob ? new Date(dob) : undefined;
  if (gender !== undefined) updates.gender = gender;
  if (regionType !== undefined) updates.regionType = regionType;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true }
  );
  user.stepsCompleted = computeStepsCompleted(user);
  await user.save();
  res.json(user);
});

export const updateEducation = TryCatch(async (req, res) => {
  const { education } = req.body; // expect full array
  if (!Array.isArray(education)) {
    return res.status(400).json({ message: "education must be an array" });
  }
  
  // Transform frontend field names to backend field names
  const transformedEducation = education.map(edu => ({
    educationLevel: edu.level,
    degreeName: edu.degree,
    collegeName: edu.college,
    yearOfStudy: edu.yearOfStudy,
    cgpa: edu.cgpa
  }));
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { education: transformedEducation } },
    { new: true }
  );
  user.stepsCompleted = computeStepsCompleted(user);
  await user.save();
  res.json(user);
});

export const updatePreferences = TryCatch(async (req, res) => {
  const { preferredSectors, preferredLocations, internshipTypes, expectedStipend } = req.body;
  const setOps = {};
  if (preferredSectors !== undefined) setOps.preferredSectors = preferredSectors || [];
  if (preferredLocations !== undefined) setOps.preferredLocations = preferredLocations || [];
  if (internshipTypes !== undefined) setOps.internshipTypes = internshipTypes || [];
  if (expectedStipend !== undefined) setOps.expectedStipend = expectedStipend || undefined;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: setOps },
    { new: true }
  );
  user.stepsCompleted = computeStepsCompleted(user);
  await user.save();
  res.json(user);
});

export const updateProjectsCerts = TryCatch(async (req, res) => {
  const { projects, certifications } = req.body;
  const setOps = {};
  if (projects !== undefined) setOps.projects = projects || [];
  if (certifications !== undefined) setOps.certifications = certifications || [];

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: setOps },
    { new: true }
  );
  user.stepsCompleted = computeStepsCompleted(user);
  await user.save();
  res.json(user);
});

// skills merge with normalization and dedup (case and synonym aware basic)
const canonicalize = (skill) => {
  if (!skill || typeof skill !== 'string') return null;
  const s = skill.trim().toLowerCase().replace(/\s+/g, ' ');
  const map = {
    'js': 'javascript',
    'node': 'node.js',
    'nodejs': 'node.js',
    'node.js': 'node.js',
    'cpp': 'c++',
  };
  return map[s] || s;
};

export const mergeSkills = TryCatch(async (req, res) => {
  const { skills } = req.body;
  if (!Array.isArray(skills)) {
    return res.status(400).json({ message: "skills must be an array" });
  }
  const user = await User.findById(req.user._id);
  const existing = new Set((user.skills || []).map(canonicalize).filter(Boolean));
  for (const sk of skills) {
    const can = canonicalize(sk);
    if (can && !existing.has(can)) {
      user.skills.push(sk);
      existing.add(can);
    }
  }
  user.stepsCompleted = computeStepsCompleted(user);
  await user.save();
  res.json(user);
});

// OCR draft set/get/apply (apply merges into same arrays like manual inputs)
export const getOcrDraft = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id).select('ocrDraft');
  res.json(user?.ocrDraft || {});
});

export const setOcrDraft = TryCatch(async (req, res) => {
  const { skills = [], certifications = [], projects = [], education = [] } = req.body || {};
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: { ocrDraft: { skills, certifications, projects, education, extractedAt: new Date(), source: 'resume' } } },
    { new: true }
  );
  res.json(user || {});
});

export const applyOcrDraft = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const draft = user.ocrDraft || {};

  // merge skills
  if (Array.isArray(draft.skills) && draft.skills.length) {
    const existing = new Set((user.skills || []).map(canonicalize).filter(Boolean));
    for (const sk of draft.skills) {
      const can = canonicalize(sk);
      if (can && !existing.has(can)) {
        user.skills.push(sk);
        existing.add(can);
      }
    }
  }
  // merge certifications (strings)
  if (Array.isArray(draft.certifications) && draft.certifications.length) {
    const set = new Set((user.certifications || []).map((c) => (c || '').trim().toLowerCase()));
    for (const c of draft.certifications) {
      const key = (c || '').trim().toLowerCase();
      if (key && !set.has(key)) {
        user.certifications.push(c);
        set.add(key);
      }
    }
  }
  // merge projects (dedup by title lowercase)
  if (Array.isArray(draft.projects) && draft.projects.length) {
    const set = new Set((user.projects || []).map((p) => (p?.title || '').trim().toLowerCase()));
    for (const p of draft.projects) {
      const key = (p?.title || '').trim().toLowerCase();
      if (key && !set.has(key)) {
        user.projects.push(p);
        set.add(key);
      }
    }
  }
  // merge education (dedup by degreeName+collegeName lowercase)
  if (Array.isArray(draft.education) && draft.education.length) {
    const set = new Set((user.education || []).map((e) => `${(e?.degreeName||'').toLowerCase()}|${(e?.collegeName||'').toLowerCase()}`));
    for (const e of draft.education) {
      const key = `${(e?.degreeName||'').toLowerCase()}|${(e?.collegeName||'').toLowerCase()}`;
      if (key.trim() && !set.has(key)) {
        user.education.push(e);
        set.add(key);
      }
    }
  }

  
  user.stepsCompleted = computeStepsCompleted(user);
  await user.save();
  res.json(user);
});

// controllers/ocrController.js
import FormData from "form-data";


export const uploadResumeAndExtract = TryCatch(async (req, res) => {
  let resumeUrl = req.body?.resumeUrl;
  let sendBuffer = null;

  // Case 1: file upload
  if (!resumeUrl && req.file) {
    const uploadFromBuffer = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          { resource_type: "auto", folder: "resumes", access_mode: "public" }, // 👈 ensure public
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(buffer);
      });

    const result = await uploadFromBuffer(req.file.buffer);
    resumeUrl = result.secure_url;

    // Also keep buffer for direct OCR
    sendBuffer = req.file.buffer;
  }

  if (!resumeUrl && !sendBuffer) {
    return res
      .status(400)
      .json({ message: 'Provide resumeUrl or upload a file as "file"' });
  }

  // ✅ Call Python OCR service
  const ocrBase = process.env.OCR_SERVICE_URL || 'http://localhost:8001';
  const form = new FormData();

  if (sendBuffer) {
    // send the actual file buffer
    form.append("file", sendBuffer, {
      filename: req.file.originalname || "resume.pdf",
      contentType: req.file.mimetype || "application/pdf",
    });
  } else {
    // only send URL
    form.append("resume_url", resumeUrl);
  }

  let simpleData = { skills: [], certifications: [], projects: [], education: [] };
  try {
    const resp = await axios.post(`${ocrBase}/extract/`, form, {
      headers: form.getHeaders(),
      timeout: 1200000,
    });
    console.log("response from Python OCR service:", resp.data);
    
    // Extract ocrDraft from SimpleResumeResponse
    if (resp.data && resp.data.ocrDraft) {
      simpleData = resp.data.ocrDraft;
    }
  } catch (e) {
    console.error("Python OCR service error:", e?.message || e);
    return res.status(500).json({ 
      message: "Failed to process resume", 
      error: e?.message || "OCR service unavailable" 
    });
  }

  console.log("simpleData", simpleData.education[0]);

  // ✅ Save draft in user
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        resumeFile: resumeUrl,
        ocrDraft: {
          skills: Array.isArray(simpleData.skills) ? simpleData.skills : [],
          certifications: Array.isArray(simpleData.certifications) ? simpleData.certifications : [],
          projects: Array.isArray(simpleData.projects) ? simpleData.projects : [],
          education: Array.isArray(simpleData.education) ? simpleData.education : [],
          extractedAt: new Date(),
          source: "resume",
        },
      },
    },
    { new: true }
  );

  // ✅ Apply OCR draft to user profile (merge extracted data)
  const draft = user.ocrDraft || {};

  // merge skills
  if (Array.isArray(draft.skills) && draft.skills.length) {
    const existing = new Set((user.skills || []).map(canonicalize).filter(Boolean));
    for (const sk of draft.skills) {
      const can = canonicalize(sk);
      if (can && !existing.has(can)) {
        user.skills.push(sk);
        existing.add(can);
      }
    }
  }
  // merge certifications (strings)
  if (Array.isArray(draft.certifications) && draft.certifications.length) {
    const set = new Set((user.certifications || []).map((c) => (c || '').trim().toLowerCase()));
    for (const c of draft.certifications) {
      const key = (c || '').trim().toLowerCase();
      if (key && !set.has(key)) {
        user.certifications.push(c);
        set.add(key);
      }
    }
  }
  // merge projects (dedup by title lowercase)
  if (Array.isArray(draft.projects) && draft.projects.length) {
    const set = new Set((user.projects || []).map((p) => (p?.title || '').trim().toLowerCase()));
    for (const p of draft.projects) {
      const key = (p?.title || '').trim().toLowerCase();
      if (key && !set.has(key)) {
        user.projects.push(p);
        set.add(key);
      }
    }
  }
  // merge education (dedup by degreeName+collegeName lowercase)
  if (Array.isArray(draft.education) && draft.education.length) {
    const set = new Set((user.education || []).map((e) => `${(e?.degreeName||'').toLowerCase()}|${(e?.collegeName||'').toLowerCase()}`));
    for (const e of draft.education) {
      const key = `${(e?.degreeName||'').toLowerCase()}|${(e?.collegeName||'').toLowerCase()}`;
      if (key.trim() && !set.has(key)) {
        user.education.push(e);
        set.add(key);
      }
    }
  }

  // Update steps completed and save
  user.stepsCompleted = computeStepsCompleted(user);
  await user.save();

  res.json({ 
    success: true, 
    message: "Resume processed and data merged into profile",
    ocrDraft: user.ocrDraft,
    user: user
  });
});


// ========== Recommendations Proxy ==========
export const getRecommendations = TryCatch(async (req, res) => {
  const top_n = parseInt(req.query.top_n || '5', 10);
  const user = await User.findById(req.user._id).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Build payload expected by the Python recommender
  const educationText = Array.isArray(user.education) && user.education.length
    ? user.education.map(e => [e.educationLevel, e.degreeName, e.collegeName].filter(Boolean).join(' ')).join(' | ')
    : '';

  const preferences = {
    remote: Array.isArray(user.internshipTypes) ? user.internshipTypes.some(t => (t || '').toLowerCase() === 'remote') : false,
  };

  const payload = {
    top_n,
    name: user.name || '',
    education: educationText,
    skills: Array.isArray(user.skills) ? user.skills : [],
    sector_interests: Array.isArray(user.preferredSectors) ? user.preferredSectors : [],
    location: Array.isArray(user.preferredLocations) && user.preferredLocations.length ? user.preferredLocations[0] : '',
    preferences,
    career_goals: '',
  };

  const base = process.env.RECO_SERVICE_URL ;
  try {
    const resp = await axios.post(`${base}/recommendations`, payload, { timeout: 30000 });
    return res.json(resp.data);
  } catch (e) {
    console.error('Recommender error:', e?.message || e);
    return res.status(502).json({ message: 'Recommendation service unavailable', error: e?.message || String(e) });
  }
});
