import { Router } from "express";
import { CouponController } from "./coupon.controller";
import { validateBody } from "../../middlewares/validation.middleware";
import { CreateCouponDto } from "./dto/create-coupon.dto";
import { ApplyCouponDto } from "./dto/apply-coupon.dto";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { JWT_SECRET } from "../../config/env";
import { validateOrganizer } from "../../middlewares/permission.middleware";

export class CouponRouter {
  router: Router;
  couponController: CouponController;
  jwtMiddleware: JwtMiddleware;

  constructor() {
    this.router = Router();
    this.couponController = new CouponController();
    this.jwtMiddleware = new JwtMiddleware();
    this.initRoutes();
  }

  private initRoutes = () => {
    // GET all coupons
    // this.router.get("/", this.couponController.getCoupons);

    // // GET coupon by id
    // this.router.get("/:id", this.couponController.getCoupon);

    // CREATE coupon (system / referral reward)
    this.router.post(
      "/",
      validateBody(CreateCouponDto),
      this.jwtMiddleware.verifyToken(JWT_SECRET!),
      validateOrganizer(),
      this.couponController.createCoupon
    );

    // APPLY coupon (checkout)
    // this.router.post(
    //   "/apply",
    //   validateBody(ApplyCouponDto),
    //   this.couponController.applyCoupon
    // );

    // // MARK coupon as used
    // this.router.patch("/:id/use", this.couponController.markCouponUsed);

    // RESTORE coupon (rollback on reject)
    //this.router.patch("/:id/restore", this.couponController.restoreCoupon);
  };

  getRouter = () => {
    return this.router;
  };
}
