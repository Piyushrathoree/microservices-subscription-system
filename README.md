# Microservices Subscription Management System

A robust subscription management system built with microservices architecture using Node.js, Express, MongoDB, and RabbitMQ.

## Architecture

The system consists of three main microservices:

1. **User Service** (Port: 3001)
   - Handles user authentication and management
   - Manages user profiles and verification

2. **Plan Service** (Port: 3002)
   - Manages subscription plans
   - Handles plan CRUD operations

3. **Subscription Service** (Port: 3003)
   - Manages user subscriptions
   - Handles subscription lifecycle
   - Monitors subscription expiry

4. **API Gateway** (Port: 3000)
   - Routes requests to appropriate services
   - Handles service discovery

## Features

- User authentication with JWT
- Email verification system
- Subscription plan management
- User subscription handling
- Automatic subscription expiry checking
- Inter-service communication using RabbitMQ
- Microservices architecture
- Email notifications

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- RabbitMQ
- Gmail account (for email notifications)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Microservices-Subscription-management-system
```

2. Install dependencies for each service:
```bash
# Install dependencies for User Service
cd UserService && npm install

# Install dependencies for Plan Service
cd ../PlanService && npm install

# Install dependencies for Subscription Service
cd ../SubscriptionService && npm install

# Install dependencies for Gateway
cd ../gateway && npm install
```

3. Configure environment variables:

Create .env files in each service directory using the provided .env.example files:

**User Service (.env):**
```env
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
PORT=3001
EMAIL_USER=<your-gmail>
EMAIL_PASS=<your-gmail-app-password>
FRONTEND_URL=http://localhost:5173
RABBITMQ_URL=<your-rabbitmq-url>
```

**Plan Service (.env):**
```env
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
PORT=3002
USER_SERVICE_URL=http://localhost:3001
RABBITMQ_URL=<your-rabbitmq-url>
```

**Subscription Service (.env):**
```env
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
PORT=3003
USER_SERVICE_URL=http://localhost:3000
RABBITMQ_URL=<your-rabbitmq-url>
```

## API Routes

### User Service Routes
- POST `/register` - Register new user
- POST `/login` - User login
- POST `/verify` - Verify user email
- POST `/forgot-password` - Request password reset
- POST `/reset-password/:token` - Reset password
- POST `/logout` - User logout
- GET `/profile` - Get user profile

### Plan Service Routes
- POST `/` - Create new plan
- GET `/` - Get all plans
- PUT `/:id` - Update plan
- DELETE `/:id` - Delete plan

### Subscription Service Routes
- POST `/` - Create new subscription
- GET `/` - Get user subscriptions
- PUT `/:subId` - Update subscription
- DELETE `/:subId` - Cancel subscription

## RabbitMQ Event System

### Events Published

**User Service Events:**
- `user.created`
- `user.updated`
- `user.deleted`

**Plan Service Events:**
- `plan.created`
- `plan.updated`
- `plan.deleted`

**Subscription Service Events:**
- `subscription.created`
- `subscription.renewed`
- `subscription.cancelled`
- `subscription.expired`

## Starting the Services

1. Start all services:

```bash
# Start User Service
cd UserService && npm run dev

# Start Plan Service
cd ../PlanService && npm run dev

# Start Subscription Service
cd ../SubscriptionService && npm run dev

# Start Gateway
cd ../gateway && npm run dev
```

## Error Handling

The system includes comprehensive error handling:
- Input validation using Zod
- HTTP error responses with appropriate status codes
- RabbitMQ message handling error recovery
- Database connection error handling
- Email service error handling

## Security Features

- JWT authentication
- Password hashing using bcrypt
- Email verification
- Protected routes
- CORS configuration
- Input validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email [your-email@example.com](mailto:your-email@example.com)