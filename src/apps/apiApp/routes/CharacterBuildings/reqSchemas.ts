import { body, param } from 'express-validator';
import { RelationshipCircumstancePrimitives } from '../../../../Contexts/apiApp/CharacterBuildings/domain/interfaces';
import { createError } from '../../../../Contexts/shared/domain/errors';

const validateRelationshipCircumstances = (
  value: RelationshipCircumstancePrimitives[]
) => {
  const message =
    'relationshipCircumstances must be an array of objects with character and circumstance properties';
  if (!Array.isArray(value)) {
    throw createError.invalidArgument(message);
  }
  value.forEach((rc: RelationshipCircumstancePrimitives) => {
    if (!rc.character || !rc.circumstance) {
      throw createError.invalidArgument(message);
    }
  });
  return true;
};

export const postReqSchema = [
  body('id').exists().isUUID(),
  body('actor').exists().isUUID(),
  body('character').exists().isUUID(),
  body('scene').exists().isUUID(),
  body('sceneCircumstances').exists().isString(),
  body('previousCircumstances').exists().isString(),
  body('relationshipCircumstances').custom(validateRelationshipCircumstances)
];

export const patchReqSchema = [
  param('id').exists().isUUID(),
  body('actor').optional().isUUID(),
  body('character').optional().isUUID(),
  body('scene').optional().isUUID(),
  body('sceneCircumstances').optional().isString(),
  body('previousCircumstances').optional().isString(),
  body('relationshipCircumstances')
    .optional()
    .custom(validateRelationshipCircumstances)
];
