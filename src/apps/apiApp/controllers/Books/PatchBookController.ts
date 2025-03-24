import { BookPatcher } from '../../../../Contexts/apiApp/Books/application';
import { BookPatcherRequest } from '../../../../Contexts/apiApp/Books/application/interfaces';
import { createPatchController } from '../shared/controllerFactoryFunctions';

export const createPatchBookController = (service: BookPatcher) =>
  createPatchController<BookPatcher, BookPatcherRequest>(service);
