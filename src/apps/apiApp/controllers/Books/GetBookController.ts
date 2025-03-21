import { BookFinder } from '../../../../Contexts/apiApp/Books/application';
import { BookPrimitives } from '../../../../Contexts/apiApp/Books/domain/interfaces';
import { RequestOptions } from '../../shared/interfaces';
import { createGetController } from '../shared/controllerFactoryFunctions';

export const createGetBookController = (service: BookFinder) =>
  createGetController<
    BookFinder,
    Partial<RequestOptions>,
    Partial<BookPrimitives>
  >(service);
