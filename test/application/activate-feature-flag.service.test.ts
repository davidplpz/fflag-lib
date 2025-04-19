import { describe, it, expect, beforeEach } from 'vitest';
import { ActivateFeatureFlagService } from '../../src';
import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';
import { FeatureFlag } from '../../src';

describe('ActivateFeatureFlagService', () => {
    let repository: InMemoryFeatureFlagRepository;
    let service: ActivateFeatureFlagService;

    beforeEach(() => {
        repository = new InMemoryFeatureFlagRepository();
        service = new ActivateFeatureFlagService(repository);
    });

    it('debería activar un feature flag existente', async () => {
        const key = 'test-key';
        const featureFlag = new FeatureFlag(key, false);
        await repository.save(featureFlag);

        const result = await service.execute(key);

        expect(result.isActive).toBe(true);
        const updatedFlag = await repository.get(key);
        expect(updatedFlag?.isActive).toBe(true);
    });

    it('debería lanzar un error si el feature flag no existe', async () => {
        const key = 'non-existent-key';

        await expect(service.execute(key)).rejects.toThrow(
            `Feature flag with id ${key} not found`
        );
    });
});