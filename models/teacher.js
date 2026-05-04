const mongoose = require('../db'); //
const AutoIncrement = require('mongoose-sequence')(mongoose);

const teacherSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, lowercase: true },
  loginName: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'teacher' } /
});

// This adds the 'teacherID' field automatically
teacherSchema.plugin(AutoIncrement, { id: 'teacher_id_counter', inc_field: 'teacherID' });

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;