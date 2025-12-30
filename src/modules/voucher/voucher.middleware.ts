import { NextFunction, Request, Response } from "express";
import { VoucherService } from "./voucher.service";
import { ApiError } from "../../utils/api-error";


export const validateVoucher = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const voucher = parseInt(req.params.voucherId, 10);
        if (isNaN(voucher)) {
            throw new ApiError("Invalid voucher ID", 400);
        }

        const user = res.locals.user;
        const event = res.locals.event;

        const voucherService = new VoucherService();
        const voucherExists = await voucherService.getVoucherById(voucher, event.id);

        if (!voucherExists) {
            throw new ApiError("Voucher not found", 404);
        }

        if (event.organizerId !== user.id) {
            throw new ApiError("You do not have permission to access this voucher", 403);
        }

        if(voucherExists.eventId !== event.id) {
            throw new ApiError("Voucher does not belong to this event", 400);
        }

        res.locals.voucher = voucherExists;
        next();
    };
};
