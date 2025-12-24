import { Request, Response } from "express";
import { EventService } from "./event.service";

export class EventController {
  eventService: EventService;

  constructor() {
    this.eventService = new EventService();
  }

  // GET /events
  getEvents = async (req: Request, res: Response) => {
    const result = await this.eventService.getEvents(req.query);
    return res.status(200).send(result);
  };

  // GET /events/:id
  getEvent = async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await this.eventService.getEvent(id);
    return res.status(200).send(result);
  };

  // POST /events
  createEvent = async (req: Request, res: Response) => {
    const organizerId = res.locals.user.id; // from JWT
    const result = await this.eventService.createEvent(
      req.body,
      organizerId
    );
    return res.status(201).send(result);
  };

  // PATCH /events/:id
  updateEvent = async (req: Request, res: Response) => {
    const id = req.params.id;
    const organizerId = res.locals.user.id; // from JWT
    const result = await this.eventService.updateEvent(
      id,
      req.body,
      organizerId
    );
    return res.status(200).send(result);
  };

  // DELETE /events/:id
  deleteEvent = async (req: Request, res: Response) => {
    const id = req.params.id;
    const organizerId = res.locals.user.id;
    const result = await this.eventService.deleteEvent(id, organizerId);
    return res.status(200).send(result);
  };
}
