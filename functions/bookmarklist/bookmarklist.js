const { ApolloServer, gql } = require("apollo-server-lambda");
var faunadb = require("faunadb");

q = faunadb.query

const typeDefs = gql`
  type Query {
    bookmarks: [Bookmark]
  }
  type Bookmark {
    id: ID!
    title: String!
    url: String!
  }
  type Mutation {
    addBookmark(title: String!,url: String!): Bookmark
  }
`;

const resolvers = {
  Query: {
    bookmarks: async () => {
      try {
        var adminClient = new faunadb.Client({ secret: 'fnAEINlPAxACCXsFprqpbh7mDXPl_iu7CrZCQTlE' });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index('url'))),
            q.Lambda(x => q.Get(x))
          )
        )
        return result.data.map((el) => {
          return {
            id: el.ts,
            title: el.data.title,
            url: el.data.url
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
  },
  Mutation: {
    addBookmark: async (_, { title, url }) => {
      try {
        var adminClient = new faunadb.Client({ secret: 'fnAEINlPAxACCXsFprqpbh7mDXPl_iu7CrZCQTlE' });
        const result = await adminClient.query(
          q.Create(
            q.Collection('bookmarks'),
            {
              data: {
                title,
                url
              }
            },
          )
        )

      }
      catch (err) {
        console.log(err)
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = server.createHandler();

module.exports = { handler };
