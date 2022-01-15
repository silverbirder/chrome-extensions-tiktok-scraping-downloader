require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Firestore } = require('@google-cloud/firestore');

const port = process.env.PORT || 3000;

const uploadDoc = async (collectionName, docObj) => {
  const firestore = new Firestore();
  const documentRef = firestore.collection(collectionName).doc(docObj.id);
  await documentRef.set(docObj);
};

express()
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .post('/', async (req, res, next) => {
    const data = req.body.data;
    data['timestamp'] = Date.now();
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