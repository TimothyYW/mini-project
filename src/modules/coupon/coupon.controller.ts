import { Request, Response } from "express";
import { CouponService } from "./coupon.service";

export class CouponController {
  couponService: CouponService;

  constructor() {
    this.couponService = new CouponService();
  }

  // // GET /coupons (admin / user coupons)
  // getCoupons = async (req: Request, res: Response) => {
  //   const result = await this.couponService.getCoupons();
  //   return res.status(200).send(result);
  // };

  // GET /coupons/:id
  // getCoupon = async (req: Request, res: Response) => {
  //   const id = Number(req.params.id);
  //   const result = await this.couponService.getCoupon(id);
  //   return res.status(200).send(result);
  // };

  // POST /coupons (system creates coupon, e.g. referral reward)
  createCoupon = async (req: Request, res: Response) => {
    const user = res.locals.user;
    const result = await this.couponService.createCoupon(req.body, user);
    return res.status(201).send(result);
  };

  // POST /coupons/apply (apply coupon during checkout)
  // applyCoupon = async (req: Request, res: Response) => {
  //   const result = await this.couponService.applyCoupon(req.body);
  //   return res.status(200).send(result);
  // };

  // PATCH /coupons/:id/use
  // markCouponUsed = async (req: Request, res: Response) => {
  //   const id = Number(req.params.id);
  //   const result = await this.couponService.markCouponUsed(id);
  //   return res.status(200).send(result);
  // };

  // // PATCH /coupons/:id/restore (rollback on rejected transaction)
  // restoreCoupon = async (req: Request, res: Response) => {
  //   const id = Number(req.params.id);
  //   const result = await this.couponService.restoreCoupon(id);
  //   return res.status(200).send(result);
  // };
}
