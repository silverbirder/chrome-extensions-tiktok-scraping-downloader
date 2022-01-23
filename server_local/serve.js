const express = require('express');
const cors = require('cors');
const fs = require('fs');

const port = process.env.PORT || 3000;

express()
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .post('/', async (req, res, next) => {
    const data = req.body.data;
    fs.writeFileSync(`./data/${req.body.data.id}.json`, JSON.stringify(data));
    res.sendStatus(200);
  })
  .listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })