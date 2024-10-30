# RabbitMQ Producer

This guide will help you set up a RabbitMQ Producer using NestJS for an event-driven microservice.

## Getting Started

1. NodeJS - `v20.17.0` [Installation](https://nodejs.org/en/download/package-manager)
2. Docker - `(latest)` [Installation](https://docs.docker.com/engine/install/)

## Clone the Repository

Choose one of the following methods to clone the repository:

- HTTPS

```bash
git clone https://github.com/mrhabibie/event-driven-microservices
```

- SSH

```bash
git clone git@github.com:mrhabibie/event-driven-microservices.git
```

## 🐳 Docker Setup

To set up RabbitMQ with Docker, run the following command to create a RabbitMQ container:

```bash
docker run -it --rm --name rabbitmq -p {RMQ_APP_PORT}:{RMQ_APP_PORT} -p {RMQ_MANAGEMENT_PORT}:{RMQ_MANAGEMENT_PORT} rabbitmq:4.0-management
```

Replace `{RMQ_APP_PORT}` and `{RMQ_MANAGEMENT_PORT}` with your desired ports.

## 🐇 RabbitMQ Configuration

1. Open [http://localhost:{RMQ_MANAGEMENT_PORT}](http://localhost:{RMQ_MANAGEMENT_PORT}) in your browser.
2. Sign in with the default username and password: `guest`.
3. Go to Exchanges tab:
   - Add a new exchange called `notifications`.
   - Set the exchange type to `Topic`.
   - Click **Add exchange**.
4. Go to the **Queues and Streams** tab:
   - Add a new queue with type `Quorum`.
   - Fill the Name field with `orders`.
   - Click **Add queue**.
5. In the **Queues and Streams** tab, click the name of the queue you just added:
   - Scroll down to the **Bindings** section.
   - Set **From exchange** to the exchange you created.
   - Set the **Routing key** to any value of your choice.
   - Click **Bind** to link your queue to the exchange.

## 📝 Environment Setup

1. Navigate to the `producer` directory:

```bash
cd producer
```

2. Install the required dependencies:

```bash
npm install
```

or

```bash
pnpm install
```

3. Copy `.env.example` to `.env`
4. Open the .env file and configure the following:
   - Set `RABBITMQ_URL` to your RabbitMQ URL, e.g., `amqp://localhost:{RMQ_APP_PORT}`.
   - Set `RABBITMQ_QUEUE` to the name of the queue you created, e.g., `orders`.

## 🚀 Running the Application

To start the application, use one of the following commands:

```bash
npm run start:dev
```

or

```bash
pnpm start:dev
```

Your RabbitMQ producer service should now be up and running!
