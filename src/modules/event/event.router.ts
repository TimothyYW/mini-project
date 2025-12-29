import { Router } from "express";
import { EventController } from "./event.controller";
import { validateBody } from "../../middlewares/validation.middleware";
import { createEventDto } from "./dto/create-event.dto";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET } from "../../config/env";
import { validateIsOrganizer } from "../../middlewares/permission.middleware";
import { validateEvent } from "../../middlewares/event.middleware";
import { validateOrganizer } from "../../middlewares/permission.middleware";

export class EventRouter {
  router: Router;
  EventController: EventController;
  jwtMiddleware: JwtMiddleware;

  constructor() {
    this.router = Router();
    this.EventController = new EventController();
    this.jwtMiddleware = new JwtMiddleware();
    this.initRoutes();
  }

  private initRoutes = () => {
    
    this.router.post(
      "/",
      validateBody(createEventDto),
      this.jwtMiddleware.verifyToken(JWT_SECRET!),
      validateIsOrganizer(),
      this.EventController.createEvent
    );
    this.router.get(
      "/:id",
      this.EventController.getEventById
    );
    this.router.get(
      "/",
      this.EventController.getAllEvents
    );

    this.router.put(
      "/:id",
      validateBody(createEventDto),
      this.jwtMiddleware.verifyToken(JWT_SECRET!),
      validateEvent(),
      validateIsOrganizer(),
      validateOrganizer(),
      this.EventController.updateEvent
    );

    this.router.delete(
      "/:id",
      this.jwtMiddleware.verifyToken(JWT_SECRET!),
      validateEvent(),
      validateIsOrganizer(),
      validateOrganizer(),
      this.EventController.deleteEvent
    );
  };

  getRouter = () => {
    return this.router;
  };
}
