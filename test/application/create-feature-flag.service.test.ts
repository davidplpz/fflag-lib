import { describe, it, expect, beforeEach } from 'vitest';
import { CreateFeatureFlagService } from '../../src';
import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';

describe('CreateFeatureFlagService', () => {
    let repository: InMemoryFeatureFlagRepository;
    let service: CreateFeatureFlagService;

    beforeEach(() => {
        repository = new InMemoryFeatureFlagRepository();
        service = new CreateFeatureFlagService(repository);
    });

    it('debería crear un feature flag exitosamente', async () => {
        const key = 'test-key';
        const isActive = true;
        const description = 'Descripción de prueba';

        const featureFlag = await service.execute(key, isActive, description);

        expect(featureFlag.key).toBe(key);
        expect(featureFlag.isActive).toBe(isActive);
        expect(featureFlag.description).toBe(description);

        const savedFlag = await repository.get(key);
        expect(savedFlag).not.toBeNull();
        expect(savedFlag?.key).toBe(key);
        expect(savedFlag?.isActive).toBe(isActive);
        expect(savedFlag?.description).toBe(description);
    });

    it('debería lanzar un error si el feature flag ya existe', async () => {
        const key = 'test-key';
        const isActive = true;

        await service.execute(key, isActive);

        await expect(service.execute(key, isActive)).rejects.toThrow(
            `Feature flag with key ${key} already exists.`
        );
    });
});