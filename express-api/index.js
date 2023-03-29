import express from 'express';
import { json } from 'body-parser';
import { connect, Schema, model } from 'mongoose';
import cors from "cors";
import https from 'https';
import fs from 'fs';

const app = express();

// Connect to MongoDB
connect('MONGO_URL', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.log('Error connecting to MongoDB:', error));

// Define the schema for our data
const mockSchema = new Schema({
    name: String,
    age: Number,
    comment: String
});

// Create the model based on the schema
const Mock = model('Mock', mockSchema);

// Middleware to parse JSON data
app.use(json());
// Cross origin for communication between shopify and express
app.use(cors());
// use a static html file as the server frontend
app.use(express.static('public'));

// POST endpoint to add mock
app.post('/api/mock', async (req, res) => {
    try {
        const newMock = new Mock(req.body);
        await newMock.save();
        res.status(201).json({ message: 'Mock query successful', mock: newMock });
    } catch (error) {
        res.status(400).json({ message: 'Error creating mock query', error });
    }
});

// GET endpoint to fetch all mocks
app.get('/api/mock', async (req, res) => {
    try {
        const mocks = await Mock.find();
        res.status(200).json(mocks);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching mocks', error });
    }
});

// HTTPS server configuration
// const options = {
//   key: fs.readFileSync('/path/to/private/key.pem'),
//   cert: fs.readFileSync('/path/to/certificate.pem')
// };

// // Create an HTTPS server instance
// https.createServer(options, app).listen(443, () => {
//   console.log('Server is running on port 443');
// });
