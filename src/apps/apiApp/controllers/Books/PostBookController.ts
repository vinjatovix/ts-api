import { BookCreator } from '../../../../Contexts/apiApp/Books/application';
import { BookCreatorRequest } from '../../../../Contexts/apiApp/Books/application/interfaces';
import { createPostController } from '../shared/controllerFactoryFunctions';

export const createPostBookController = (service: BookCreator) =>
  createPostController<BookCreator, BookCreatorRequest>(service);
