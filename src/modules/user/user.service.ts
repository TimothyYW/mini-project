import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateNewUserDTO } from "./dto/create-new-user.dto";
import { randomString } from "../../utils/random-string";

export class UserService {
  prisma: PrismaService;
  cloudinaryService: CloudinaryService;

  constructor() {
    this.prisma = new PrismaService();
    this.cloudinaryService = new CloudinaryService();
  }

  createUser = async (data: CreateNewUserDTO) => {
    const newUser = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: "CUSTOMER",
        referredById: data.referredById,
        referralCode: randomString(8),
      }
    })
    return newUser;
  }
}
