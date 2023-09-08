const express = require('express');
const mysql = require('mysql2');
const app = express();


// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'admins',
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

// Define routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/public/dashboard.html');
});

app.get('/addevent', (req, res) => {
  const { Eventname, Date , time , link } = req.query;

  // Run MySQL query to validate email and password
  const query = 'INSERT INTO events (event_name, event_date, event_time, event_links) VALUES ( ? , ? , ? , ? )';
  connection.query(query, [ Eventname, Date , time , link ], (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.sendStatus(500);
      return;
    }

    if (results.length > 0) {
      res.send(`<script>alert('Event is added');</script>`);
    } else {
      res.send(`<script>alert('Event is added');</script>`);
    }
  });
});

app.get('/deleteevent', (req, res) => {
  const eventName = req.query.Eventname;

  const query = 'DELETE FROM events WHERE event_name = ?';
  connection.query(query, [eventName], (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.sendStatus(500);
      return;
    }

    if (results.affectedRows > 0) {
      res.send(`<script>alert('Event successfully deleted');</script>`);
    } else {
      res.send(`<script>alert('Event not found or could not be deleted');</script>`);
      res.redirect('/');
    }
  });
});


app.get('/addnewadmin', (req, res) => {
  const { id ,email, Designation , password , mobile } = req.query;
  const query = 'INSERT INTO list ( college_id , position, email , mobile_number , password) VALUES ( ? , ? , ? , ? , ? )';
  connection.query(query, [ id ,Designation , email , mobile , password ], (error, results) => {
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.sendStatus(500);
      return;
    }
    if (results.length > 0) {
      res.send(`<script>alert('The new user can login now');</script>`);
      res.redirect('/login');
    } else {
      res.send(`<script>alert('Event is added');</script>`);
    }
  });
});

// Handle login form submission
app.get('/login', (req, res) => {
  const { email, psw } = req.query;

  // Run MySQL query to validate email and password
  const query = 'SELECT * FROM list WHERE email = ? AND password = ?';
  connection.query(query, [email, psw], (error, results) => {
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

app.get('/upcoming-events', (req, res) => {
  // Fetch upcoming events from the database (adjust the query as needed)
  const query = 'SELECT event_name, event_date, event_time FROM events WHERE event_date >= CURDATE() ORDER BY event_date ASC LIMIT 1';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error executing MySQL query:', error);
          res.sendStatus(500);
          return;
      }
      console.log(results);
      res.json(results);
  });
});


app.get('/upcoming-events-all', (req, res) => {
  // Fetch upcoming events from the database (adjust the query as needed)
  const query = 'SELECT event_name, event_date, event_time FROM events WHERE event_date >= CURDATE() ORDER BY event_date ASC';
  connection.query(query, (error, results) => {
      if (error) {
          console.error('Error executing MySQL query:', error);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
      }
      console.log(results);
      res.json(results);
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
app.listen(80, () => {
  console.log(`Server is running on http://localhost:80`);
});
