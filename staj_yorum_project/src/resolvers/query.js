const { session } = require('../config/neo4j');

module.exports = {
  getCompanies: async () => {
    try {
      const result = await session.run('MATCH (c:Company) RETURN c');
      return result.records.map((record) => record.get('c').properties);
    } catch (error) {
      console.error('getCompanies error:', error);
      throw error;
    }
  },

  getCompany: async (_, { id }) => {
    try {
      const result = await session.run('MATCH (c:Company {id: $id}) RETURN c', {
        id,
      });
      return result.records[0]?.get('c').properties || null;
    } catch (error) {
      console.error('getCompany error:', error);
      throw error;
    }
  },

  getReviews: async (_, { companyId }) => {
    try {
      const result = await session.run(
        `
        MATCH (c:Company {id: $companyId})<-[:ABOUT]-(r:Review)-[:WROTE]->(u:User)
        RETURN r, u
        `,
        { companyId },
      );
      return result.records.map((record) => ({
        ...record.get('r').properties,
        author: record.get('u').properties,
      }));
    } catch (error) {
      console.error('getReviews error:', error);
      throw error;
    }
  },
};
