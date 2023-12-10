import { v4 as uuidv4 } from 'uuid';
import { Log } from '../../domain/Log';
import { LogLevel } from '../../domain/LogLevel';
import { LogRepository } from '../../domain/LogRepository';
import { MongoRepository } from '../../../infrastructure/persistence/mongo/MongoRepository';

export interface LogDocument {
  _id: string;
  message: string;
  level: string;
  timestamp: string;
}

export class LogMongoRepository
  extends MongoRepository<Log>
  implements LogRepository
{
  public async save(log: Log): Promise<void> {
    return this.persist(uuidv4(), log);
  }
  public async search(severityLevel: LogLevel): Promise<Log[]> {
    const collection = await this.collection();
    const documents = await collection
      .find<LogDocument>({ level: severityLevel })
      .toArray();

    return documents.map((document) =>
      Log.fromPrimitives({
        message: document.message,
        level: document.level,
        timestamp: document.timestamp
      })
    );
  }

  protected collectionName(): string {
    return 'logs';
  }
}
