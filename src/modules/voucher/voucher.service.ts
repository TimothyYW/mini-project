import { PrismaService } from "../prisma/prisma.service";
import { CreateVoucherDto } from "./dto/create-voucher.dto";
import { PayloadDTO } from "../auth/dto/payload.dto";

export class VoucherService {
  private prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }
  // ================= Create Voucher =================
  createVoucher = async (data: CreateVoucherDto, eventId: number) => {
    const voucher = await this.prisma.voucher.create({
        data: {
            eventId:eventId,
            code: data.code,
            discount: data.discount,
            expiresAt: data.expiresAt,
        }
    });
    return voucher;
  }
// ================= Get Voucher by Id =================
  getVoucherById = async (voucherId: number, eventId: number) => {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id: voucherId, eventId: eventId},
    });
    return voucher;
  };

  // ================= Get All Vouchers =================
  getAllVouchers = async (eventId: number) => {
    const vouchers = await this.prisma.voucher.findMany({
        where: {eventId: eventId },
    });
    return vouchers;
  };

    // ================= Update Voucher =================
  updateVoucher = async (voucherId: number, data: CreateVoucherDto) => {
        const voucher = await this.prisma.voucher.update({
            where: { id: voucherId },
            data: {
                code: data.code,
                discount: data.discount,
                expiresAt: data.expiresAt,
            }
        });
        return voucher;
    }
    // ================= Delete Voucher =================
    deleteVoucher = async (voucherId: number) => {
        await this.prisma.voucher.delete({
            where: { id: voucherId },
        });
    };
}
