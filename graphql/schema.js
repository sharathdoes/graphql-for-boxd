
const typeDefs = `

  # User
  type User {
    id: ID!
    username: String!
    email: String!
    bio: String
    avatar: String
    favoriteMovies: [Movie]
    favoriteGenres: [String]
    favoriteActors: [String]
    createdAt: String
  }

  # Movie
  type Movie {
    id: ID!
    title: String!
    description: String
    releaseDate: String
    runtime: Int
    genres: [String]
    director: String
    cast: [String]
    AvgRating: Float
    likesCount: Int
    reviews: [Review]
    createdAt: String
  }

  # Review
  type Review {
    id: ID!
    user: User!
    movie: Movie!
    rating: Float
    reviewText: String
    likes: Int
    comments: [Comment]
    createdAt: String
  }

  # Comment
  type Comment {
    id: ID!
    user: User!
    comment: String
    createdAt: String
  }

  # Article
  type Article {
    id: ID!
    author: User!
    title: String!
    content: String
    tags: [String]
    likes: Int
    createdAt: String
  }

  type Query {
    getUser(id: ID!): User
    getMovie(id: ID!): Movie
    getAllMovies: [Movie]
    getReview(id: ID!): Review
    getAllArticles: [Article]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(username: String!, password: String!): String

    addMovie(
      title: String!
      description: String
      releaseDate: String
      runtime: Int
      genres: [String]
      director: String
      cast: [String]
    ): Movie

    addReview(movieId: ID!, userId: ID!, rating: Float!, reviewText: String): Review

    addComment(reviewId: ID!, userId: ID!, comment: String!): Comment

    addArticle(title: String!, content: String, tags: [String], authorId: ID!): Article
  }
`;

export default typeDefs;
