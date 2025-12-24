import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { CreateEventDto } from "./dto/create-event.dto";
import { UpdateEventDto } from "./dto/update-event.dto";

export class EventService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  // GET all events (with optional search)
  getEvents = async (query: any) => {
    const { search } = query;

    const events = await this.prisma.event.findMany({
      where: search
        ? {
            title: {
              contains: search,
              mode: "insensitive",
            },
          }
        : {},
      orderBy: { eventDate: "asc" },
    });

    return events;
  };

  // GET event by id
  getEvent = async (id: string) => {
    const event = await this.prisma.event.findFirst({
      where: { id },
    });

    if (!event) throw new ApiError("Event not found", 404);

    return event;
  };

  // CREATE event (organizer only)
  createEvent = async (body: CreateEventDto, organizerId: number) => {
    await this.prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        totalSeats: body.totalSeats,
        availableSeats: body.totalSeats,
        eventDate: new Date(body.eventDate),
        organizerId,
      },
    });

    return { message: "Create event success" };
  };

  // UPDATE event (organizer ownership check)
  updateEvent = async (
    id: string,
    body: UpdateEventDto,
    organizerId: number
  ) => {
    const event = await this.prisma.event.findFirst({
      where: { id },
    });

    if (!event) throw new ApiError("Event not found", 404);

    if (event.organizerId !== organizerId) {
      throw new ApiError("Forbidden access", 403);
    }

    // prevent reducing total seats below sold tickets
    if (body.totalSeats !== undefined) {
      const soldSeats = event.totalSeats - event.availableSeats;
      if (body.totalSeats < soldSeats) {
        throw new ApiError(
          "Total seats cannot be less than sold tickets",
          400
        );
      }
    }

    const newAvailableSeats =
      body.totalSeats !== undefined
        ? body.totalSeats - (event.totalSeats - event.availableSeats)
        : event.availableSeats;

    await this.prisma.event.update({
      where: { id },
      data: {
        ...body,
        availableSeats: newAvailableSeats,
        eventDate: body.eventDate
          ? new Date(body.eventDate)
          : undefined,
      },
    });

    return { message: "Update event success" };
  };

  // DELETE event (organizer only)
  deleteEvent = async (id: string, organizerId: number) => {
    const event = await this.prisma.event.findFirst({
      where: { id },
    });

    if (!event) throw new ApiError("Event not found", 404);

    if (event.organizerId !== organizerId) {
      throw new ApiError("Forbidden access", 403);
    }

    await this.prisma.event.delete({
      where: { id },
    });

    return { message: "Delete event success" };
  };
}
