import { PrismaService } from "../prisma/prisma.service";
import { RegisterDTO } from "./dto/register.dto";
import { ApiError } from "../../utils/api-error";
import { hashPassword } from "../../utils/password";
import { randomString } from "../../utils/random-string";

export class AuthService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  register = async (data: RegisterDTO) => {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ApiError("Email already exists", 400);
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: hashedPassword,
        role: "CUSTOMER",
        referralCode: randomString(8),
      },
    });

    return newUser;
  };
}
