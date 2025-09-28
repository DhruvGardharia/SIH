
import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  educationLevel: { type: String }, // Diploma/UG/PG
  degreeName: { type: String },
  collegeName: { type: String },
  yearOfStudy: { type: String }, // 2nd Year, Final Year, Graduate
  cgpa: { type: Number }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  link: String
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,   // must have name
    trim: true
  },
  email: {
    type: String,
    required: true,   // login credential
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"]
  },
  phone: {
    type: String,
    match: [/^[0-9]{10}$/, "Phone must be 10 digits"] // optional but validated if entered
  },
  password: {
    type: String,
    required: true    // login credential
  },
  dob: { 
    type: Date,
    required: false   // not mandatory, can come from resume or later
  },
  gender: { 
    type: String, 
    enum: ["Male", "Female", "Other"], 
    required: false   // optional, user may skip
  },

  // Education
  education: {
    type: [educationSchema],
    default: [],
    // validate: [arr => arr.length <= 5, "Too many education entries"] // sanity check
  },

  // Skills & Resume
  skills: { type: [String], default: [] },
  certifications: { type: [String], default: [] },
  projects: { type: [projectSchema], default: [] },

  // Preferences
  preferredSectors: { type: [String], default: [] },
  preferredLocations: { type: [String], default: [] },
  internshipTypes: { 
    type: [String], 
    enum: ["Onsite", "Remote", "Hybrid"], 
    default: [] 
  },
  expectedStipend: { type: String },

  // Socio-economic Context
  regionType: { 
    type: String, 
    enum: ["Rural", "Urban", "Tribal"], 
    required: false 
  },

  // Resume
  resumeFile: { type: String }, 

  // Minimal additions for onboarding and OCR
  stepsCompleted: {
    type: new mongoose.Schema({
      basic: { type: Boolean, default: false },
      education: { type: Boolean, default: false },
      preferences: { type: Boolean, default: false },
      projectsCerts: { type: Boolean, default: false },
    }, { _id: false }),
    default: () => ({})
  },
  ocrDraft: {
    type: new mongoose.Schema({
      skills: { type: [String], default: [] },
      certifications: { type: [String], default: [] },
      projects: { type: [projectSchema], default: [] },
      education: { type: [educationSchema], default: [] },
      extractedAt: { type: Date },
      source: { type: String, default: "resume" },
    }, { _id: false }),
    default: undefined
  }

}, { timestamps: true });


export const User= mongoose.model("User", userSchema);


// import mongoose from "mongoose";
// import { type } from "os";

// const schema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
   
//   },
//   {
//     timestamps: true,
//   }
// );

// export const User = mongoose.model("User", schema);