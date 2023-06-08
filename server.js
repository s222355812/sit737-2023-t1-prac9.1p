const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const app = express();
const winston = require('winston');
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

const url = 'mongodb://localhost:32767/sit737?directConnection=true';


MongoClient.connect(url, function (err, client) {
  if (err) {
    console.error('Failed to connect to MongoDB:', err);
    return;
  }

  console.log('Connected to MongoDB successfully');
  const db = client.db('sit737'); 
  db.createCollection('texts', function (err, collection) {
    if (err) {
      console.error('Failed to create collection:', err);
      return;
    }
    console.log('Collection "texts" created successfully');

    // Insert a text document
    app.get('/insert', (req, res) => {
      const text = { content: 'Hello, MongoDB!' };

      collection.insertOne(text, function (err, result) {
        if (err) {
          console.error('Failed to insert text:', err);
          res.status(500).json({ statuscode: 500, msg: err.toString() });
          return;
        }

        console.log('Text inserted successfully');
        res.status(200).json({ statuscode: 200, data: result });
      });
    });

    // Find all text documents
    app.get('/find', (req, res) => {
      collection.find().toArray(function (err, texts) {
        if (err) {
          console.error('Failed to find texts:', err);
          res.status(500).json({ statuscode: 500, msg: err.toString() });
          return;
        }

        console.log('Found', texts.length, 'texts');
        res.status(200).json({ statuscode: 200, data: texts });
      });
    });

    // Update a text document
    app.get('/update', (req, res) => {
      const filter = { content: 'Hello, MongoDB!' };
      const update = { $set: { content: 'Updated text' } };

      collection.updateOne(filter, update, function (err, result) {
        if (err) {
          console.error('Failed to update text:', err);
          res.status(500).json({ statuscode: 500, msg: err.toString() });
          return;
        }

        console.log('Text updated successfully');
        res.status(200).json({ statuscode: 200, data: result });
      });
    });

    const port = 3000;
    app.listen(port, () => {
      console.log("Hello, I'm listening to port " + port);
    });
  });
});
