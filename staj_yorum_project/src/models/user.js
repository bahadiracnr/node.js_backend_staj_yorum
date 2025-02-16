const bcrypt = require('bcryptjs');
const { session } = require('../config/neo4j');

class User {
  static async create({ name, lastName, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 8);
    const result = await session.run(
      `CREATE (u:User {
        id: randomUUID(),
        name: $name,
        lastName: $lastName,
        email: $email,
        password: $password
      }) RETURN u`,
      { name, lastName, email, password: hashedPassword },
    );
    return result.records[0].get('u').properties;
  }

  static async findByEmail(email) {
    const result = await session.run(
      'MATCH (u:User {email: $email}) RETURN u',
      { email },
    );
    return result.records[0]?.get('u').properties;
  }
}

module.exports = User;
