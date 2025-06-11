import { gql } from 'apollo-server-express';

const typeDefs = gql`


type User {
  id: ID!
  username: String!
  email: String!
}

type Log {
  id: ID!
  userId: ID!
  sourceModel: String!
  logSourceId: ID!
  logTitle: String
  liked: Boolean
  rating: Int
  review: String
  tags: [String]
  createdAt: String
}

type Movie {
  id: ID!
  title: String!
  description: String
  runtime: Int
  year: String
  AvgRating: Float
  likesCount: Int
  genre: [String]
  DirectedBy: String
  cast: [String]
  logs: [Log]
}

type Series {
  id: ID!
  title: String!
  description: String
  runtime: Int
  year: String
  AvgRating: Float
  likesCount: Int
  genre: [String]
  DirectedBy: String
  cast: [String]
  logs: [Log]
}

# --- Aggregated Types ---

type MyActivity {
  recentLogs: [Log]
  popularReviews: [Log]
  totalMovies: Int
  totalSeries: Int
  moviesThisYear: Int
  ratingsGraph: [Int]
  tagsUsed: [String]
}

type Recommendation {
  reccMovies: [Movie]
  reccSeries: [Series]
}

# --- Input Types ---

input AddLogInput {
  userId: ID!
  sourceModel: String!
  logSourceId: ID!
  logTitle: String
  liked: Boolean
  rating: Int
  review: String
  tags: [String]
}

# --- Root Query & Mutation ---

type Query {
  myActivity(userId: ID!): MyActivity
  recommendations(userId: ID!): Recommendation
  myLogs(userId: ID!): [Log]
}

type Mutation {
  addLog(input: AddLogInput!): Log
  deleteLog(userId: ID!, logId: ID!): String
}
`;

export default typeDefs;
