import User from '../models/user.js';
import Log from '../models/log.js';
import MoviesModel from '../models/movies.js';
import SeriesModel from '../models/series.js';

const resolvers = {
  Query: {
    myActivity: async (_, { userId }) => {
      const recentLogs = await Log.find({ userId }).sort({ createdAt: -1 }).limit(10);
      const popularReviews = await Log.find({ userId }).sort({ likes: -1 }).limit(10);
      const totalMovies = await Log.countDocuments({ userId, sourceModel: "Movie" });
      const totalSeries = await Log.countDocuments({ userId, sourceModel: "Series" });

      const lastYear = new Date();
      lastYear.setFullYear(lastYear.getFullYear() - 1);

      const moviesThisYear = await Log.countDocuments({
        userId,
        sourceModel: "Movie",
        createdAt: { $gte: lastYear }
      });

      const ratingsGraph = await Promise.all(
        [0, 1, 2, 3, 4, 5].map(rating => Log.countDocuments({ userId, rating }))
      );

      const allLogs = await Log.find({ userId });
      const tagsUsed = allLogs.flatMap(log => log.tags).filter(Boolean);

      return { recentLogs, popularReviews, totalMovies, totalSeries, moviesThisYear, ratingsGraph, tagsUsed };
    },

    recommendations: async (_, { userId }) => {
      const topMovies = await Log.find({ userId, sourceModel: "Movie" }).sort({ rating: -1 }).limit(5);
      const topSeries = await Log.find({ userId, sourceModel: "Series" }).sort({ rating: -1 }).limit(5);

      const moviesIds = topSeries.map(log => log.logSourceId);
      const seriesIds = topMovies.map(log => log.logSourceId);

      const moviesILike = await MoviesModel.find({ _id: { $in: moviesIds } });
      const seriesILike = await SeriesModel.find({ _id: { $in: seriesIds } });

      const favGenreMovies = moviesILike.flatMap(movie => movie.genre).filter(Boolean);
      const favGenreSeries = seriesILike.flatMap(series => series.genre).filter(Boolean);

      const reccMovies = await MoviesModel.find({ genre: { $in: favGenreMovies }, _id: { $nin: moviesIds } });
      const reccSeries = await SeriesModel.find({ genre: { $in: favGenreSeries }, _id: { $nin: seriesIds } });

      return { reccMovies, reccSeries };
    },

    myLogs: async (_, { userId }) => {
      return await Log.find({ userId });
    }
  },

  Mutation: {
    addLog: async (_, { input }) => {
      const log = new Log(input);
      await log.save();

      if (input.sourceModel === 'Movie') {
        const movie = await MoviesModel.findById(input.logSourceId);
        movie.logs.push(log._id);
        await movie.save();
      } else if (input.sourceModel === 'Series') {
        const series = await SeriesModel.findById(input.logSourceId);
        series.logs.push(log._id);
        await series.save();
      }
      return log;
    },

    deleteLog: async (_, { userId, logId }) => {
      const log = await Log.findById(logId);
      if (!log || log.userId.toString() !== userId.toString()) {
        throw new Error("Permission denied.");
      }

      if (log.sourceModel === 'Movie') {
        const movie = await MoviesModel.findById(log.logSourceId);
        movie.logs = movie.logs.filter(id => id.toString() !== logId);
        await movie.save();
      } else if (log.sourceModel === 'Series') {
        const series = await SeriesModel.findById(log.logSourceId);
        series.logs = series.logs.filter(id => id.toString() !== logId);
        await series.save();
      }

      await Log.findByIdAndDelete(logId);
      return "Deleted successfully";
    }
  }
}

export default resolvers;
