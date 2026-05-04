const db = require("../db");

const Teacher = db.model("Teacher", {
  firstName: String,
  lastName: String,
  teacherID: Number,
  email: { type: String, unique: true, lowercase: true },
  loginName: { type: String, unique: true },
  password: String,
  role: { type: String, default: "teacher" }
});

Teacher.schema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {
    const lastTeacher = await Teacher.findOne({}, { teacherID: 1 }, { sort: { teacherID: -1 } });
    this.teacherID = lastTeacher && lastTeacher.teacherID ? lastTeacher.teacherID + 1 : 1;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = Teacher;