const { session } = require('../config/neo4j');

class Review {
  static async create({
    userId,
    companyId,
    content,
    rating,
    position,
    startDate,
    endDate,
    technologies,
    ratings,
    privacy,
  }) {
    const result = await session.run(
      `MATCH (u:User {id: $userId})
       MATCH (c:Company {id: $companyId})
       CREATE (r:Review {
         id: randomUUID(),
         content: $content,
         rating: $rating,
         position: $position,
         startDate: $startDate,
         endDate: $endDate,
         technologies: $technologies,
         officeEnvironment: $officeEnvironment,
         educationSupport: $educationSupport,
         salaryBenefits: $salaryBenefits,
         privacy: $privacy
       })
       CREATE (u)-[:WROTE]->(r)-[:ABOUT]->(c)
       RETURN r`,
      {
        userId,
        companyId,
        content,
        rating,
        position,
        startDate,
        endDate,
        technologies,
        officeEnvironment: ratings.officeEnvironment,
        educationSupport: ratings.educationSupport,
        salaryBenefits: ratings.salaryBenefits,
        privacy,
      },
    );
    return result.records[0].get('r').properties;
  }

  static async getByCompanyId(companyId) {
    const result = await session.run(
      `MATCH (c:Company {id: $companyId})<-[:ABOUT]-(r:Review)-[:WROTE]->(u:User)
       RETURN r, u`,
      { companyId },
    );
    return result.records.map((record) => ({
      ...record.get('r').properties,
      author: record.get('u').properties,
    }));
  }
}

module.exports = Review;
