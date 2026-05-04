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

//get all entries in teacher, student, courses
router.get("/course", async function(req,res){
    try {
        const courses = await Course.find();
        res.json(courses)

    }
    catch(res){
        res.status(400).send(err);

    }
})

router.get("/Students", async function(req,res){
    try {
        const students= await Student.find();
        res.json(students)

    }
    catch(res){
        res.status(400).send(err);

    }
})

router.get("/teacher", async function(req,res){
    try {
        const teachers = await Teacher.find();
        res.json(teachers)

    }
    catch(res){
        res.status(400).send(err);

    }
})

//Get one entry in teacher, students, and courses
router.get('/course/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        res.json(course);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/Students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    res.json(student);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/teacher/:id", async(req,res) =>{
    try {
        const teacher = await Teacher.findById(req.params.id)
        res.json(teacher)
    }
    catch (err){
        res.status(400).send(err)
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
        res.status(400).send(err)
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
        const teacher = await new Teacher(req.body);
        await teacher.save();
        res.status(201).json(teacher)
    }
    catch (err) {
        res.status(400).send(err)
    }
})

//update a course, teacher, or student entry
router.put("/course/:id", async(req,res) => {
    try{
        const course = req.body
        await Course.updateOne({_id :req.params.id}, course)
        res.sendStatus(204)
    }
    catch(err){
        res.status(400).send(err)
    }
    
})

router.put("/Student/:id", async(req,res) => {
    try{
        const student = req.body
        await Student.updateOne({_id :req.params.id}, student)
        res.sendStatus(204)
    }
    catch(err){
        res.status(400).send(err)
    }
    
})

router.put("/teacher/:id", async(req,res) => {
    try{
        const teacher = req.body
        await Teacher.updateOne({_id :req.params.id}, teacher)
        res.sendStatus(204)
    }
    catch(err){
        res.status(400).send(err)
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
      res.status(400).send(err);
   }
});

router.delete('/Student/:id', async function(req, res) {
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
      res.status(400).send(err);
   }
});

router.delete('/teacher/:id', async function(req, res) {
   try {
      const result = await Teacher.deleteOne({ _id: req.params.id });
      if (result.deletedCount === 0) {
         res.sendStatus(404);
      } 
      else {
         res.sendStatus(204);
      }
   }
   catch (err)
   {
      res.status(400).send(err);
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
            res.json({ token, role });
        } else {
            res.status(401).json({ error: "Bad password" });
        }
    } catch (ex) {
        res.status(400).send(ex.message);
    }
});

app.use("/api", router)

app.listen(3000);


