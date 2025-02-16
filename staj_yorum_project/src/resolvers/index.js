const Query = require('./query');
const Mutation = require('./mutation');
const Subscription = require('./subscription');

module.exports = {
  Query,
  Mutation,
  ...Subscription, // Subscription objesini doğrudan spread operatörü ile ekliyoruz
};
