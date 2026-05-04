const db = require("../db");

const AutoIncrement = require("mongoose-sequence")(db); 

const teacherSchema = new db.Schema({
  firstName: String,
  lastName: String,

  email: { type: String, unique: true, lowercase: true },
  loginName: { type: String, unique: true },
  password: String,
  role: { type: String, default: "teacher" }
});


teacherSchema.plugin(AutoIncrement, { inc_field: 'teacherID' });

const Teacher = db.model("Teacher", teacherSchema);

module.exports = Teacher;