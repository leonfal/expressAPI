import express from 'express';
import bodyParser from 'body-parser';
import { connect, Schema, model } from 'mongoose';
import cors from "cors";
import dotenv from "dotenv";

const app = express();
dotenv.config();
// Connect to MongoDB
connect(process.env.MONGO_URL, {
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
app.use(express.json());
app.use(bodyParser.json());
// Cross origin for communication between shopify and express
app.use(cors());

// POST endpoint to add mock
app.post('/api/mock', async (req, res) => {
    const { name, age, comment } = req.body;
  
    try {
      const newMock = new Mock({
         name, 
         age, 
         comment
        });

      await newMock.save();
      
      res.status(201).json({ message: 'Mock query successful', mock: newMock });
    } catch (error) {
      console.error('Error creating mock:', error);
      res.status(400).json({ message: 'Error creating mock', error });
    }
  });

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
