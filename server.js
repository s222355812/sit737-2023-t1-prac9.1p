const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const app = express();
const winston = require('winston');
const { ObjectId } = require('mongodb');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calculate-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

const url = 'mongodb+srv://getdocsit725:rRt4v9xgaUUBisER@cluster0.ddz1vjq.mongodb.net/sit737';
const dbName = 'sit737';
const collectionName = 'texts';

async function connectToMongoDB() {
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
  
    // Middleware to parse request body as JSON
    app.use(express.json());
  
    // Insert a text document
    app.post('/texts', async (req, res) => {
      const text = { content: req.body.content };
  
      try {
        const result = await collection.insertOne(text);
        console.log('Text inserted successfully');
        res.status(200).json({ statuscode: 200, data: result.ops });
      } catch (err) {
        console.error('Failed to insert text:', err);
        res.status(500).json({ statuscode: 500, msg: err.toString() });
      }
    });
  
    // Find all text documents
    app.get('/texts', async (req, res) => {
      try {
        const texts = await collection.find().toArray();
        console.log('Found', texts.length, 'texts');
        res.status(200).json({ statuscode: 200, data: texts });
      } catch (err) {
        console.error('Failed to find texts:', err);
        res.status(500).json({ statuscode: 500, msg: err.toString() });
      }
    });
  
    // Update a text document
    app.put('/texts/:id', async (req, res) => {
      const filter = { _id: ObjectID(req.params.id) };
      const update = { $set: { content: req.body.content } };
  
      try {
        const result = await collection.updateOne(filter, update);
        console.log('Text updated successfully');
        res.status(200).json({ statuscode: 200, data: result });
      } catch (err) {
        console.error('Failed to update text:', err);
        res.status(500).json({ statuscode: 500, msg: err.toString() });
      }
    });
  
   // Delete a text document
app.delete('/texts/:id', async (req, res) => {
  const filter = { _id: ObjectID(req.params.id) };

  try {
    const result = await collection.deleteOne(filter);
    console.log('Text deleted successfully');
    res.status(200).json({ statuscode: 200, data: result.deletedCount });
  } catch (err) {
    console.error('Failed to delete text:', err);
    res.status(500).json({ statuscode: 500, msg: err.toString() });
  }
});

  
    const port = 3000;
    app.listen(port, () => {
      console.log("Hello, I'm listening to port " + port);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

connectToMongoDB();
