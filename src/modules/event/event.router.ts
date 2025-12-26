import { Router } from "express";
import { EventController } from "./event.controller";
import { validateBody } from "../../middlewares/validation.middleware";
import { createEventDto } from "./dto/create-event.dto";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET } from "../../config/env";
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
      validateOrganizer(),
      this.EventController.createEvent
    );

  };

  getRouter = () => {
    return this.router;
  };
}
