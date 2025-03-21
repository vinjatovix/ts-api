import { BookRemover } from '../../../../Contexts/apiApp/Books/application';
import { createDeleteController } from '../shared/controllerFactoryFunctions';

export const createDeleteBookController = (service: BookRemover) =>
  createDeleteController<BookRemover>(service);
