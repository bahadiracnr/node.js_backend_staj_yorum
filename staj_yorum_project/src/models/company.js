const { session } = require('../config/neo4j');

class Company {
  static async create({
    name,
    sector,
    employees,
    startingYear,
    workingDays,
    links,
    address,
  }) {
    try {
      const result = await session.run(
        `CREATE (c:Company {
          id: randomUUID(),
          name: $name,
          sector: $sector,
          employees: $employees,
          startingYear: $startingYear,
          workingDays: $workingDays,
          links: $links,
          address: $address,
          averageRating: 0
        }) RETURN c`,
        {
          name,
          sector,
          employees,
          startingYear,
          workingDays,
          links,
          address,
        },
      );
      return result.records[0].get('c').properties;
    } catch (error) {
      console.error('Error creating company:', error);
      throw error;
    }
  }

  static async getAll() {
    try {
      const result = await session.run('MATCH (c:Company) RETURN c');
      return result.records.map((record) => record.get('c').properties);
    } catch (error) {
      console.error('Error getting all companies:', error);
      throw error;
    }
  }

  static async getById(id) {
    try {
      const result = await session.run('MATCH (c:Company {id: $id}) RETURN c', {
        id,
      });
      return result.records[0]?.get('c').properties;
    } catch (error) {
      console.error('Error getting company by id:', error);
      throw error;
    }
  }

  static async getReviews(companyId) {
    try {
      const result = await session.run(
        `MATCH (c:Company {id: $companyId})<-[:ABOUT]-(r:Review)-[:WROTE]->(u:User)
         RETURN r, u`,
        { companyId },
      );
      return result.records.map((record) => ({
        ...record.get('r').properties,
        author: record.get('u').properties,
      }));
    } catch (error) {
      console.error('Error getting company reviews:', error);
      throw error;
    }
  }

  static async updateAverageRating(companyId) {
    try {
      const result = await session.run(
        `MATCH (c:Company {id: $companyId})<-[:ABOUT]-(r:Review)
         WITH c, avg(r.rating) as avgRating
         SET c.averageRating = avgRating
         RETURN c`,
        { companyId },
      );
      return result.records[0]?.get('c').properties;
    } catch (error) {
      console.error('Error updating average rating:', error);
      throw error;
    }
  }
}

module.exports = Company;
