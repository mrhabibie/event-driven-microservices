import { Injectable, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  @EventPattern(process.env.RABBITMQ_QUEUE)
  async handleOrder(@Payload() order: OrderDto, @Ctx() context: RmqContext) {
    this.logger.debug(order);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    try {
      // Log message receipt
      this.logger.log(`Received order: ${JSON.stringify(order)}`);

      // Simulate processing the order (e.g., logging or saving to a database)
      this.processOrder(order);

      // Log successful processing
      this.logger.log(`Successfully processed order: ${JSON.stringify(order)}`);

      // Acknowledge the message if processed successfully
      channel.ack(originalMsg);
    } catch (error) {
      // Log the error
      this.logger.error(
        `Failed to process order: ${JSON.stringify(order)}`,
        error.stack,
      );

      // Retry logic or reject with requeue
      const MAX_RETRY_COUNT = 3;
      const retryCount = originalMsg.properties.headers['x-death']
        ? originalMsg.properties.headers['x-death'][0].count
        : 0;

      if (retryCount < MAX_RETRY_COUNT) {
        // Requeue message if retry count is less than max retries
        channel.nack(originalMsg, false, true);
      } else {
        // Move to dead-letter queue or discard after max retries
        channel.ack(originalMsg);
        this.logger.warn(
          `Order discarded after ${MAX_RETRY_COUNT} retries: ${JSON.stringify(order)}`,
        );
      }
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
