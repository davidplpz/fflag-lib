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

## 🧑‍💻 Basic usage
1. Use the use cases
```javascript
import { Redis } from 'ioredis';
import { ManagerService } from "fflags-lib";

const redis = new Redis();
const managerService = ManagerService.getInstance(redis)

let flag = await managerService.createFlag('test', true, 'test flag')
flag = await managerService.getFlag('test')
flag = await managerService.deactivateFlag('test')
flag = await managerService.activateFlag('test')
flag = await managerService.deleteFlag('test')
flag = await managerService.getAllFlags()
flag = await managerService.getActivatedFlags()
flag = await managerService.getInactiveFlags()
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