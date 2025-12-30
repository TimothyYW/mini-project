import { Request, Response } from "express";
import { VoucherService } from "./voucher.service";

export class VoucherController {
  voucherService: VoucherService;

  constructor() {
    this.voucherService = new VoucherService();
  }
    // POST /Vouchers
  createVoucher = async (req: Request, res: Response) => {
    const event = res.locals.event;
    const result = await this.voucherService.createVoucher(req.body, event.id);
    return res.status(201).send(result);
  };
  // Get /vouchers/:id
  getVoucherById = async (req: Request, res: Response) => {
    const voucherId = parseInt(req.params.voucherId);
    const event = res.locals.event;
    const result = await this.voucherService.getVoucherById(voucherId, event.id);
    if(!result){
        return res.status(404).send({message: "Voucher not found"});
    }
    return res.status(200).send(result);
  };
  // Get /vouchers
  getAllVouchers = async (req: Request, res: Response) => {
    const event = res.locals.event;
    const result = await this.voucherService.getAllVouchers(event.id);
    return res.status(200).send(result);
  };

  // PUT /vouchers/:id
  updateVoucher = async (req: Request, res: Response) => {
    const voucherId = parseInt(req.params.voucherId);
    const result = await this.voucherService.updateVoucher(voucherId, req.body);
    return res.status(200).send(result);
  };

  // DELETE /vouchers/:id
  deleteVoucher = async (req: Request, res: Response) => {
    const voucherId = parseInt(req.params.voucherId);
    await this.voucherService.deleteVoucher(voucherId);
    return res.status(204).send();
  };
}
