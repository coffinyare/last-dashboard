import mongoose from "mongoose";

// Email validation regex for better accuracy
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone validation regex (example: for US phone numbers)
const phoneRegex = /^\d{10}$/; // 10 digit phone numbers without dashes

// Regular expression to check that the name does not start with a number
const nameStartRegex = /^[^\d]/; // Ensures name does not start with a number

// Regular expression to check that skill does not start with a number
const skillStartRegex = /^[^\d]/; // Ensures skill does not start with a number

const contractorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [3, 'Name must be at least 3 characters long'],
    maxlength: [100, 'Name must be less than 100 characters'],
    match: [nameStartRegex, 'Name cannot start with a number'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    match: [emailRegex, 'Please provide a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [phoneRegex, 'Phone number must be a 10-digit number'],
  },
  skills: {
    type: [String],
    default: [],
    validate: {
      validator: function (value) {
        // Ensure each skill does not start with a number
        return value.every(skill => skill && skill.trim() !== '' && skillStartRegex.test(skill));
      },
      message: 'Each skill must be a non-empty string and cannot start with a number',
    },
  },
  available: {
    type: Boolean,
    default: true,
  },
});

// Mongoose pre-save hook to enforce additional logic (e.g., trimming strings)
contractorSchema.pre('save', function (next) {
  // Trim any leading/trailing spaces from name, email, and skills
  if (this.name) {
    this.name = this.name.trim();
  }
  if (this.email) {
    this.email = this.email.trim();
  }
  if (this.skills && Array.isArray(this.skills)) {
    this.skills = this.skills.map(skill => skill.trim());
  }
  next();
});

const Contractor = mongoose.model('Contractor', contractorSchema);

export default Contractor;
