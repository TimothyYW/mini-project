import { Router } from "express";
import { EventController } from "./event.controller";
import { validateBody } from "../../middlewares/validation.middleware";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";

export class EventRouter {
  router: Router;
  eventController: EventController;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.initRoutes();
  }

  private initRoutes = () => {
    // GET all events
    this.router.get("/", this.eventController.getEvents);

    // GET event by id
    this.router.get("/:id", this.eventController.getEvent);

    // CREATE event (organizer only)
    this.router.post(
      "/",
      validateBody(CreateEventDto),
      this.eventController.createEvent
    );

    // UPDATE event
    this.router.patch(
      "/:id",
      validateBody(UpdateEventDto),
      this.eventController.updateEvent
    );

    // DELETE event
    this.router.delete("/:id", this.eventController.deleteEvent);
  };

  getRouter = () => {
    return this.router;
  };
}
