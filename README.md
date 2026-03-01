# 🧩 fflags-lib

Modular and extensible library for managing **feature flags** using Redis as storage. Based on **Domain-Driven Design (DDD)** principles and **Hexagonal Architecture**.

---

## 🚀 Features

- ✅ Feature flag management: activate, deactivate, create, delete, retrieve.
- 🧱 Hexagonal architecture (ports and adapters).
- 🧠 Clear separation between domain, application, and infrastructure.
- 🔌 Redis storage (can be extended to others).
- 📦 Packaged as a library for reuse in multiple projects.
- 🧪 Tested with [Vitest](https://vitest.dev/).
- ⚙️ Written in TypeScript and compatible with ESM/CJS.

---

## 📦 Installation

```bash
npm install fflags-lib
```

## 🧑‍💻 Usage Guide

### 1. Initialization
With the newly updated architecture, you can now instantiate the `ManagerService` by injecting the `FeatureFlagRepository` of your choice. You can use **Redis**, **PostgreSQL**, or **MySQL**.

First, choose the driver you want to use and instantiate its repository:

#### Option A: Redis (Default / Recommended for speed)
```javascript
import { Redis } from 'ioredis';
import { ManagerService, RedisRepository } from "fflags-lib";

const redisClient = new Redis(); // defaults to localhost:6379
const repository = new RedisRepository(redisClient);
const managerService = ManagerService.getInstance(repository);
```

#### Option B: PostgreSQL
Make sure you have created the required `feature_flags` table (check `schema.sql`) and that you have `pg` installed (`npm i pg`).
```javascript
import { PostgresRepository, ManagerService } from "fflags-lib";

const repository = new PostgresRepository({
    connectionString: "postgresql://user:password@localhost:5432/mydb"
});
const managerService = ManagerService.getInstance(repository);
```

#### Option C: MySQL
Make sure you have created the required `feature_flags` table (check `schema.sql`) and that you have `mysql2` installed (`npm i mysql2`).
```javascript
import { MysqlRepository, ManagerService } from "fflags-lib";

const repository = new MysqlRepository({
    uri: "mysql://user:password@localhost:3306/mydb"
});
const managerService = ManagerService.getInstance(repository);
```

### 2. Creating a Feature Flag
Create a new feature flag with a key, an initial state (boolean), and a description.

```javascript
// Creates a flag named 'new-feature', sets it to true, and adds a description
await managerService.createFlag('new-feature', true, 'Enables the new user dashboard');
```

### 3. Retrieving Flags
You can get a specific flag or list them based on their status.

```javascript
// Get a specific flag by its key
const myFlag = await managerService.getFlag('new-feature');

// List all flags
const allFlags = await managerService.getAllFlags();

// List only active flags
const activeFlags = await managerService.getActivatedFlags();

// List only inactive flags
const inactiveFlags = await managerService.getInactiveFlags();
```

### 4. Updating a Flag's Status
You can toggle a flag's status between active and inactive.

```javascript
// Deactivate the flag
await managerService.deactivateFlag('new-feature');

// Reactivate the flag
await managerService.activateFlag('new-feature');
```

### 5. Deleting a Flag
When a feature is fully rolled out or no longer needed, you can remove its flag.

```javascript
// Delete the flag entirely
await managerService.deleteFlag('new-feature');
```

### 6. Graceful Shutdown
Always remember to close the Redis connection safely when your application shuts down.

```javascript
// Closes the Redis connection
await managerService.quit();
```
## 🧪 Tests
```bash
npm run test
```

## ⚙️ Configuration

```text
To use with your own paths or tools, check:
•	tsconfig.json with configured baseUrl and paths.
•	tsup.config.ts for bundling.
•	vitest.config.ts for tests.
```
## 📌 Requirements
- Node.js 18+ 
- Redis 6+
- ioredis 5+