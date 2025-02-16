const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

module.exports = {
  Subscription: {
    reviewAdded: {
      subscribe: () => pubsub.asyncIterator(['REVIEW_ADDED']),
    },
  },
};
