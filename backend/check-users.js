
import db from './src/models/index.js';

async function checkUser() {
  try {
    await db.sequelize.authenticate();
    
    // Check all users
    const users = await db.User.findAll();
    console.log(`Found ${users.length} users:`);
    users.forEach(u => {
      console.log(`ID: ${u.id} | ClerkID: ${u.clerkId} | Name: "${u.name}" | Email: ${u.email}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await db.sequelize.close();
  }
}

checkUser();
