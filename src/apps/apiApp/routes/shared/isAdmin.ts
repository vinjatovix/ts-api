import { EnsureAuthentication } from './EnsureAuthentication';

export const isAdmin = EnsureAuthentication.isAdministrator;
