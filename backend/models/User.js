const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, 
    },
    role: {
      type: String,
      enum: ['student', 'school_admin', 'super_admin'],
      default: 'student',
    },
    profilePic: {
      type: String,
      default: '', 
    },
    school: {
      type: String,
      default: 'Independent Learner',
    },
    bio: {
      type: String,
      maxlength: [160, 'Bio cannot be more than 160 characters'],
      default: '',
    },
    studyPreferences: {
      subjects: [String],
    }
  },
  
  {
    streakCount: {
    type: Number,
    default: 0
  },
  lastActiveDate: {
    type: String, 
    default: ""
  },
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);