import { Request, Response } from "express";
import { UserService } from "./user.service";
import { ApiError } from "../../utils/api-error";

export class UserController {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createNewUser = async (req: Request, res: Response) => {
    const result = await this.userService.createUser(req.body);
    return res.status(200).send(result);
  };
}
