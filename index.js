const express = require('express')
const app = express()
const port = process.env.DB_HOST || 5000
const { MongoClient } = require('mongodb');

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xpttu.mongodb.net/${process.env.DB_USER}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Doctors portal!')
})

app.listen(port, () => {
    console.log(`App listening :${port}`)
})