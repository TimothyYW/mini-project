import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {
  paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }
    // POST /Payments
  createPayment = async (req: Request, res: Response) => {
    const event = res.locals.event;
    const coupon = res.locals.coupon;
    const voucher = res.locals.voucher;
    const user = res.locals.user;
    const result = await this.paymentService.createPayment(req.body, event, user, voucher, coupon);
    return res.status(201).send(result);
  };
  // Get /payments/:id
  getPaymentById = async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId;
    const event = res.locals.event;
    const result = await this.paymentService.getPaymentById(paymentId, event.id);
    if(!result){
        return res.status(404).send({message: "Payment not found"});
    }
    return res.status(200).send(result);
  };
  // Get /payments
  getAllPayments = async (req: Request, res: Response) => {
    const event = res.locals.event;
    const result = await this.paymentService.getAllPayments(event.id);
    return res.status(200).send(result);
  };

  // PATCH /payments/:id/approve
  setPaymentApproval = async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId;
    const event = res.locals.event;
    const result = await this.paymentService.setPaymentApproval(req.body, paymentId, event.id);
    return res.status(200).send(result);
  };

 // POST /payments/:id/submit-proof
  submitPaymentProof = async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId;
    const event = res.locals.event;
    const result = await this.paymentService.submitPaymentProof(req.body,paymentId, event.id);

    return res.status(200).send(result);
  };

}
