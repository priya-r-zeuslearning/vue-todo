const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Parses JSON body

const PORT = 3000;

// Dummy user (hardcoded)
const dummyUser = {
  email: 'test@example.com',
  password: 'password123', // plain text (not secure for real apps)
};

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check if email and password match the dummy user
  if (email === dummyUser.email && password === dummyUser.password) {
    // Simulate a token (hardcoded string)
    const token = 'dummy-jwt-token';

    return res.json({
      message: 'Login successful',
      token: token,
      user: {
        email: dummyUser.email,
      },
    });
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Dummy login API running at http://localhost:${PORT}`);
});
