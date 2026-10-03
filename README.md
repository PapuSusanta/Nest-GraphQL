# Nest GraphQL API

A modular, code-first GraphQL API built with NestJS, Apollo GraphQL, Mongoose, and MongoDB. Features are organized as independent NestJS modules, making the application straightforward to extend as new domain areas are added. The GraphQL schema is generated from the application's TypeScript models and resolvers.

## Features

- GraphQL API exposed at `/graphql`
- Feature-oriented NestJS modules with their own resolver, service, repository, GraphQL model, and persistence schema
- Global request validation
- MongoDB persistence via Mongoose
- Unit and end-to-end test commands powered by Vitest
- Docker Compose setup for local MongoDB and Mongo Express

## Technology

- Node.js and TypeScript (ES modules)
- NestJS 12
- Apollo Server / GraphQL
- MongoDB 8 and Mongoose
- Vitest
- pnpm

## Prerequisites

- A current Node.js LTS release
- pnpm
- MongoDB, either installed locally or started with Docker Compose
- Docker and Docker Compose (optional, for the included local database stack)

## Quick start

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Start MongoDB. To use the included local services:

   ```bash
   docker compose up -d
   ```

3. Create a `.env` file in the repository root:

   ```dotenv
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/nest_graphql
   ```

4. Start the API in watch mode:

   ```bash
   pnpm start:dev
   ```

The API will listen on `http://localhost:3000/graphql`. `PORT` defaults to `3000`; `DATABASE_URL` is required.

To inspect the local database, open Mongo Express at `http://localhost:8081` and sign in with `admin` / `admin`. These credentials and the Compose configuration are intended for local development only.

## Current API

The generated schema is stored at [`src/schema.graphql`](src/schema.graphql). Do not edit it directly; update a module's code-first models, inputs, or resolvers and restart the application to regenerate it.

The application currently includes the `UsersModule`, which provides the following operations. Future modules will extend this schema.

### `createUser`

```graphql
mutation CreateUser {
  createUser(
    createUserInput: { name: "Ada Lovelace", email: "ada@example.com" }
  ) {
    _id
    name
    email
  }
}
```

The email must be valid. Leading/trailing whitespace is removed and the value is converted to lowercase before it is stored. Email addresses must be unique; an attempt to reuse one returns an `Email already exists` error.

### `user`

```graphql
query GetUser {
  user(_id: "PUT_USER_ID_HERE") {
    _id
    name
    email
  }
}
```

Unknown IDs return a GraphQL error derived from the application's `NotFoundException`.

## Configuration

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `PORT` | No | `3000` | HTTP port for the NestJS server. |
| `DATABASE_URL` | Yes | — | MongoDB connection string used by Mongoose. |

Keep `.env` out of version control. Use a secrets manager or your deployment platform's environment-variable facility for deployed environments.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm start` | Start the NestJS application. |
| `pnpm start:dev` | Start in watch mode. |
| `pnpm start:debug` | Start in watch mode with the Node debugger enabled. |
| `pnpm build` | Compile the application into `dist/`. |
| `pnpm start:prod` | Run the compiled application. |
| `pnpm lint` | Run Oxlint over application and test source. |
| `pnpm format` | Format TypeScript source and tests with Prettier. |
| `pnpm test` | Run unit tests. |
| `pnpm test:watch` | Run tests in watch mode. |
| `pnpm test:cov` | Run unit tests with coverage. |
| `pnpm test:e2e` | Run end-to-end tests. Requires a reachable `DATABASE_URL`. |

## Production deployment

Build and run the compiled server with production configuration:

```bash
pnpm install --frozen-lockfile
pnpm build
PORT=3000 DATABASE_URL='mongodb://USER:PASSWORD@HOST:27017/nest_graphql?authSource=admin' pnpm start:prod
```

For production, use an authenticated MongoDB deployment with network access controls, TLS where supported, backups, and a dedicated database user with only the permissions this service needs. Do not expose the bundled Mongo Express service or use its example credentials outside local development.

Place the service behind a reverse proxy or load balancer that terminates TLS, and configure its health checks to account for both application startup and database connectivity. Ensure the process manager or platform restarts the service on failure.

## Adding a module

Add each new domain capability as a self-contained module under `src/`. A typical module owns its GraphQL resolver and DTOs, business service, repository, Mongoose schema, and GraphQL model. Import the module in `AppModule` and, when it persists data, register its schema with `MongooseModule.forFeature`.

```text
src/
└── products/                         # Example future feature module
    ├── contract/                      # GraphQL inputs and query arguments
    ├── models/product.model.ts        # GraphQL object type
    ├── schema/product.schema.ts       # Mongoose document schema
    ├── products.module.ts             # Module registration
    ├── products.resolver.ts           # GraphQL queries and mutations
    ├── products.service.ts            # Business rules
    └── products.repository.ts         # Data access
```

Keep module boundaries explicit: resolvers should delegate to services, services should contain domain logic, and repositories should be the persistence boundary. This lets additional modules grow without coupling their business rules or database access.

## Project layout

```text
src/
├── common/       # Shared GraphQL and Mongoose base types
├── database/     # MongoDB module and reusable repository base class
├── users/        # Current feature module; future modules follow this pattern
├── app.module.ts # Application, configuration, GraphQL, and database wiring
└── main.ts       # Bootstrap and global validation setup
test/             # End-to-end test suite
```

## License

This project is private and unlicensed (`UNLICENSED`).
