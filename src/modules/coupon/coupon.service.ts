import { ApiError } from "../../utils/api-error";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { ApplyCouponDto } from "./dto/apply-coupon.dto";

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
  getCoupon = async (id: number) => {
    const coupon = await this.prisma.coupon.findFirst({
      where: { id },
    });

    if (!coupon) throw new ApiError("Coupon not found", 404);

    return coupon;
  };

  // CREATE coupon (system / referral reward)
  createCoupon = async (body: CreateCouponDto) => {
    await this.prisma.coupon.create({
      data: {
        userId: body.userId,
        code: body.code,
        discount: body.discount,
        expiresAt: body.expiresAt,
      },
    });

    return { message: "Create coupon success" };
  };

  // APPLY coupon (during checkout)
  applyCoupon = async (body: ApplyCouponDto) => {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: body.code },
    });

    if (!coupon) {
      throw new ApiError("Invalid coupon", 400);
    }

    if (coupon.used) {
      throw new ApiError("Coupon already used", 400);
    }

    if (coupon.expiresAt < new Date()) {
      throw new ApiError("Coupon expired", 400);
    }

    return coupon;
  };

  // MARK coupon as used (after payment)
  markCouponUsed = async (id: number) => {
    const coupon = await this.prisma.coupon.findFirst({
      where: { id },
    });

    if (!coupon) throw new ApiError("Coupon not found", 404);

    if (coupon.used) {
      throw new ApiError("Coupon already used", 400);
    }

    await this.prisma.coupon.update({
      where: { id },
      data: { used: true },
    });

    return { message: "Coupon marked as used" };
  };

  // RESTORE coupon (rollback on rejected transaction)
  restoreCoupon = async (id: number) => {
    const coupon = await this.prisma.coupon.findFirst({
      where: { id },
    });

    if (!coupon) throw new ApiError("Coupon not found", 404);

    await this.prisma.coupon.update({
      where: { id },
      data: { used: false },
    });

    return { message: "Coupon restored successfully" };
  };
}
