import { Router } from "express";
import { UserController } from "./user.controller";
import { UploaderMiddleware } from "../../middlewares/uploader.middleware";
import { validateBody } from "../../middlewares/validation.middleware";
import { CreateNewUserDTO } from "./dto/create-new-user.dto";

export class UserRouter {
  router: Router;
  UserController: UserController;

  constructor() {
    this.router = Router();
    this.UserController = new UserController();
    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.post(
      "/",
      validateBody(CreateNewUserDTO),
      this.UserController.createNewUser
    );
  };

  getRouter = () => {
    return this.router;
  };
}
