import { HttpException } from "./root";

export class UnProcessableEntity extends HttpException {
  constructor(status: number, message: string, errorCode: number, errors: any) {
    super(status, message, errorCode, errors);
  }
}
