import { Review } from "../models/reviewModel";
import Tour from "../models/tourModel";
import User from "../models/userModel";

export interface TourType {
  id: number;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: string;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  price?: number;
  summary?: string;
  description?: string;
  imageCover?: string;
  images?: string[];
  startDates?: string[];
}

export type ModelType = typeof Tour | typeof User | typeof Review;
