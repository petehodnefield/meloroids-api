const express = require("express");
// import ApolloServer
const { ApolloServer } = require("apollo-server-express");
const path = require("path");
// import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
const db = require("./config/connection");
const seedDB = require("./seeds/seeds");

const PORT = process.env.PORT;
// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache: "bounded",
  persistedQueries: false,
  context: authMiddleware,
  introspection: true,
});
//
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });
  // Serve up static assets
  app.use(
    "/images",
    express.static(path.join(__dirname, "../frontend/images"))
  );
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));
  }
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./index.html"));
  });
  console.log(path.join(__dirname, "../frontend/build/index.html"));
  db.once("open", async () => {
    await seedDB();
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // log where we can go to test our GQL API
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
