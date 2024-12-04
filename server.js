const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Ensure the "users/uploads" directory exists
const uploadsDir = path.join(__dirname, 'app', 'users', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

// JWT Secret Key
const SECRET_KEY = 'your_secret_key';

// Connect to MongoDB Compass (app is the database)
const mongoURI = 'mongodb://localhost:27017/app'; // MongoDB URI remains the same

// Connect to MongoDB
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// User schema and model
const userSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        dob: { type: Date, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    { timestamps: true }
);
const User = mongoose.model('User', userSchema);

// Multer storage setup to upload files to the "users/uploads" folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Save files in the 'users/uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Rename the file with a timestamp
    }
});

const upload = multer({ storage });

// Routes

// Create user route
app.post('/create', async (req, res) => {
    try {
        const { fullName, email, phone, dob, username, password } = req.body;
        if (!fullName || !email || !phone || !dob || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ fullName, email, phone, dob, username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'Account created successfully' });
    } catch (error) {
        console.error('Error in /create route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token, user: { username: user.username, fullName: user.fullName } });
    } catch (error) {
        console.error('Error in /login route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Profile route (accessing user profile info)
app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in /profile route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload image route
app.post('/upload', authenticateToken, upload.single('imageInput'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(201).json({ filePath: req.file.path, message: 'Image uploaded successfully' }); // Return the file path
});

// Fetch uploaded image
app.get('/image/:filename', async (req, res) => {
    const filePath = path.join(uploadsDir, req.params.filename);
    
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) return res.status(404).json({ message: 'Image not found' });

        res.sendFile(filePath);
    });
});

// Process image using Flask server
app.post('/process-image', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const flaskResponse = await axios.post(
            'http://localhost:5000/process-image',
            req.file.buffer,
            {
                headers: { 'Content-Type': 'image/png' },
                responseType: 'arraybuffer',
            }
        );

        res.set('Content-Type', 'image/png');
        res.send(flaskResponse.data);

    } catch (error) {
        console.error('Error processing image:', error.message);
        res.status(500).json({ message: 'Error processing image' });
    }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
 