import { describe, it, expect, beforeEach } from 'vitest';
import { DeleteFeatureFlagService } from '../../src';
import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';
import { FeatureFlag } from '../../src';

describe('DeleteFeatureFlagService', () => {
    let repository: InMemoryFeatureFlagRepository;
    let service: DeleteFeatureFlagService;

    beforeEach(() => {
        repository = new InMemoryFeatureFlagRepository();
        service = new DeleteFeatureFlagService(repository);
    });

    it('debería eliminar un feature flag existente', async () => {
        const key = 'test-key';
        const featureFlag = new FeatureFlag(key, true);
        await repository.save(featureFlag);

        await service.execute(key);

        const result = await repository.get(key);
        expect(result).toBeNull();
    });

    it('debería lanzar un error si el feature flag no existe', async () => {
        const key = 'non-existent-key';

        await expect(service.execute(key)).rejects.toThrow(
            `Feature flag with key ${key} does not exist.`
        );
    });
});