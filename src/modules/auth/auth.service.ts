import { sign } from "jsonwebtoken";
import { addMonths } from "date-fns";
import { BASE_URL_FE } from "../../config/env";
import { ApiError } from "../../utils/api-error";
import { comparePassword, hashPassword } from "../../utils/password";
import { MailService } from "../mail/mail.service";
import { PrismaService } from "../prisma/prisma.service";
import { ForgotPasswordDTO } from "./dto/forgot-password.dto";
import { LoginDTO } from "./dto/login.dto";
import { RegisterDTO, Role } from "./dto/register.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";

export class AuthService {
  private prisma: PrismaService;
  private mailService: MailService;

  constructor() {
    this.prisma = new PrismaService();
    this.mailService = new MailService();
  }

  // ================= REGISTER =================
  register = async (body: RegisterDTO) => {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      throw new ApiError("Email already exists", 400);
    }

    const hashedPassword = await hashPassword(body.password);
    const referralCode = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: body.name,
          email: body.email,
          passwordHash: hashedPassword,
          role: body.role ?? Role.CUSTOMER,
          referralCode,
        },
      });

      // Referral logic
      if (body.referralCode) {
        const referrer = await tx.user.findUnique({
          where: { referralCode: body.referralCode },
        });

        if (referrer) {
          // Give points to referrer
          await tx.point.create({
            data: {
              userId: referrer.id,
              amount: 10000,
              expiresAt: addMonths(new Date(), 3),
            },
          });

          // Give coupon to new user
          await tx.coupon.create({
            data: {
              userId: user.id,
              discountValue: 10000,
              expiresAt: addMonths(new Date(), 3),
            },
          });
        }
      }
    });

    return { message: "Register success" };
  };

  // ================= LOGIN =================
  login = async (body: LoginDTO) => {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) throw new ApiError("Invalid credentials", 400);

    const isPasswordMatch = await comparePassword(
      body.password,
      user.passwordHash
    );

    if (!isPasswordMatch) throw new ApiError("Invalid credentials", 400);

    const payload = {
      id: user.id,
      role: user.role,
    };

    const accessToken = sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "2h",
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
    };
  };

  // ================= FORGOT PASSWORD =================
  forgotPassword = async (body: ForgotPasswordDTO) => {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) throw new ApiError("User not found", 404);

    const token = sign(
      { id: user.id },
      process.env.JWT_SECRET_RESET!,
      { expiresIn: "15m" }
    );

    await this.mailService.sendEmail(
      body.email,
      "Forgot Password",
      "forgot-password",
      {
        resetUrl: `${BASE_URL_FE}/reset-password/${token}`,
      }
    );

    return { message: "Reset password email sent" };
  };

  // ================= RESET PASSWORD =================
  resetPassword = async (body: ResetPasswordDTO, authUserId: string) => {
    const hashedPassword = await hashPassword(body.password);

    await this.prisma.user.update({
      where: { id: authUserId },
      data: { passwordHash: hashedPassword },
    });

    return { message: "Reset password success" };
  };
}
