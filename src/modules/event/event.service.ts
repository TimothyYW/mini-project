import { PrismaService } from "../prisma/prisma.service";
import { createEventDto } from "./dto/create-event.dto";
import { PayloadDTO } from "../auth/dto/payload.dto";

export class EventService {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }
  // ================= Create Event =================
  createEvent = async (data: createEventDto, user: PayloadDTO) => {
    const event = await this.prisma.event.create({
      data: {
        organizerId: user.id,
        title: data.title,
        description: data.description,
        price: data.price,
        totalSeats: data.totalSeats,
        date: data.eventDate,
      },
    });
    return event;
  };
  // ================= Get Event by Id =================
  getEventById = async (eventId: number) => {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    return event;
  };
  // ================= Get All Events =================
  getAllEvents = async () => {
    const events = await this.prisma.event.findMany();
    return events;
  };

  // ================= Update Event =================
  updateEvent = async (eventId: number, data: createEventDto) => {
    const event = await this.prisma.event.update({
      where: { id: eventId },
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        totalSeats: data.totalSeats,
        date: data.eventDate,
      },
    });
    return event;
  };

  // ================= Delete event=================
  deleteEvent = async (eventId: number) => {
    await this.prisma.event.delete({
    where: { id: eventId },
    });
  };
}
