import { describe, it, expect, beforeEach } from 'vitest';
    import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';
    import { ActivateFeatureFlagService } from '../../src/application/activate-feature-flag.service';
    import { FeatureFlag } from '../../src/domain/feature-flag.entity';

    describe('ActivateFeatureFlagService', () => {
        let repository: InMemoryFeatureFlagRepository;
        let service: ActivateFeatureFlagService;

        beforeEach(() => {
            repository = new InMemoryFeatureFlagRepository();
            service = new ActivateFeatureFlagService(repository);
        });

        it('should activate an existing feature flag', async () => {
            const key = 'test-key';
            const featureFlag = new FeatureFlag(key, false);
            await repository.save(featureFlag);

            const result = await service.execute(key);

            expect(result.isActive).toBe(true);
            const updatedFlag = await repository.get(key);
            expect(updatedFlag?.isActive).toBe(true);
        });

        it('should throw an error if the feature flag does not exist', async () => {
            const key = 'non-existent-key';

            await expect(service.execute(key)).rejects.toThrow(
                `Feature flag with id ${key} not found`
            );
        });
    });