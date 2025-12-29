import { NextFunction, Request, Response } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { ApiError } from "../utils/api-error";

export const validateIsOrganizer = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (user.role !== "ORGANIZER") {
      throw new ApiError("Access denied: Organizer only", 403);
    }
    next();
  };
};

export const validateOrganizer = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (user.role !== "ORGANIZER") {
      throw new ApiError("Access denied: Organizer only", 403);
    }

    const event = res.locals.event;
    if (event.organizerId !== user.id) {
      throw new ApiError("Access denied: Not the organizer of this event", 403);
    }

    next();
  };
};