import { ObjectId } from 'bson';

export interface CharacterByQuery {
  id?: string;
  _id?: { $in: ObjectId[] };
  name?: string;
  book?: string;
}
