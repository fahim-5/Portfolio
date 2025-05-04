const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
  name: String,
  jobTitle: String,
  bio: String,
  email: String,
  phone: String,
  socialLinks: {
    linkedin: String,
    github: String
  },
  hero: {
    profileImageUrl: String
  }
});

module.exports = mongoose.model('PersonalInfo', personalInfoSchema);