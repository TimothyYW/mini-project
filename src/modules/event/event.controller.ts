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
  // Get /events/:id
  getEventById = async (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id);
    const result = await this.eventService.getEventById(eventId);
    return res.status(200).send(result);
  };
  // Get /events
  getAllEvents = async (req: Request, res: Response) => {
    const result = await this.eventService.getAllEvents();
    return res.status(200).send(result);
  };

  // PUT /events/:id
  updateEvent = async (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id);
    const result = await this.eventService.updateEvent(eventId, req.body);
    return res.status(200).send(result);
  };

  // DELETE /events/:id
  deleteEvent = async (req: Request, res: Response) => {
    const eventId = parseInt(req.params.id);
    await this.eventService.deleteEvent(eventId);
    return res.status(204).send();
  };
}
