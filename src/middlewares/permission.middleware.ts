import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ApiError } from "../utils/api-error";

export const validateOrganizer = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (user.role !== "ORGANIZER") {
      throw new ApiError("Access denied: Organizer only", 403);
    }
    next();
  };
};
