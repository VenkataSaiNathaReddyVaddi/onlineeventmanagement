const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 80;

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'your-hostname',
  user: 'your-username',
  password: 'your-password',
  database: 'your-database-name',
});

// Connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
  console.log('Connected to the database');
});

// Serve static files from the "public" directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/js3/index.html');
  });


app.get('/', (req, res) => {
    const { email, password } = req.query;
  
    // Run MySQL query to validate email and password
    const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
    connection.query(query, [email, password], (error, results) => {
      if (error) {
        console.error('Error executing MySQL query:', error);
        res.sendStatus(500);
        return;
      }
  
      if (results.length > 0) {
        // Successful login, redirect to the dashboard page
        res.redirect('/dashboard');
      } else {
        // Failed login, redirect back to the login page
        res.redirect('/');
      }
    });
  });

// Stop the server and close the MySQL connection
app.on('close', () => {
  connection.end((error) => {
    if (error) {
      console.error('Error closing the database connection:', error);
      return;
    }
    console.log('Database connection closed');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
