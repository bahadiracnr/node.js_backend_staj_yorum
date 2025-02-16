const neo4j = require('neo4j-driver');
require('dotenv').config();

// Environment variables'ları kontrol et
const uri = process.env.NEO4J_URI;
const user = process.env.NEO4J_USER;
const password = process.env.NEO4J_PASSWORD;
const database = process.env.NEO4J_DATABASE;

if (!uri || !user || !password || !database) {
  throw new Error('Missing Neo4j connection details in environment variables');
}

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const session = driver.session({ database });

// Hata yakalama ekleyelim
driver
  .verifyConnectivity()
  .then(() => console.log('Connected to Neo4j'))
  .catch((error) => console.error('Neo4j connection error:', error));

module.exports = { driver, session };
