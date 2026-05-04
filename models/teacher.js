const db = require("../db");

// 1. Define the Schema object first
const teacherSchema = new db.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  teacherID: { type: Number, unique: true, required: true }, 
  email: { type: String, unique: true, lowercase: true },
  loginName: { type: String, unique: true },
  password: String,
  role: { type: String, default: "teacher" }
});


teacherSchema.pre("validate", async function (next) {

  if (this.isNew && !this.teacherID) {
    try {
      const Teacher = db.model("Teacher"); // Get model reference safely
      const lastTeacher = await Teacher.findOne({}, { teacherID: 100 }, { sort: { teacherID: -1 } });
      this.teacherID = lastTeacher && lastTeacher.teacherID ? lastTeacher.teacherID + 1 : 1;
    } catch (err) {
      return next(err);
    }
  }
  next();
});


const Teacher = db.model("Teacher", teacherSchema);

module.exports = Teacher;