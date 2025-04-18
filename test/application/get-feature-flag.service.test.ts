import { describe, it, expect, beforeEach } from 'vitest';
import { GetFeatureFlagService } from '../../src';
import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';
import { FeatureFlag } from '../../src';

describe('GetFeatureFlagService', () => {
    let repository: InMemoryFeatureFlagRepository;
    let service: GetFeatureFlagService;

    beforeEach(() => {
        repository = new InMemoryFeatureFlagRepository();
        service = new GetFeatureFlagService(repository);
    });

    it('debería obtener un feature flag existente', async () => {
        const key = 'test-key';
        const featureFlag = new FeatureFlag(key, true, 'Descripción de prueba');
        await repository.save(featureFlag);

        const result = await service.execute(key);

        expect(result).toEqual(featureFlag);
    });

    it('debería lanzar un error si el feature flag no existe', async () => {
        const key = 'non-existent-key';

        await expect(service.execute(key)).rejects.toThrow(
            `Feature flag with key ${key} not found.`
        );
    });
});