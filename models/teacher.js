const db = require("../db");

const Teacher = db.model("Teacher", {
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  teacherID: { type: Number, required: true, unique: true },
  email: { type: String, unique: true, lowercase: true },
  loginName: { type: String, unique: true },
  password: String,
  role: { type: String, default: "teacher" }
});


Teacher.schema.pre("validate", async function (next) {
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