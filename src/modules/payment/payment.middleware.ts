import { NextFunction, Request, Response } from "express";
import { VoucherService } from "../voucher/voucher.service";
import { PrismaService } from "../prisma/prisma.service";
import { ApiError } from "../../utils/api-error";


export const validateVoucher = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const voucherCode = req.body.voucherCode;

        if(!voucherCode || voucherCode === undefined){
            next();
            return;
        }

        const voucherService = new VoucherService();
        const voucher = await voucherService.getVoucherCode(voucherCode);

        if(!voucher || voucher === null){
            throw new ApiError("Voucher code not found", 404);
        }

        const event = res.locals.event;

        if (event.id !== voucher.eventId) {
            throw new ApiError("Voucher does not belong to this event", 400);
        }
        
        res.locals.voucher = voucher;
        next();
    };
};

export const validateCoupon = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const couponCode = req.body.couponCode;
        if(!couponCode || couponCode === undefined){
            next();
            return;
        }

        const prisma = new PrismaService();
        const user = res.locals.user;
        const coupon = await prisma.coupon.findUnique({
            where: { code: couponCode, userId: user.id },
        });

        if(!coupon || coupon === null){
            throw new ApiError("Coupon code not found", 404);
        }

        if(coupon.expiresAt < new Date()){
            throw new ApiError("Coupon code has expired", 400);
        }

        if(coupon.isUsed){
            throw new ApiError("Coupon code has already been used", 400);
        }
        res.locals.coupon = coupon;
        next();
    };
};
