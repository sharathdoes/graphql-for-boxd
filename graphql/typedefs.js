const typeDefs = `

  # User
  type User {
    id: ID!
    username: String!
    email: String!
    bio: String
    favoriteMovies: [Movie]
    favoriteGenres: [String]
    favoriteActors: [String]
    createdAt: String
    reviews:[Review]
    articles:[Article]
  }

  # Movie
  type Movie {
    id: ID!
    title: String!
    description: String
    releaseYear: Int
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

  type AuthPayload {
    token: String!
    user: User!
  }

  input Register {
    email :String!
    password:String!
    username:String!
  }

  input Login {
    email :String!
    password:String!
  }

  input CreateMovie {
    title:String!
    description:String!
    releaseYear:Int
    runtime:Int
    genre:[String]
    director:String!
  }

  input CreateReview {
    movie:ID!
    user:ID!
    comment:String
  }

    input CreateArticleInput {
    title: String!
    content: String!
  }

  

  type Query {
    users:[User!]!
    user(id:ID!)

    movies: [Movie!]!
    movie(id: ID!): Movie 
    
    reviews: [Review!]! 
    review(id: ID!): 
    reviewsByMovie(movieId: ID!): [Review!]!

    articles: [Article!]! 
    article(id: ID!): Article 
    articlesByUser(userId: ID!): [Article!]!

    # Current authenticated user (requires token)
    me: User # Returns the currently authenticated user
  }

  type Mutation {
    RegisterUser(input: Register!): AuthPayload!
    Login(input :Login!): AuthPayload!
    createMovie(input: CreateMovie ): Movie!
    createArticle(input :  CreateArticleInput):Article!
    createReview(input :CreateReview) : Review!
  }
`;

export default typeDefs;
