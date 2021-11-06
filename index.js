const express = require('express')
const cors = require('cors')
const port = process.env.DB_HOST || 5000
const { MongoClient } = require('mongodb');
require('dotenv').config()
const app = express()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xpttu.mongodb.net/${process.env.DB_USER}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
  try {
    await client.connect();
    const database = client.db("doctors-portal");
    const appointmentCollection = database.collection("appointments");

    app.get('/appointments', async(req, res) => {
      const email = req.query.email
      const date = new Date(req.query.date).toLocaleDateString()
      const query = {email:email, date:date}
      const cursor = appointmentCollection.find(query)
      const appointment = await cursor.toArray();
      res.send(appointment)
    })

    app.post('/appointments', async(req, res) => {
      const appointment = req.body
      const result = await appointmentCollection.insertOne(appointment);
      res.json(result);
    })
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