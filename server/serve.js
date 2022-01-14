require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');

const upload = multer({ dest: 'uploads/' })
const port = process.env.PORT || 3000;

const uploadFile = async (bucketName, filePath, destFileName) => {
  const storage = new Storage();
  return storage.bucket(bucketName).upload(filePath, {
    destination: destFileName,
  });
}

const uploadDoc = async (collectionName, docObj) => {
  const firestore = new Firestore();
  const collectionRef = firestore.collection(collectionName);
  await collectionRef.add(docObj);
};

express()
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(cookieParser())
  .post('/', upload.array('files', 3), async (req, res, next) => {
    console.log('post!');
    const data = JSON.parse(req.body.data);
    const files = req.files;
    const uploadResponses = await Promise.all(files.map((f) => {
      return uploadFile(
        process.env.GOOGLE_CLOUD_STORAGE_BUCKET,
        f.path,
        f.originalname
      )
    }));
    const uploadFiles = uploadResponses.map((u) => {
      const [file, meta] = u;
      const publicUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET}/${file.id.replace(/\/\d+$/, '')}`;
      const splitFileName = file.name.split('-');
      const typeName = splitFileName.slice(0, splitFileName.length - 1).join('-');
      const result = {};
      result[typeName] = publicUrl;
      return result;
    })
    const params = data;
    uploadFiles.map((u) => {
      Object.assign(params, u);
    })
    await uploadDoc(
      process.env.GOOGLE_CLOUD_FIRESTORE_COLLECTION,
      params,
    );
    res.sendStatus(200);
  })
  .listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })