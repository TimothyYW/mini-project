import { NextFunction, Request, Response } from "express";
import { EventService } from "../modules/event/event.service";
import { ApiError } from "../utils/api-error";

export const validateEvent = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const event = parseInt(req.params.id, 10);
        if (isNaN(event)) {
            throw new ApiError("Invalid event ID", 400);
        }
        const eventService = new EventService();
        const eventExists = await eventService.getEventById(event);
        if (!eventExists) {
            throw new ApiError("Event not found", 404);
        }

        res.locals.event = eventExists;
        next();
    };
};