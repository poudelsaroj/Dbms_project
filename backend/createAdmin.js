const bcrypt = require('bcrypt');
const db = require('./config/db');

async function createAdmin() {
  try {
    const email = 'admin@example.com';
    const password = 'admin123'; // You should change this in production
    const name = 'Administrator';
    
    // Check if admin exists
    const [exists] = await db.query('SELECT id FROM admins WHERE email = ?', [email]);
    
    if (exists.length > 0) {
      console.log('Admin account already exists');
      return;
    }
    
    // Create admin with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );
    
    console.log('Admin account created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('Error creating admin account:', error);
  } finally {
    process.exit();
  }
}

createAdmin();