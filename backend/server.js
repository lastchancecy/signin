require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Import PostgreSQL Pool
const http = require('http');
const { Server } = require('socket.io');
const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

app.use(express.json());
app.use(cors());

// PostgreSQL Connection Pool
const pool = new Pool({
  host: process.env.SUPABASE_HOST,
  user: process.env.SUPABASE_USER,
  password: process.env.SUPABASE_PASSWORD,
  database: process.env.SUPABASE_DATABASE,
  port: process.env.SUPABASE_PORT || 5432,
  ssl: { rejectUnauthorized: false },
});

const upload = require('./cloudinary'); // Multer configuration for cloudinary


app.post('/ads', upload.single('image'), async (req, res) => {
  const { title, description, userId, dj, staff, pr } = req.body;
  const image_url = req.file.path; // Multer provides the file path

  try {
    const result = await pool.query(
      'INSERT INTO ads (title, description, image_url, user_id, dj, staff, pr) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [title, description, image_url, userId, dj, staff, pr]
    );
    res.status(201).json({ message: 'Ad created successfully' });
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).json({ message: 'Error creating ad' });
  }
});

app.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password,phone } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO users (firstName, lastName, email, password,phone) VALUES ($1, $2, $3, $4,$5)',
        [firstName, lastName, email, password,phone]
      );
      res.status(201).send('User created');
    } catch (error) {
      console.error('Error inserting user: ', error);
      res.status(500).send('Error creating user');
    }
  });

  app.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const result = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND password = $2',
        [email, password]
      );
  
      if (result.rows.length > 0) {
        const user = result.rows[0];
  
        // Return a JSON response with userId and a success message
        res.status(200).json({ userId: user.id, message: 'Sign-in successful' });
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Error during sign-in: ', error);
      res.status(500).json({ message: 'Error during sign-in' });
    }
  });
  
  app.get('/ads', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM ads ORDER BY created_at DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching ads:', error);
      res.status(500).json({ message: 'Error fetching ads' });
    }
  });
  
  app.get('/ads/:id', async (req, res) => {
    const adId = parseInt(req.params.id);
  
    try {
      const result = await pool.query('SELECT * FROM ads WHERE id = $1', [adId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Ad not found' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching ad details:', error);
      res.status(500).json({ message: 'Error fetching ad details' });
    }
  });

  app.get('/profile/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const result = await pool.query(
        'SELECT firstname, lastname, email FROM users WHERE id = $1',
        [userId]
      );
  
      if (result.rows.length > 0) {
        const user = result.rows[0];
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching user profile: ', error);
      res.status(500).json({ message: 'Error fetching user profile' });
    }
  });
  
  app.get('/users/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ message: 'Error fetching user' });
    }
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
