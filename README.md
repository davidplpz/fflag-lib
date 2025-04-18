# 🧩 feature-flags-lib

Librería modular y extensible para gestionar **feature flags** utilizando Redis como almacenamiento. Basada en principios de **Domain-Driven Design (DDD)** y **Arquitectura Hexagonal**.

---

## 🚀 Características

- ✅ Gestión de feature flags: activar, desactivar, crear, eliminar, consultar.
- 🧱 Arquitectura hexagonal (puertos y adaptadores).
- 🧠 Separación clara entre dominio, aplicación e infraestructura.
- 🔌 Almacenamiento en Redis (puede extenderse a otros).
- 📦 Empaquetado como librería para reutilizar en múltiples proyectos.
- 🧪 Testeado con [Vitest](https://vitest.dev/).
- ⚙️ Escrito en TypeScript y compatible con ESM/CJS.

---

## 📦 Instalación

```bash
npm install feature-flags-lib
```

## 🧑‍💻 Uso básico

1. Crear una instancia del repositorio de Redis
```javascript
import { RedisFeatureFlagRepository } from 'feature-flags-lib';
import { createClient } from 'redis';

const redis = createClient();
await redis.connect();

const repo = new RedisFeatureFlagRepository(redis);
```

2. Usar los casos de uso
```javascript
import {
  CreateFeatureFlag,
  ActivateFeatureFlag,
  GetFeatureFlag
} from 'feature-flags-lib';

const createFlag = new CreateFeatureFlag(repo);
await createFlag.execute({ name: 'new-dashboard', active: false });

const activateFlag = new ActivateFeatureFlag(repo);
await activateFlag.execute('new-dashboard');

const getFlag = new GetFeatureFlag(repo);
const flag = await getFlag.execute('new-dashboard');
console.log(flag); // { name: 'new-dashboard', active: true }
```
## 🧪 Tests
```bash
npm run test
```

## ⚙️ Configuración

```text
Para usar con tus propios paths o herramientas, revisa:
•	tsconfig.json con baseUrl y paths configurados.
•	tsup.config.ts para el bundling.
•	vitest.config.ts para los tests.
```
## 📌 Requisitos
- Node.js 18+ 
- Redis 6+