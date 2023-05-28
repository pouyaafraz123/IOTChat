import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema";
import resolver from "./graphql/resolver";
import mongoose from "mongoose";
import { DATABASE_URL } from "./database/database";
import auth from "./middleware/Auth";
import { createServer } from "http";
import socket from "./socket";

const app = express();
const httpServer = createServer(app);

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(auth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
    customFormatErrorFn(err: any) {
      console.log(err);
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  }),
);

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    const io = socket.init(httpServer);
    httpServer.listen(3000);
    console.log("CONNECTED.");
    io.on("connection", () => {
      console.log("Socket Client Connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
