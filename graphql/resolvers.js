import User from "../models/user.js";
import Movie from "../models/movies.js";
import Review from "../models/review.js";
import Article from "../models/article.js";
import { verify, generatetoken } from "../utils/auth.js";
const resolvers = {
  //maps type user{}
  User:{
    reviews: async(parent)=>{
      return await Article.find({user:parent.id});
    },  
    movies: async(parent)=>{
      return await Movie.find({user:parent.id})
    }
  },

  // Maps to: `type Movie { ... reviews: [Review!]! }` and `type Movie { ... averageRating: Float }` in typeDefs.js
  Movie: {
    // Resolver for `Movie.reviews`: Fetches all reviews for this movie.
    // Queries the Review model using the movie's ID.
    reviews: async (parent) => {
      // Direct query to Review model using the parent movie's ID
      return await Review.find({ movie: parent.id });
    },
    // Resolver for `Movie.averageRating`: Calculates the average rating dynamically.
    // It first fetches all reviews for the movie and then calculates the average.
    averageRating: async (parent) => {
      const reviews = await Review.find({ movie: parent.id });
      if (reviews.length === 0) return 0;
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      return totalRating / reviews.length;
    },
  },

  Review: {
    // Resolver for `Review.movie`: Fetches the movie associated with this review.
    // Queries the Movie model using the movie ID stored in the parent review object.
    movie: async (parent) => {
      // Direct query to Movie model using the movie ID from the parent review
      return await Movie.findById(parent.movie);
    },
    // Resolver for `Review.user`: Fetches the user who wrote this review.
    // Queries the User model using the user ID stored in the parent review object.
    user: async (parent) => {
      // Direct query to User model using the user ID from the parent review
      return await User.findById(parent.user);
    },
  },

  // Maps to: `type Article { ... author: User! }` in typeDefs.js
  Article: {
    // Resolver for `Article.author`: Fetches the user who authored this article.
    // Queries the User model using the author ID stored in the parent article object.
    author: async (parent) => {
      // Direct query to User model using the author ID from the parent article
      return await User.findById(parent.author);
    },
  },

  Query: {
     // Maps to: `users: [User!]!`
     users: async () => {
      return await User.find({});
    },
    // Maps to: `user(id: ID!): User`
    user: async (parent, { id }) => {
      return await User.findById(id);
    },
    // Maps to: `me: User`
    me: async (parent, args, context) => {
      // Authentication check: context.user is populated by the Apollo Server context function
      if (!context.user) {
        throw new Error('Authentication required');
      }
      return await User.findById(context.user.id);
    },

    // Maps to: `movies: [Movie!]!`
    movies: async () => {
      return await Movie.find({});
    },
    // Maps to: `movie(id: ID!): Movie`
    movie: async (parent, { id }) => {
      return await Movie.findById(id);
    },

    // Maps to: `reviews: [Review!]!`
    reviews: async () => {
      return await Review.find({});
    },
    // Maps to: `review(id: ID!): Review`
    review: async (parent, { id }) => {
      return await Review.findById(id);
    },
    // Maps to: `reviewsByMovie(movieId: ID!): [Review!]!`
    reviewsByMovie: async (parent, { movieId }) => {
      return await Review.find({ movie: movieId });
    },

    // Maps to: `articles: [Article!]!`
    articles: async () => {
      return await Article.find({});
    },
    // Maps to: `article(id: ID!): Article`
    article: async (parent, { id }) => {
      return await Article.findById(id);
    },
    // Maps to: `articlesByUser(userId: ID!): [Article!]!`
    articlesByUser: async (parent, { userId }) => {
      return await Article.find({ author: userId });
    },
  },

  Mutation : {
    registerUser: async (parent, { input }) => {
      const { username, email, password } = input;

      const existingUser = await User.findOne({ $or: [{ username }, { email }] });
      if (existingUser) {
        throw new Error('Username or email already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
      await newUser.save();

      const token = generateToken(newUser);

      return { token, user: newUser };
    },

    // Maps to: `loginUser(input: LoginInput!): AuthPayload!`
    loginUser: async (parent, { input }) => {
      const { email, password } = input;

      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      const token = generateToken(user);

      return { token, user: user };
    },

    // Maps to: `createMovie(input: CreateMovieInput!): Movie!`
    createMovie: async (parent, { input }) => {
      const newMovie = new Movie(input);
      await newMovie.save();
      return newMovie;
    },

    // Maps to: `createReview(input: CreateReviewInput!): Review!`
    createReview: async (parent, { input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required to create a review');
      }

      const { movieId, rating, comment } = input;

      const movie = await Movie.findById(movieId);
      if (!movie) {
        throw new Error('Movie not found');
      }

      const existingReview = await Review.findOne({ movie: movieId, user: context.user.id });
      if (existingReview) {
        throw new Error('You have already reviewed this movie');
      }

      const newReview = new Review({
        movie: movieId,
        user: context.user.id,
        rating,
        comment,
      });
      await newReview.save();
      return newReview;
    },

    // Maps to: `createArticle(input: CreateArticleInput!): Article!`
    createArticle: async (parent, { input }, context) => {
      if (!context.user) {
        throw new Error('Authentication required to create an article');
      }

      const { title, content } = input;

      const existingArticle = await Article.findOne({ title });
      if (existingArticle) {
        throw new Error('An article with this title already exists');
      }

      const newArticle = new Article({
        title,
        content,
        author: context.user.id,
      });
      await newArticle.save();
      return newArticle;
    },
  },
  
};

export default resolvers;
