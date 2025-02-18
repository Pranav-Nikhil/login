const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser'); // Import body-parser
const app = express();
const port = 3000;

app.use(bodyParser.json()); // Use body-parser to parse JSON

const uri = "mongodb://localhost:27017"; // Your MongoDB URI (replace with your connection string)
const client = new MongoClient(uri);

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db("your_database_name"); // Replace with your DB name
    const usersCollection = db.collection("users"); // Replace with your collection name

    app.post('/login', async (req, res) => {
      const { username, password } = req.body;

      const user = await usersCollection.findOne({ username, password }); // Find user

      if (user) {
        res.json({ message: "Login successful!" });
      } else {
        res.status(401).json({ message: "Invalid username or password." });
      }
    });

    app.get('/welcome', (req, res) => {  // Route for welcome page
        res.send("<h1>Welcome!</h1><p>You have successfully logged in.</p>");
    });

    app.get('/register', (req, res) => {
        res.sendFile(__dirname + '/register.html'); // Serve the registration page
    });

    app.post('/register', async (req, res) => {
        const { username, password } = req.body;
        try {
            await usersCollection.insertOne({ username, password });
            res.json({ message: "Registration successful!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error registering user." });
        }
    })

    app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS)

    app.listen(port, () => {
      console.log(`Server listening at http://localhost:${port}`);
    });

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

connectToMongo();