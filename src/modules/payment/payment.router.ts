import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { validateBody } from "../../middlewares/validation.middleware";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET } from "../../config/env";
import { validateEvent } from "../../middlewares/event.middleware";
import { validateIsCustomer, validateIsOrganizer } from "../../middlewares/permission.middleware";
//import { validateVoucher } from "./voucher.middleware";
import { validateOrganizer } from "../../middlewares/permission.middleware";
import { validateVoucher, validateCoupon } from "./payment.middleware";


export class PaymentRouter {
  router: Router;
  PaymentController: PaymentController;
  jwtMiddleware: JwtMiddleware;

  constructor() {
    this.router = Router({ mergeParams: true });
    this.PaymentController = new PaymentController();
    this.jwtMiddleware = new JwtMiddleware();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.use(validateEvent());

    this.router.post(
      "/",
      validateBody(CreatePaymentDto),
      this.jwtMiddleware.verifyToken(JWT_SECRET!),
      validateIsCustomer(),
      validateVoucher(),
      validateCoupon(),
      this.PaymentController.createPayment
    );
    // this.router.get(
    //   "/:paymentId",
    //   this.jwtMiddleware.verifyToken(JWT_SECRET!),
    //   this.PaymentController.getAllPayments
    // );

    // this.router.get(
    //   "/",
    //   this.jwtMiddleware.verifyToken(JWT_SECRET!),
    //   this.PaymentController.getAllPayments
    // );

    // this.router.patch(
    //   "/:paymentId/approval",
    //   validateBody(CreatePaymentDto),
    //   this.jwtMiddleware.verifyToken(JWT_SECRET!),
    //   this.PaymentController.setPaymentApproval
    // );

    // this.router.post(
    //   "/:paymentId/proof",
    //   this.jwtMiddleware.verifyToken(JWT_SECRET!),
    //   this.PaymentController.submitPaymentProof
    // );
  };

  getRouter = () => {
    return this.router;
  };
}
