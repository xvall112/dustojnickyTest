const { ApolloServer, gql } = require("apollo-server-lambda");
const FAUNA_SECURITY = `${process.env.FAUNA_SECURITY}`;
var faunadb = require("faunadb"),
  q = faunadb.query;

var client = new faunadb.Client({
  secret: `${process.env.FAUNA_SECURITY}`,
  domain: "db.fauna.com",
  // NOTE: Use the correct domain for your database's Region Group.
  port: 443,
  scheme: "https",
});

const typeDefs = gql`
  type Query {
    findQuestion(input: String!): [Test]
  }

  type Mutation {
    addQuestion(question: String!, answer: String!): Test
  }

  type Test {
    question: String!
    answer: String!
  }
`;

const resolvers = {
  Query: {
    findQuestion: async (parent, { input }, context) => {
      var findQuestions = await client.query(
        q.Map(
          q.Filter(
            q.Paginate(q.Match(q.Index("getQuetion")), { size: 300 }),
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
