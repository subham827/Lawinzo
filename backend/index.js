const express = require('express');
const app = express();
const port = 5050;
const cors = require('cors');
const mongoose = require('mongoose');
const mongodb = require('mongodb');
app.use(cors());
const connectionString = 'mongodb+srv://subham:admin@cluster0.ruuf1zx.mongodb.net/?retryWrites=true&w=majority'

const MongoClient = mongodb.MongoClient;
app.use(express.json());

MongoClient.connect(connectionString).then(client => {
    console.log('Connected to Database');
    const db = client.db('lawinzo');
    const usersCollection = db.collection('user');
    usersCollection.createIndex({ email: 1 }, { unique: true });
    
    app.post('/api/auth/signup', async (req, res) => {
      try {
        console.log(req.body);
        const existingUser = await usersCollection.findOne({ email: req.body.email });
        
        if (existingUser) {
          res.send({ message: 'not ok' });
        } else {
          const doc = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          };
    
          const result = await usersCollection.insertOne(doc);
          console.log(result);
          res.send({ message: 'ok' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Internal Server Error' });
      }
    });
    
    app.post('/api/auth/login', async(req, res) => {
        const use = await usersCollection.findOne({ email: req.body.email, password: req.body.password });
        if(use){
            res.send({message : "success"})
        }
        else{
            res.send({ message: 'not ok' });
        }
    })
}).catch(error => console.error(error))




app.listen(port, () => console.log(`Server running on port ${port}`));

