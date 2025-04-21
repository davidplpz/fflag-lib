import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';
import { DeactivateFeatureFlagService } from '../../src/application/deactivate-feature-flag.service';
import { FeatureFlag } from '../../src/domain/feature-flag.entity';

describe('DeactivateFeatureFlagService', () => {
    let repository: InMemoryFeatureFlagRepository;
    let service: DeactivateFeatureFlagService;

    beforeEach(() => {
        repository = new InMemoryFeatureFlagRepository();
        service = new DeactivateFeatureFlagService(repository);
    });

    it('should deactivate an existing feature flag', async () => {
        const key = 'test-key';
        const featureFlag = new FeatureFlag(key, true);
        await repository.save(featureFlag);

        const result = await service.execute(key);

        expect(result.isActive).toBe(false);
        const updatedFlag = await repository.get(key);
        expect(updatedFlag?.isActive).toBe(false);
    });

    it('should throw an error if the feature flag does not exist', async () => {
        const key = 'non-existent-key';

        await expect(service.execute(key)).rejects.toThrow(
            `Feature flag with id ${key} not found`
        );
    });
});