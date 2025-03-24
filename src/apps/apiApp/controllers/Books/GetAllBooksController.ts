import { AllBooksFinder } from '../../../../Contexts/apiApp/Books/application';
import { BookPrimitives } from '../../../../Contexts/apiApp/Books/domain/interfaces';
import { RequestOptions } from '../../shared/interfaces';
import { createGetAllController } from '../shared/controllerFactoryFunctions';

export const createGetAllBooksController = (service: AllBooksFinder) =>
  createGetAllController<
    AllBooksFinder,
    Partial<RequestOptions>,
    Partial<BookPrimitives>[]
  >(service);
