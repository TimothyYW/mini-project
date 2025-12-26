import { Request, Response } from "express";
import { EventService } from "./event.service";

export class EventController {
eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }
    // POST /events
  createEvent = async (req: Request, res: Response) => {
    const user = res.locals.user;
    const result = await this.eventService.createEvent(req.body, user);
    return res.status(201).send(result);
  };

}
