require('dotenv').config();
   const express = require('express');
   const mongoose = require('mongoose');
   const cors = require('cors');
   const Task = require('./models/Task');

   const app = express();
   app.use(cors());
   app.use(express.json());

   mongoose.connect(process.env.MONGO_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true
   })
     .then(() => console.log('MongoDB connected'))
     .catch(err => console.error(err));

   app.get('/tasks', async (req, res) => {
     try {
       const tasks = await Task.find().sort({ createdAt: -1 });
       res.json(tasks);
     } catch (err) {
       res.status(500).json({ message: err.message });
     }
   });

   app.post('/tasks', async (req, res) => {
     try {
       const { name, description, deadline } = req.body;
       const task = new Task({ name, description, deadline });
       const saved = await task.save();
       res.status(201).json(saved);
     } catch (err) {
       res.status(400).json({ message: err.message });
     }
   });

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
   