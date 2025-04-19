# 🧩 fflags-lib

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
npm install fflags-lib
```

## 🧑‍💻 Uso básico
1. Usar los casos de uso
```javascript
import { Redis } from 'ioredis';
import { ManagerService } from "fflags-lib";

const redis = new Redis();
const managerService = ManagerService.getInstance(redis)

let flag = await managerService.createFlag('test', true, 'test flag')
flag = await managerService.getFlag('test')
flag = await managerService.deactivateFlag('test')
flag = await managerService.activateFlag('test')
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
- ioredis 5+