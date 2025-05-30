import amqp from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

class RabbitMQService {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.url = process.env.RABBITMQ_URL || 'amqp://localhost:5672';
    }

    async connect() {
        try {
            this.connection = await amqp.connect(this.url);
            this.channel = await this.connection.createChannel();
            console.log('Connected to RabbitMQ');
        } catch (error) {
            console.error('RabbitMQ connection error:', error);
            throw error;
        }
    }

    async publishMessage(exchange, routingKey, message) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            await this.channel.assertExchange(exchange, 'direct', { durable: true });
            
            this.channel.publish(
                exchange,
                routingKey,
                Buffer.from(JSON.stringify(message)),
                { persistent: true }
            );

            console.log(`Message published to exchange: ${exchange}, routing key: ${routingKey}`);
        } catch (error) {
            console.error('Error publishing message:', error);
            throw error;
        }
    }

    async subscribeToQueue(queueName, exchange, routingKey, handler) {
        try {
            if (!this.channel) {
                await this.connect();
            }

            await this.channel.assertExchange(exchange, 'direct', { durable: true });
            const queue = await this.channel.assertQueue(queueName, { durable: true });
            await this.channel.bindQueue(queue.queue, exchange, routingKey);

            await this.channel.consume(queue.queue, async (message) => {
                if (message) {
                    try {
                        const content = JSON.parse(message.content.toString());
                        await handler(content);
                        this.channel.ack(message);
                    } catch (error) {
                        console.error('Error processing message:', error);
                        this.channel.nack(message, false, true);
                    }
                }
            });

            console.log(`Subscribed to queue: ${queueName}, exchange: ${exchange}, routing key: ${routingKey}`);
        } catch (error) {
            console.error('Error subscribing to queue:', error);
            throw error;
        }
    }

    async closeConnection() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
            console.log('RabbitMQ connection closed');
        } catch (error) {
            console.error('Error closing RabbitMQ connection:', error);
            throw error;
        }
    }

    // Subscription specific methods
    async publishSubscriptionEvent(event, subscriptionData) {
        const exchange = 'subscription_events';
        const routingKey = event; // e.g., 'subscription.created', 'subscription.renewed'
        await this.publishMessage(exchange, routingKey, subscriptionData);
    }

    async subscribeToSubscriptionEvents(queueName, handler) {
        const exchange = 'subscription_events';
        const routingKey = 'subscription.*'; // Subscribe to all subscription events
        await this.subscribeToQueue(queueName, exchange, routingKey, handler);
    }

    // Subscribe to user and plan events
    async subscribeToUserEvents(queueName, handler) {
        const exchange = 'user_events';
        const routingKey = 'user.*';
        await this.subscribeToQueue(queueName, exchange, routingKey, handler);
    }

    async subscribeToPlanEvents(queueName, handler) {
        const exchange = 'plan_events';
        const routingKey = 'plan.*';
        await this.subscribeToQueue(queueName, exchange, routingKey, handler);
    }
}

const rabbitMQService = new RabbitMQService();
export default rabbitMQService;
