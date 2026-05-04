const db = require("../db")

const Teacher = db.model("Teacher",{
    firstName: String,
    lastName: String,
    email: {type: String, unique:true, lowercase:true},
    teacherID: {
    type: Number,
    unique: true,
    default: () => Math.floor(100000 + Math.random() * 900000) // Generates 6-digit ID
  },
    loginName: {type: String, unique: true},
    password: String,
    role: {type: String, default: "teacher"}
})

module.exports = Teacher;