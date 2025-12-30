import { Router } from "express";
import { VoucherController } from "./voucher.controller";
import { validateBody } from "../../middlewares/validation.middleware";
import { CreateVoucherDto } from "./dto/create-voucher.dto";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET } from "../../config/env";
import { validateEvent } from "../../middlewares/event.middleware";
import { validateIsOrganizer } from "../../middlewares/permission.middleware";
import { validateVoucher } from "./voucher.middleware";
import { validateOrganizer } from "../../middlewares/permission.middleware";
import { validate } from "class-validator";

export class VoucherRouter {
  router: Router;
  VoucherController: VoucherController;
  jwtMiddleware: JwtMiddleware;

  constructor() {
    this.router = Router();
    this.VoucherController = new VoucherController();
    this.jwtMiddleware = new JwtMiddleware();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.use(validateEvent());


    this.router.post(
      "/",
      validateBody(CreateVoucherDto),
      this.jwtMiddleware.verifyToken(JWT_SECRET!),
      validateIsOrganizer(),
      this.VoucherController.createVoucher
    );
    this.router.get(
      "/:voucherId",
      this.VoucherController.getVoucherById
    );
    this.router.get(
      "/",
      validateIsOrganizer(),
      validateOrganizer(),
      this.VoucherController.getAllVouchers
    );

    this.router.put(
      "/:voucherId",
      validateBody(CreateVoucherDto),
      this.jwtMiddleware.verifyToken(JWT_SECRET!),
      validateIsOrganizer(),
      validateOrganizer(),
      validateVoucher(),
      this.VoucherController.updateVoucher
    );

    this.router.delete(
      "/:id",
      this.jwtMiddleware.verifyToken(JWT_SECRET!),
      validateIsOrganizer(),
      validateOrganizer(),
      validateVoucher(),
      this.VoucherController.deleteVoucher
    );
  };

  getRouter = () => {
    return this.router;
  };
}
