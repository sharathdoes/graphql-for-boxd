import User from "../models/user.js";
import Movie from "../models/movies.js";
import Review from "../models/review.js";
import Article from "../models/article.js";

const resolvers = {
  Query: {
    getUser: (_, { id }) => User.findById(id),
    getMovie: (_, { id }) => Movie.findById(id).populate('reviews'),
    getAllMovies: () => Movie.find(),
    getReview: (_, { id }) => Review.findById(id),
    getAllArticles: () => Article.find()
  },

  Mutation: {
    register: async (_, { username, email, password }) => {
      const user = new User({ username, email, password });
      await user.save();
      return user;
    },

    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user || user.password !== password) {
        throw new Error("Invalid credentials");
      }
      // TEMP login logic — normally you'd sign JWT here
      return "TEMP_TOKEN";
    },

    addMovie: async (_, movieData) => {
      const movie = new Movie(movieData);
      await movie.save();
      return movie;
    },

    addReview: async (_, { movieId, userId, rating, reviewText }) => {
      const review = new Review({ movie: movieId, user: userId, rating, reviewText });
      await review.save();

      await Movie.findByIdAndUpdate(movieId, { $push: { reviews: review._id } });
      return review;
    },

    addComment: async (_, { reviewId, userId, comment }) => {
      const review = await Review.findById(reviewId);
      review.comments.push({ user: userId, comment });
      await review.save();
      return review.comments[review.comments.length - 1];
    },

    addArticle: async (_, { title, content, tags, authorId }) => {
      const article = new Article({ title, content, tags, author: authorId });
      await article.save();
      return article;
    }
  }
};

export default resolvers;
