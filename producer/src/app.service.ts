import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CsvService } from './csv/csv.service';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  /**
   * Use NestJS's @Inject for injecting the ClientProxy instead of creating it directly in the constructor.
   * This allows for better control and testability.
   */
  constructor(
    @Inject('RABBITMQ_CLIENT') private readonly client: ClientProxy,
    private readonly csvService: CsvService,
  ) {}

  async onModuleInit() {
    /**
     * Add more error handling to ensure issues during CSV reading
     * or RabbitMQ connectivity are properly logged.
     */
    try {
      const orders = await this.csvService.readCsv(
        'indonesian_food_orders.csv',
      );
      let index: number = 0;
      setInterval(() => {
        /**
         * Instead of continuously sending data every 10 seconds indefinitely,
         * consider adding a limit to prevent errors if the data runs out.
         */
        if (index < orders.length) {
          this.client.emit('orders', orders[index]);
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
