import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const colRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'customers'
      ORDER BY ordinal_position;
    `);
    console.log("--- 'customers' Table Columns ---");
    colRes.rows.forEach(col => {
      console.log(`- ${col.column_name} (${col.data_type})`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

main();
