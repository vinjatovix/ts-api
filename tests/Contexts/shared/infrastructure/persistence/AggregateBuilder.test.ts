import { AggregateBuilder } from '../../../../../src/Contexts/shared/infrastructure/persistence/mongo';
import { random } from '../../../fixtures/shared';
import { UuidMother } from '../../../fixtures/shared/domain/mothers';

const FIELD0 = random.word({ min: 3, max: 5 });
const FIELD1 = random.word({ min: 3, max: 5 });
const COLLECTION0 = random.word({ min: 3, max: 5 }).replace(/s$/, '');
const COLLECTION1 = random.word({ min: 3, max: 5 }).replace(/s$/, '');
const NESTED_COLLECTION = `${COLLECTION0}.${COLLECTION1}`;

const SIMPLE_LOOKUP_UNWIND_STAGES = [
  {
    $lookup: {
      from: `${COLLECTION0}s`,
      localField: COLLECTION0,
      foreignField: '_id',
      as: COLLECTION0
    }
  },
  {
    $unwind: {
      path: `$${COLLECTION0}`,
      preserveNullAndEmptyArrays: true
    }
  }
];
const NESTED_LOOKUP_UNWIND_STAGES = [
  {
    $lookup: {
      from: `${COLLECTION1}s`,
      localField: `${NESTED_COLLECTION}`,
      foreignField: '_id',
      as: `${NESTED_COLLECTION}`
    }
  },
  {
    $unwind: {
      path: `$${NESTED_COLLECTION}`,
      preserveNullAndEmptyArrays: true
    }
  }
];

describe('AggregateBuilder', () => {
  it('simple field projection', () => {
    const options = {
      fields: [FIELD0, FIELD1]
    };

    const expectedOutput = [
      {
        $project: {
          _id: 1,
          metadata: 1,
          [`${FIELD0}`]: 1,
          [`${FIELD1}`]: 1
        }
      }
    ];
    const aggregateBuilder = new AggregateBuilder();
    const pipeline = aggregateBuilder.buildPipeline('', options);

    expect(pipeline).toEqual(expectedOutput);
  });

  it('simple population', () => {
    const options = { include: [COLLECTION0] };

    const pipeline = new AggregateBuilder().buildPipeline('', options);

    expect(pipeline).toEqual(SIMPLE_LOOKUP_UNWIND_STAGES);
  });

  it('nested population', () => {
    const options = { include: [NESTED_COLLECTION] };
    const expectedOutput = [
      ...SIMPLE_LOOKUP_UNWIND_STAGES,
      ...NESTED_LOOKUP_UNWIND_STAGES
    ];

    const pipeline = new AggregateBuilder().buildPipeline('', options);

    expect(pipeline).toEqual(expectedOutput);
  });

  it('simple population with field selection', () => {
    const options = {
      include: [COLLECTION0],
      fields: [FIELD0, `${COLLECTION0}.${FIELD1}`]
    };

    const expectedOutput = [
      ...SIMPLE_LOOKUP_UNWIND_STAGES,
      {
        $project: {
          _id: 1,
          metadata: 1,
          [`${FIELD0}`]: 1,
          [`${COLLECTION0}._id`]: 1,
          [`${COLLECTION0}.metadata`]: 1,
          [`${COLLECTION0}.${FIELD1}`]: 1
        }
      }
    ];

    const aggregateBuilder = new AggregateBuilder();
    const pipeline = aggregateBuilder.buildPipeline('', options);

    expect(pipeline).toEqual(expectedOutput);
  });

  it('nested population with match id and field selection', () => {
    const id = UuidMother.random().value;
    const whatever = random.word({ min: 3, max: 5 });
    const options = {
      include: [NESTED_COLLECTION],
      fields: [
        FIELD0,
        `${COLLECTION0}.${whatever}`,
        `${NESTED_COLLECTION}.${FIELD1}`
      ]
    };

    const expectedOutput = [
      {
        $match: {
          _id: id
        }
      },
      ...SIMPLE_LOOKUP_UNWIND_STAGES,
      ...NESTED_LOOKUP_UNWIND_STAGES,
      {
        $project: {
          _id: 1,
          metadata: 1,
          [`${FIELD0}`]: 1,
          [`${COLLECTION0}._id`]: 1,
          [`${COLLECTION0}.metadata`]: 1,
          [`${COLLECTION0}.${whatever}`]: 1,
          [`${NESTED_COLLECTION}._id`]: 1,
          [`${NESTED_COLLECTION}.metadata`]: 1,
          [`${NESTED_COLLECTION}.${FIELD1}`]: 1
        }
      }
    ];

    const aggregateBuilder = new AggregateBuilder();
    const pipeline = aggregateBuilder.buildPipeline(id, options);

    expect(pipeline).toEqual(expectedOutput);
  });

  it('should return the expected pipeline for nested populated arrays', () => {
    const options = {
      include: ['characters.book.author'],
      list: ['characters']
    };

    const expectedOutput = [
      {
        $lookup: {
          from: 'characters',
          localField: 'characters',
          foreignField: '_id',
          as: 'characters'
        }
      },
      {
        $unwind: {
          path: '$characters',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: 'characters.book',
          foreignField: '_id',
          as: 'characters.book'
        }
      },
      {
        $unwind: {
          path: '$characters.book',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'authors',
          localField: 'characters.book.author',
          foreignField: '_id',
          as: 'characters.book.author'
        }
      },
      {
        $unwind: {
          path: '$characters.book.author',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          characters: {
            $push: '$characters'
          },
          metadata: {
            $first: '$metadata'
          }
        }
      }
    ];
    const aggregateBuilder = new AggregateBuilder();
    const pipeline = aggregateBuilder.buildPipeline('', options);
    expect(pipeline).toEqual(expectedOutput);
  });

  it('should return the expected pipeline for nested populated arrays with field selection', () => {
    const options = {
      include: ['characters.book.author'],
      fields: [
        'description',
        'characters.name',
        'characters.book.title',
        'characters.book.author.name'
      ],
      list: ['characters']
    };

    const expectedOutput = [
      {
        $lookup: {
          from: 'characters',
          localField: 'characters',
          foreignField: '_id',
          as: 'characters'
        }
      },
      {
        $unwind: {
          path: '$characters',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'books',
          localField: 'characters.book',
          foreignField: '_id',
          as: 'characters.book'
        }
      },
      {
        $unwind: {
          path: '$characters.book',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'authors',
          localField: 'characters.book.author',
          foreignField: '_id',
          as: 'characters.book.author'
        }
      },
      {
        $unwind: {
          path: '$characters.book.author',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          characters: {
            $push: '$characters'
          },
          metadata: {
            $first: '$metadata'
          },
          description: {
            $first: '$description'
          }
        }
      },
      {
        $project: {
          _id: 1,
          metadata: 1,
          description: 1,
          'characters._id': 1,
          'characters.metadata': 1,
          'characters.name': 1,
          'characters.book._id': 1,
          'characters.book.metadata': 1,
          'characters.book.title': 1,
          'characters.book.author._id': 1,
          'characters.book.author.metadata': 1,
          'characters.book.author.name': 1
        }
      }
    ];

    const aggregateBuilder = new AggregateBuilder();
    const pipeline = aggregateBuilder.buildPipeline('', options);
    expect(pipeline).toEqual(expectedOutput);
  });

  it('should return the pipeline for full filtered characterBuilding request', () => {
    const _id = '1f17da80-b7c1-4032-bacb-57eaa9dcd1c4';
    const include = [
      'character.book.author',
      'scene.characters',
      'actor',
      'relationshipCircumstances.character'
    ];
    const fields = [
      'previousCircumstances',
      'sceneCircumstances',
      'center',
      'relationshipCircumstances.circumstance',
      'scene.description'
    ];
    const list = ['scene.characters'];
    const avoidLookup = ['relationshipCircumstances'];
    const unwind = ['relationshipCircumstances'];
    const avoidUnwind = ['scene.characters'];
    const options = {
      include,
      fields,
      list,
      avoidLookup,
      unwind,
      avoidUnwind
    };
    const expectedOutput = [
      {
        $match: {
          _id: '1f17da80-b7c1-4032-bacb-57eaa9dcd1c4'
        }
      },
      {
        $lookup: {
          as: 'character',
          foreignField: '_id',
          from: 'characters',
          localField: 'character'
        }
      },
      {
        $unwind: {
          path: '$character',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          as: 'character.book',
          foreignField: '_id',
          from: 'books',
          localField: 'character.book'
        }
      },
      {
        $unwind: {
          path: '$character.book',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          as: 'character.book.author',
          foreignField: '_id',
          from: 'authors',
          localField: 'character.book.author'
        }
      },
      {
        $unwind: {
          path: '$character.book.author',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: 'scenes',
          localField: 'scene',
          foreignField: '_id',
          as: 'scene'
        }
      },
      {
        $unwind: {
          path: '$scene',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          as: 'scene.characters',
          foreignField: '_id',
          from: 'characters',
          localField: 'scene.characters'
        }
      },
      {
        $lookup: {
          as: 'actor',
          foreignField: '_id',
          from: 'users',
          localField: 'actor'
        }
      },
      {
        $unwind: {
          path: '$actor',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: '$relationshipCircumstances',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          as: 'relationshipCircumstances.character',
          foreignField: '_id',
          from: 'characters',
          localField: 'relationshipCircumstances.character'
        }
      },
      {
        $unwind: {
          path: '$relationshipCircumstances.character',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          scene: {
            $first: {
              _id: '$scene._id',
              description: '$scene.description',
              metadata: '$scene.metadata',
              characters: '$scene.characters'
            }
          },
          character: {
            $first: '$character'
          },
          metadata: {
            $first: '$metadata'
          },
          actor: {
            $first: '$actor'
          },
          previousCircumstances: {
            $first: '$previousCircumstances'
          },
          sceneCircumstances: {
            $first: '$sceneCircumstances'
          },
          relationshipCircumstances: {
            $push: {
              character: '$relationshipCircumstances.character',
              circumstance: '$relationshipCircumstances.circumstance'
            }
          },
          center: {
            $first: '$center'
          }
        }
      },
      {
        $project: {
          _id: 1,
          'actor._id': 1,
          'actor.metadata': 1,
          center: 1,
          'character._id': 1,
          'character.book._id': 1,
          'character.book.author._id': 1,
          'character.book.author.metadata': 1,
          'character.book.metadata': 1,
          'character.metadata': 1,
          metadata: 1,
          previousCircumstances: 1,
          'relationshipCircumstances._id': 1,
          'relationshipCircumstances.character._id': 1,
          'relationshipCircumstances.character.metadata': 1,
          'relationshipCircumstances.circumstance': 1,
          'relationshipCircumstances.metadata': 1,
          'scene._id': 1,
          'scene.characters._id': 1,
          'scene.characters.metadata': 1,
          'scene.description': 1,
          'scene.metadata': 1,
          sceneCircumstances: 1
        }
      }
    ];

    const aggregateBuilder = new AggregateBuilder();
    const pipeline = aggregateBuilder.buildPipeline(_id, options);

    expect(pipeline).toEqual(expectedOutput);
  });
});
