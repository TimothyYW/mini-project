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
				availableSeats: data.totalSeats,
				totalSeats: data.totalSeats,
				date: data.eventDate,
			},
		
		});
		return event;
	}

  // =================  =================
}
