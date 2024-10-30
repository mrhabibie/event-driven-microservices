import { Injectable, Logger } from '@nestjs/common';
import { Payload } from '@nestjs/microservices';
import { OrderDto } from './dto/order.dto';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  @RabbitSubscribe({
    queue: 'orders',
    queueOptions: {
      durable: true,
      arguments: {
        'x-queue-type': 'quorum',
      },
    },
  })
  async handleOrder(@Payload() order: OrderDto) {
    try {
      // Log message receipt
      this.logger.log(`Received order: ${JSON.stringify(order)}`);

      // Simulate processing the order (e.g., logging or saving to a database)
      this.processOrder(order);

      // Log successful processing
      this.logger.log(`Successfully processed order: ${JSON.stringify(order)}`);
    } catch (error) {
      // Log the error
      this.logger.error(
        `Failed to process order: ${JSON.stringify(order)}`,
        error.stack,
      );
    }
  }

  private processOrder(order: OrderDto) {
    // Simulate a task - this could be saving to a database, etc.
    this.logger.log(`Processing order: ${JSON.stringify(order)}`);
    // Insert more logic here as needed (e.g., storing to a database)
  }

  getHello(): string {
    return 'Hello World!';
  }
}
