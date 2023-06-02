import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema";
import resolver from "./graphql/resolver";
import auth from "./middleware/Auth";
import { createServer } from "http";
import socket from "./socket";
import mongoose from "mongoose";
import { DATABASE_URL } from "./database/database";
import cors from "cors";

const app = express();
const httpServer = createServer(app);

app.use(bodyParser.json());

/*app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});*/

const corsOptions = {
  origin: "*", // Replace with the allowed origin
  methods: "OPTIONS, GET, POST, PUT, PATCH, DELETE", // Specify the allowed HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Specify the allowed headers
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

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
    httpServer.listen(8080);
    console.log("CONNECTED.");
    io.on("connection", () => {
      console.log("Socket Client Connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
