import httpStatus from 'http-status';
import { BasePostPutBookController } from './BasePostPutBookController';

export class PutBookController extends BasePostPutBookController {
  protected status() {
    return httpStatus.OK;
  }
}
