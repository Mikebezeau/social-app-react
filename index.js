const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGO_DB } = require("./config.js");

const typeDefs = require("./graphql/TypeDefs");
const resolvers = require("./graphql/resolvers");

const pubsub = new PubSub();

const PORT = prcess.env.PORT || 5000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

mongoose
  .connect(MONGO_DB, { useNewUrlParser: true })
  .then(() => {
    console.log("Mongo connected");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  })
  .catch((err) => {
    console.error(err);
  });
