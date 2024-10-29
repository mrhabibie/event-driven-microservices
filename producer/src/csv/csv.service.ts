import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { OrderDto } from 'src/dto/order.dto';

@Injectable()
export class CsvService {
  private readonly logger = new Logger(CsvService.name);

  async readCsv(filename: string): Promise<OrderDto[]> {
    const results: OrderDto[] = [];
    const filePath = path.join(__dirname, '../..', 'assets', filename);
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
          results.push({
            customer_id: parseInt(data.customer_id),
            customer_name: data.customer_name,
            item_id: parseInt(data.item_id),
            item_name: data.item_name,
            price: parseFloat(data.price),
          });
        })
        .on('end', () => resolve(results))
        .on('error', (error) => {
          this.logger.error(`Error reading CSV file: ${error.message}`);
          reject(error);
        });
    });
  }
}
