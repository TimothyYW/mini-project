import "reflect-metadata";
import cors from "cors";
import express, { Express } from "express";
import { PORT } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import { AuthRouter } from "./modules/auth/auth.router";
import { EventRouter } from "./modules/event/event.router";
import { VoucherRouter } from "./modules/voucher/voucher.router";

export class App {
  app: Express;

  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private configure() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private routes() {
    const authRouter = new AuthRouter();
    const eventRouter = new EventRouter();
    const voucherRouter = new VoucherRouter();


    this.app.use("/auth", authRouter.getRouter());
    this.app.use("/events", eventRouter.getRouter());
    this.app.use("/events/:id/voucher", voucherRouter.getRouter());
    }

  private handleError() {
    this.app.use(errorMiddleware);
  }

  public start() {
    this.app.listen(PORT, () => {
      console.log(`Server running on port : ${PORT}`);
    });
  }
}
