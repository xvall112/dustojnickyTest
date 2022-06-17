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
            q.Paginate(q.Match(q.Index("all_Questions")), { size: 1000 }),
            q.Lambda(
              "questionRef",
              q.ContainsStr(
                q.LowerCase(
                  q.Select(["data", "question"], q.Get(q.Var("questionRef")))
                ),
                input.toLowerCase()
              )
            )
          ),
          q.Lambda(
            "questionRef",
            q.Let(
              {
                questionDoc: q.Get(q.Var("questionRef")),
              },
              {
                question: q.Select(["data", "question"], q.Var("questionDoc")),
                answer: q.Select(["data", "answer"], q.Var("questionDoc")),
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
