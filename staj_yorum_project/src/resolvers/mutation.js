const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { session } = require('../config/neo4j');

module.exports = {
  // Mutation: yerine doğrudan exportluyoruz
  registerUser: async (_, { name, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    await session.run(
      `CREATE (u:User {id: randomUUID(), name: $name, email: $email, password: $password})`,
      { name, email, password: hashedPassword },
    );
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return token;
  },

  loginUser: async (_, { email, password }) => {
    const result = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email },
    );
    const user = result.records[0]?.get('u').properties;
    if (!user) throw new Error('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Incorrect password');

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return token;
  },

  addReview: async (_, { companyId, content, rating }, context) => {
    if (!context.user) throw new Error('Unauthorized');

    const userEmail = context.user.email;
    const result = await session.run(
      `MATCH (u:User {email: $userEmail}), (c:Company {id: $companyId})
       CREATE (r:Review {id: randomUUID(), content: $content, rating: $rating})
       CREATE (u)-[:WROTE]->(r)-[:ABOUT]->(c)
       RETURN r`,
      { userEmail, companyId, content, rating },
    );

    return result.records[0].get('r').properties;
  },
};
