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
      }
    ];

    const aggregateBuilder = new AggregateBuilder();
    const pipeline = aggregateBuilder.buildPipeline('', options);
    expect(pipeline).toEqual(expectedOutput);
  });
});
