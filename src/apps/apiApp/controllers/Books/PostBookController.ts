import httpStatus from 'http-status';
import { BasePostPutBookController } from './BasePostPutBookController';

export class PostBookController extends BasePostPutBookController {
  protected status() {
    return httpStatus.CREATED;
  }
}
