import { Model, QueryFilter, Types } from 'mongoose';
import { AbstractDocument } from '../common/abstract.schema.js';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;
  constructor(protected readonly model: Model<TDocument>) {}

  async create(data: Omit<TDocument, '_id'>): Promise<TDocument> {
    const newDocument = new this.model({
      ...data,
      _id: new Types.ObjectId(),
    });

    return (await newDocument.save()).toJSON();
  }

  async findOne(query: QueryFilter<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(query, {}, { lean: true }).exec();

    if (!document) {
      this.logger.warn(
        `Document not found for query: ${JSON.stringify(query)}`,
      );
      throw new NotFoundException(`Document not found`);
    }

    return document;
  }
}
