import { NextFunction, Request, Response } from "express";
import { VoucherService } from "../voucher/voucher.service";
import { PaymentService } from "./payment.service";
import { PrismaService } from "../prisma/prisma.service";
import { ApiError } from "../../utils/api-error";
import { Event, User, Payment } from "@prisma/client";
import { validate } from "class-validator";


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

export const validateCustomerProofUpload = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const payment = res.locals.payment as Payment;
        const user = res.locals.user as User;
        if(payment.userId !== user.id){
            throw new ApiError("You are not authorized to upload proof for this payment", 403);
        }
        next();
    };
}

export const validatePaymentId = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const paymentService = new PaymentService();
        const paymentId = req.params.paymentId;

        const event = res.locals.event as Event;
        const payment = await paymentService.getPaymentById(paymentId, event.id);
        if(!payment || payment === null){
            throw new ApiError("Payment id is not found", 404);
        }
        res.locals.payment = payment;
        next();
    };
};
export const validatePaymentReadOnly = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const paymentService = new PaymentService();

        const paymentId = req.params.paymentId

        const event = res.locals.event as Event;
        const user = res.locals.user as User;
        const payment = await paymentService.getPaymentById(paymentId, event.id);

        if(!payment || payment === null){
            throw new ApiError("Payment id is not found", 404);
        }
        if(user.id === payment.userId || user.id === event.organizerId){
            res.locals.payment = payment;
            next();
            return;
        }
        if(user.id == payment.userId){
            res.locals.payment = payment;
            next();
            return;
        }
        throw new ApiError("You do not have access to this payment", 403);
    ;
    }
};
