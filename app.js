const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const app = express()
app.use(express.static('public'))

// Set up middleware
app.use(bodyParser.urlencoded({ extended: true }))

// Set up EJS as the view engine
app.set('view engine', 'ejs')

// Array to store student data
const students = []
let nextStudentId = 0

function addStudent (name, age, email) {
  const student = {
    id: nextStudentId++,
    name,
    age,
    email
  }
  students.push(student)
  return student
}
// Define your routes
app.get('/', (req, res) => {
  res.redirect('/students') // Redirect to your desired default route
})

// Display the form to create a new student
app.get('/students/new', (req, res) => {
  res.render('new-student')
})

// Creating a new student and redirect to the list of students
app.post('/students', (req, res) => {
  const { name, age, email } = req.body
  addStudent(name, age, email)
  res.redirect('/students') // Redirect to the list of students
})

// Display a list of students
app.get('/students', (req, res) => {
  res.render('list-students', { students })
})

// Display the form to edit a student
app.get('/students/edit/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10) // Parse the id as an integer
  const student = students.find(s => s.id === studentId)

  if (!student) {
    // Handle the case where the student with the provided id does not exist
    res.status(404).send('Student not found')
    return
  }

  res.render('edit-student', { student })
})

// Update a student
app.post('/students/edit/:id', (req, res) => {
  const studentId = req.params.id
  const { name, age, email } = req.body

  // Update the student in the array
  students[studentId] = { name, age, email }
  res.redirect('/students')
})

// Start the server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
