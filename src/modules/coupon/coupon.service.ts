import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { ApplyCouponDto } from "./dto/apply-coupon.dto";
import { PayloadDTO } from "../auth/dto/payload.dto";

export class CouponService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  // GET all coupons
  getCoupons = async () => {
    const coupons = await this.prisma.coupon.findMany();
    return coupons;
  };

  // GET coupon by id
  getCoupon = async (id: string) => {
    const coupon = await this.prisma.coupon.findFirst({
      where: { id },
    });

    if (!coupon) throw new ApiError("Coupon not found", 404);

    return coupon;
  };

  // CREATE coupon (system / referral reward)
  createCoupon = async (body: CreateCouponDto, user: PayloadDTO) => {
    await this.prisma.coupon.create({
      data: {
        userId: user.id,
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        discountValue: body.discount,
        expiresAt: new Date(body.expiresAt),
      },
    });

    return { message: "Create coupon success" };
  };

  
}
