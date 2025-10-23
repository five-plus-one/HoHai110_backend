// Verify table creation
require('dotenv').config();
const sequelize = require('./src/config/database');

const verifyTable = async () => {
  try {
    await sequelize.authenticate();

    const [results] = await sequelize.query(`
      SHOW TABLES LIKE 'verification_codes'
    `);

    if (results.length > 0) {
      console.log('✓ Table verification_codes exists');

      const [columns] = await sequelize.query(`
        DESCRIBE verification_codes
      `);

      console.log('\nTable structure:');
      console.table(columns);
    } else {
      console.log('✗ Table verification_codes does not exist');
    }

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

verifyTable();
