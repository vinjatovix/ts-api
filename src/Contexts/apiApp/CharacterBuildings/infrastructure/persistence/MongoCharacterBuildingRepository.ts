import { MongoClient } from 'mongodb';
import { MongoRepository } from '../../../../shared/infrastructure/persistence/mongo';
import { CharacterBuilding } from '../../domain';
import { CharacterBuildingRepository } from '../../domain/interfaces';
import { CharacterBuildingMapper } from '../CharacterBuildingMapper';
import { CharacterBuildingType } from '../types';

export class MongoCharacterBuildingRepository
  extends MongoRepository<CharacterBuilding>
  implements CharacterBuildingRepository
{
  constructor(
    client: Promise<MongoClient>,
    private readonly mapper: CharacterBuildingMapper
  ) {
    super(client);
    this.mapper = new CharacterBuildingMapper();
  }

  protected collectionName(): string {
    return 'characterBuildings';
  }

  public async save(characterBuilding: CharacterBuilding): Promise<void> {
    return await this.persist(characterBuilding.id.value, characterBuilding);
  }

  async findByQuery(query: { id: string }): Promise<CharacterBuilding[]> {
    const filter: { [key: string]: string | { $in: string[] } } = {};

    if (query.id) {
      filter['_id'] = query.id;
    }

    const collection = await this.collection();
    const documents = await collection
      .find<CharacterBuildingType>(filter)
      .toArray();

    return documents.map(this.mapper.toDomain);
  }
}
