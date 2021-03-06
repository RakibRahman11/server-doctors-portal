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
    const usersCollection = database.collection("users");

    app.get('/appointments', async (req, res) => {
      const email = req.query.email
      const date = new Date(req.query.date).toLocaleDateString()
      const query = { email: email, date: date }
      const cursor = appointmentCollection.find(query)
      const appointment = await cursor.toArray();
      res.send(appointment)
    })

    app.get('/users/:email', async (req, res) => {
      const email = req.params.email
      const query = { email: email}
      const user = await usersCollection.findOne(query)
      let isAdmin = false
      if(user?.role === 'admin'){
        isAdmin = true
      }
      res.json({admin: isAdmin``})
    })

    app.post('/appointments', async (req, res) => {
      const appointment = req.body
      const result = await appointmentCollection.insertOne(appointment);
      res.json(result);
    })

    app.post('/users', async (req, res) => {
      const user = req.body
      const result = await usersCollection.insertOne(user);
      res.json(result);
    })

    app.put('/users', async (req, res) => {
      const user = req.body
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user};
      const result = await usersCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })

    app.put('/users/admin', async (req, res) => {
      const user = req.body
      const filter = { email: user.email };
      const updateDoc = { $set: {role:'admin'}};
      const result = await usersCollection.updateOne(filter, updateDoc);
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