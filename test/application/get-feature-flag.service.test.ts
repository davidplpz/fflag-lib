import { describe, it, expect, beforeEach } from 'vitest';
        import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';
        import { GetFeatureFlagService } from '../../src/application/get-feature-flag.service';
        import { FeatureFlag } from '../../src/domain/feature-flag.entity';

        describe('GetFeatureFlagService', () => {
            let repository: InMemoryFeatureFlagRepository;
            let service: GetFeatureFlagService;

            beforeEach(() => {
                repository = new InMemoryFeatureFlagRepository();
                service = new GetFeatureFlagService(repository);
            });

            it('should retrieve an existing feature flag', async () => {
                const key = 'test-key';
                const featureFlag = new FeatureFlag(key, true, 'Test description');
                await repository.save(featureFlag);

                const result = await service.execute(key);

                expect(result).toEqual(featureFlag);
            });

            it('should throw an error if the feature flag does not exist', async () => {
                const key = 'non-existent-key';

                await expect(service.execute(key)).rejects.toThrow(
                    `Feature flag with key ${key} not found.`
                );
            });
        });