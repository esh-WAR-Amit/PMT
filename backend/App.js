// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require("dotenv").config();

// Import models
const User = require('./models/user');
const Project = require('./models/project');
const Task = require('./models/task');
const ProjectMember = require('./models/projectMember');

// Import routes
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const projectMemberRoutes = require('./routes/projectMemberRoutes');



// Initialize the Express application
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());

// Middleware
app.use(
    cors({
        origin: ['http://localhost:5173', 'http://192.168.1.10:5173'],
      credentials: true,
    })
  );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())


// Route for the home page
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

const verifyToken = require('./middleware/auth');

// Use the user routes
app.use('/api', verifyToken, userRoutes);
app.use('/api', verifyToken, projectRoutes);
app.use('/api', verifyToken, taskRoutes);
app.use('/api', verifyToken, projectMemberRoutes);


app.use('/auth', require('./routes/auth'));

// Function to create tables
const initializeTables = async () => {
    try {
        await User.createTable();
        await Project.createTable();
        await Task.createTable();
        await ProjectMember.createTable();
        console.log('All tables created or already exist.');
    } catch (error) {
        console.error('Error creating tables:', error);
    }
};


initializeTables().then(() => {
    app.listen(PORT, '0.0.0.0', () => { // '0.0.0.0' binds the server to all network interfaces
        console.log(`Server is running on http://localhost:${PORT}`);
        console.log(`Accessible on your network at http://192.168.1.10:${PORT}`);
    });
});

