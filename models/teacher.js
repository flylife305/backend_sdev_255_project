const db = require("../db");

const teacherSchema = new db.Schema({
  firstName: String,
  lastName: String,
  teacherID: { type: Number, unique: true, required: true },
  email: { type: String, unique: true, lowercase: true },
  loginName: { type: String, unique: true },
  password: String,
  role: { type: String, default: "teacher" }
});


teacherSchema.pre("validate", async function (next) {
  if (this.isNew && !this.teacherID) {
    try {
      // Access the model through the constructor to avoid circular dependency
      const Teacher = this.constructor; 
      const lastTeacher = await Teacher.findOne({}, { teacherID: 1 }, { sort: { teacherID: -1 } });
      this.teacherID = lastTeacher && lastTeacher.teacherID ? lastTeacher.teacherID + 1 : 1;
    } catch (err) {
      return next(err);
    }
  }
  next();
});


const Teacher = db.model("Teacher", teacherSchema);

module.exports = Teacher;