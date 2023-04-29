import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import schema from "./graphql/schema";
import resolver from "./graphql/resolver";

const app = express();

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

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: resolver,
    graphiql: true,
    customFormatErrorFn: (error) => {
      if (!error.originalError) {
        return error;
      }
      return error.originalError;
    },
  }),
);


/*mongoose.connect(
    DATABASE_URL
)
    .then(() => {*/
app.listen(8080);
/* })
 .catch(err => {
     console.log(err);
 });*/
