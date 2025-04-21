import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';
import { DeleteFeatureFlagService } from '../../src/application/delete-feature-flag.service';
import { FeatureFlag } from '../../src/domain/feature-flag.entity';

describe('DeleteFeatureFlagService', () => {
    let repository: InMemoryFeatureFlagRepository;
    let service: DeleteFeatureFlagService;

    beforeEach(() => {
        repository = new InMemoryFeatureFlagRepository();
        service = new DeleteFeatureFlagService(repository);
    });

    it('should delete an existing feature flag', async () => {
        const key = 'test-key';
        const featureFlag = new FeatureFlag(key, true);
        await repository.save(featureFlag);

        await service.execute(key);

        const result = await repository.get(key);
        expect(result).toBeNull();
    });

    it('should throw an error if the feature flag does not exist', async () => {
        const key = 'non-existent-key';

        await expect(service.execute(key)).rejects.toThrow(
            `Feature flag with key ${key} does not exist.`
        );
    });
});