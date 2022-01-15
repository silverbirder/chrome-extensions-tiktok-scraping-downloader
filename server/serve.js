require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Firestore } = require('@google-cloud/firestore');

const port = process.env.PORT || 3000;

const uploadDoc = async (collectionName, docObj) => {
  const firestore = new Firestore();
  const collectionRef = firestore.collection(collectionName);
  await collectionRef.add(docObj);
};

express()
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .post('/', async (req, res, next) => {
    await uploadDoc(
      process.env.GOOGLE_CLOUD_FIRESTORE_COLLECTION,
      req.body.data,
    );
    console.log(`saved id:${req.body.data.id}`);
    res.sendStatus(200);
  })
  .listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })