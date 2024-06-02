/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose, { Query } from "mongoose";
import { Document } from "mongoose";
import Tour from "./tourModel";

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can;t be empty"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Tour",
        required: [true, "Review must belong to a tour"],
      },
    ],
    user: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "Review must belong to a user"],
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  //   (this as Query<any, Document<any>>)
  //     .populate({
  //       path: "tour",
  //       select: "name",
  //     })
  //     .populate({
  //       path: "user",
  //       select: "name photo",
  //     });

  (this as Query<any, Document<any>>).populate({
    path: "user",
    select: "name photo",
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  (this as any).r = await (this as any).findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await (this as any).r.constructor.calcAverageRatings((this as any).r.tour);
});

reviewSchema.index(
  { tour: 1, user: 1 },
  {
    unique: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

reviewSchema.post("save", function () {
  (Review as any).calcAverageRatings(this.tour);
});

export default Review;
