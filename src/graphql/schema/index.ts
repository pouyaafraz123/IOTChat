const {buildSchema} = require("graphql");

const schema = buildSchema(`
     schema {
        query: Query
     }
    
    type Query{
        hello:String!
    }
`);


export default schema;
