const express = require('express');
const Course = require("./models/course")
const Student = require("./models/Students")
const Teacher = require("./models/teacher")
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var cors = require("cors")

const app = express();
app.use(cors())
app.use(express.json())

const router = express.Router();
const secret = "The_ultra_secret_key"; 

//get all entries in teacher, student, courses
router.get("/course", async function(req,res){
    try {
        const courses = await Course.find();
        res.json(courses)

    }
    catch(err){
        res.status(400).send(err.message);

    }
})

router.get("/students", async function(req,res){
    try {
        const students= await Student.find();
        res.json(students)

    }
    catch(err){
        res.status(400).send(err.message);

    }
})

router.get("/teacher", async function(req,res){
    try {
        const teachers = await Teacher.find();
        res.json(teachers)

    }
    catch(err){
        res.status(400).send(err.message);

    }
})

//Get one entry in teacher, students, and courses
router.get('/course/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res.json(course);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/students/:id', async (req, res) => {
  try {
    const searchID = req.params.id;


    const student = await Student.findOne({
      $or: [
        { studentID: Number(searchID) },
        { _id: searchID.length === 24 ? searchID : null } 
      ]
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(400).send("Error fetching student");
  }
});
router.get("/teacher/:id", async(req,res) =>{
    try {
       const searchID = req.params.id;
       const teacher = await Teacher.findOne({
      $or: [
        { teacherID: Number(searchID) },
        { _id: searchID.length === 24 ? searchID : null } 
      ]
    });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json(teacher)
    }
    catch (err){
        res.status(400).send(err.message)
    }
})
//Add a new entry in teacher, student, or coures
router.post("/course", async function(req,res){
    try {
        const course = await new Course(req.body);
        await course.save();
        res.status(201).json(course)
    }
    catch (err) {
        res.status(400).send(err.message)
    }
})

router.post("/Students", async function(req, res) {
    try {
        const studentData = req.body;

        const salt = await bcrypt.genSalt(10);
        studentData.password = await bcrypt.hash(studentData.password, salt);

        const student = new Student(studentData);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.post("/teacher", async function(req,res){
   try {
        const teacherData = req.body;

        const salt = await bcrypt.genSalt(10);
        teacherData.password = await bcrypt.hash(teacherData.password, salt);

        const teacher = new Teacher(teacherData);
        await teacher.save();
        res.status(201).json(teacher);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

//update a course, teacher, or student entry
router.put("/course/:id", async(req,res) => {
    try{
        const course = req.body
        await Course.updateOne({_id :req.params.id}, course)
        res.sendStatus(204)
    }
    catch(err){
        res.status(400).send(err.message)
    }
    
})

router.put("/Students/:id", async(req,res) => {
    try{
        const student = req.body
        await Student.updateOne({_id :req.params.id}, student)
        res.sendStatus(204)
    }
    catch(err){
        res.status(400).send(err.message)
    }
    
})

router.put("/teacher/:id", async(req,res) => {
    try{
        const teacher = req.body
        await Teacher.updateOne({_id :req.params.id}, teacher)
        res.sendStatus(204)
    }
    catch(err){
        res.status(400).send(err.message)
    }
    
})

//Finds and deletes one entry out of teacher, course, and student
router.delete('/course/:id', async function(req, res) {
   try {
      const result = await Course.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) {
         res.sendStatus(404);
      } 
      else {
         res.sendStatus(204);
      }
   }
   catch (err)
   {
      res.status(400).send(err.message);
   }
});

router.delete('/Students/:id', async function(req, res) {
   try {
      const result = await Student.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) {
         res.sendStatus(404);
      } 
      else {
         res.sendStatus(204);
      }
   }
   catch (err)
   {
      res.status(400).send(err.message);
   }
});

router.delete('/:id', async function(req, res) {
   try {
      const result = await Teacher.deleteOne({ _id: req.query._id });
      if (result.deletedCount === 0) {
         res.sendStatus(404);
      } 
      else {
         res.sendStatus(204);
      }
   }
   catch (err)
   {
      res.status(400).send(err.message);
   }
});

router.post("/login", async function(req, res) {
    try {
        const { loginName, password } = req.body;

        let user = await Teacher.findOne({ loginName });
        let role = "teacher";

        if (!user) {
            user = await Student.findOne({ loginName });
            role = "student";
        }

        if (!user) {
            return res.status(401).json({ error: "Bad username" });
        }

        // Use bcrypt to compare the plain text password with the hash in DB
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ loginName: user.loginName, role: role, id: user._id }, secret);
            res.json({ token,
                 role,
                 firstName : user.firstName,
                 userID: role === "teacher" ? user.teacherID : user.studentID 
                 });
        } else {
            res.status(401).json({ error: "Bad password" });
        }
    } catch (ex) {
        res.status(400).send(ex.message);
    }
});

app.use("/api", router)

app.listen(3000);


