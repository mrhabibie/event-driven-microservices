import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CsvService } from './csv/csv.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy,
    private readonly csvService: CsvService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    try {
      const orders = await this.csvService.readCsv(
        'indonesian_food_orders.csv',
      );
      let index: number = 0;
      setInterval(() => {
        if (index < orders.length) {
          this.client.emit(
            this.configService.get<string>('RABBITMQ_QUEUE'),
            orders[index],
          );
          this.logger.debug(`Data sent: ${JSON.stringify(orders[index])}`);
          index++;
        } else {
          this.logger.debug('No more data to send.');
        }
      }, 10000);
    } catch (error) {
      this.logger.error(
        `Error during module initialization: ${error.message}`,
        error.stack,
      );
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
