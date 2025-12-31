import { PrismaService } from "../prisma/prisma.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { ApprovedPaymentDto } from "./dto/approved-payment.dto";
import { Event, User, Voucher, Coupon } from "@prisma/client";

export class PaymentService {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  // ================= Create Payment =================
  createPayment = async (
    data: CreatePaymentDto,
    event: Event,
    user: User,
    voucher?: Voucher,
    coupon?: Coupon
  ) => {
    let result = null;
    await this.prisma.$transaction(async (tx) => {
      let totalPrice = event.price;
      let priceCut = 0;
      if (voucher !== undefined) {
        priceCut += event.price * voucher.discount;
      }
      if (coupon !== undefined) {
        priceCut += event.price * coupon.discountValue;
        await tx.coupon.update({
          where: { id: coupon.id },
          data: {
            isUsed: true,
          },
        });
      }
      totalPrice = totalPrice - priceCut;
      result = this.prisma.payment.create({
        data: {
          userId: user.id,
          eventId: event.id,
          quantity: data.quantity,
          totalPrice: totalPrice * data.quantity,
        },
      });
    });

    return result;
  };

  getAllPayments = async (eventId: number, userId: number) => {};

  getPaymentById = async (
    paymentId: number,
    eventId: number,
    userId: number
  ) => {};

  setPaymentApproval = async (
    data: ApprovedPaymentDto,
    paymentId: number,
    eventId: number,
    userId: number
  ) => {};

  submitPaymentProof = async (
    paymentId: number,
    eventId: number,
    proof: string,
    userId: number
  ) => {};
}
