const { ApolloServer, gql } = require("apollo-server-lambda");
const FAUNA_SECURITY = `${process.env.FAUNA_SECURITY}`;
var faunadb = require("faunadb"),
  q = faunadb.query;

var client = new faunadb.Client({
  secret: FAUNA_SECURITY,
  domain: "db.fauna.com",
  // NOTE: Use the correct domain for your database's Region Group.
  port: 443,
  scheme: "https",
});

const typeDefs = gql`
  type Query {
    hello: String
    customers: [Customers]
    getQuestion: [Test]
    findQuestion(input: String!): [Test]
  }

  type Mutation {
    addCustomers(data: CustomersInput!): Customers
    addQuestion(question: String!, answer: String!): Test
  }

  input CustomersInput {
    firstName: String!
    lastName: String!
  }

  type Test {
    question: String!
    answer: String!
  }
  type Customers {
    id: ID!
    firstName: String
    lastName: String
  }
`;

const resolvers = {
  Query: {
    hello: (parent, args, context) => {
      return "Hello world!";
    },
    findQuestion: async (parent, { input }, context) => {
      var findQuestions = await client.query(
        q.Map(
          q.Filter(
            q.Paginate(q.Match(q.Index("getQuetion"))),
            q.Lambda(
              "planetRef",
              q.ContainsStr(
                q.LowerCase(
                  q.Select(["data", "question"], q.Get(q.Var("planetRef")))
                ),
                input
              )
            )
          ),
          q.Lambda(
            "planetRef",
            q.Let(
              {
                shipDoc: q.Get(q.Var("planetRef")),
              },
              {
                question: q.Select(["data", "question"], q.Var("shipDoc")),
                answer: q.Select(["data", "answer"], q.Var("shipDoc")),
              }
            )
          )
        )
      );
      return findQuestions.data;
    },
    getQuestion: async (parent, args, context) => {
      var questions = await client.query(
        q.Map(
          q.Paginate(q.Match(q.Index("getQuetion")), { size: 100 }),
          q.Lambda(
            "shipRef",
            q.Let(
              {
                shipDoc: q.Get(q.Var("shipRef")),
              },
              {
                question: q.Select(["data", "question"], q.Var("shipDoc")),
                answer: q.Select(["data", "answer"], q.Var("shipDoc")),
              }
            )
          )
        )
      );
      return questions.data;
    },
    customers: async (parents, args, context) => {
      var customers = await client.query(
        q.Map(
          q.Paginate(q.Match(q.Index("getCustomers")), { size: 100 }),
          q.Lambda(
            "shipRef",
            q.Let(
              {
                shipDoc: q.Get(q.Var("shipRef")),
              },
              {
                id: q.Select(["ref", "id"], q.Var("shipDoc")),
                firstName: q.Select(["data", "firstName"], q.Var("shipDoc")),
                lastName: q.Select(["data", "lastName"], q.Var("shipDoc")),
              }
            )
          )
        )
      );
      return customers.data;
    },
  },

  Mutation: {
    addQuestion: async (root, { question, answer }, context) => {
      var newQuestion = await client.query(
        q.Create(q.Collection("Test"), {
          data: { question: question, answer: answer },
        })
        /* q.Lambda(
          "testRef",
          q.Let(
            {
              testDoc: q.Get(q.Var("testRef")),
            },
            {
              id: q.Select(["ref", "id"], q.Var("shipDoc")),
              question: q.Select(["data", "question"], q.Var("shipDoc")),
              answer: q.Select(["data", "answer"], q.Var("shipDoc")),
            }
          )
        ) */
      );
      return newQuestion.data;
    },
    addCustomers: async (root, { data }, context) => {
      var newCustomer = await client.query(
        q.Create(q.Collection("Customers"), {
          data: { firstName: data.firstName, lastName: data.lastName },
        }),
        q.Lambda(
          "customerRef",
          q.Let(
            {
              customerDoc: q.Get(q.Var("customerRef")),
            },
            {
              id: q.Select(["ref", "id"], q.Var("shipDoc")),
              firstName: q.Select(["data", "firstName"], q.Var("shipDoc")),
              lastName: q.Select(["data", "lastName"], q.Var("shipDoc")),
            }
          )
        )
      );
      return newCustomer.data;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

exports.handler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});
