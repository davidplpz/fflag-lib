import { describe, it, expect, beforeEach } from 'vitest';
import { DeactivateFeatureFlagService } from '../../src';
import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';
import { FeatureFlag } from '../../src';

describe('DeactivateFeatureFlagService', () => {
    let repository: InMemoryFeatureFlagRepository;
    let service: DeactivateFeatureFlagService;

    beforeEach(() => {
        repository = new InMemoryFeatureFlagRepository();
        service = new DeactivateFeatureFlagService(repository);
    });

    it('debería desactivar un feature flag existente', async () => {
        const key = 'test-key';
        const featureFlag = new FeatureFlag(key, true);
        await repository.save(featureFlag);

        const result = await service.deactivateFeatureFlag(key);

        expect(result.isActive).toBe(false);
        const updatedFlag = await repository.get(key);
        expect(updatedFlag?.isActive).toBe(false);
    });

    it('debería lanzar un error si el feature flag no existe', async () => {
        const key = 'non-existent-key';

        await expect(service.deactivateFeatureFlag(key)).rejects.toThrow(
            `Feature flag with id ${key} not found`
        );
    });
});