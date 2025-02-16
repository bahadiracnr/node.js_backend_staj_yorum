const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const fs = require('fs');
const path = require('path');
const resolvers = require('./resolvers');
const auth = require('./middlewares/auth');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(
  cors({
    origin: '*', // Tüm bağlantılara izin verir (güvenlik için ileride sınırlandırılabilir)
    credentials: true,
  }),
);

app.use(express.json());

const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schemas/schema.graphql'),
  'utf8',
);

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const server = new ApolloServer({
  schema,
  context: ({ req }) => {
    const user = auth(req);
    return { user };
  },
  csrfPrevention: true,
  cache: 'bounded',
  playground: true,
  introspection: true,
});

async function startServer() {
  await server.start();

  server.applyMiddleware({
    app,
    path: '/graphql',
    cors: {
      origin: '*', // Tüm bağlantılara izin verir (güvenlik için ileride sınırlandırılabilir)
      credentials: true,
    },
  });
}

// Sadece bir kere çağırıyoruz
startServer().catch((error) => {
  console.error('Server başlatma hatası:', error);
});

module.exports = { app, server };
