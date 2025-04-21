import { describe, it, expect, beforeEach } from 'vitest';
                import { GetAllFeatureFlagsService } from '../../src/application/get-all-feature-flags.service';
                import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';
                import { FeatureFlag } from '../../src/domain/feature-flag.entity';

                describe('GetAllFeatureFlagsService', () => {
                    let repository: InMemoryFeatureFlagRepository;
                    let service: GetAllFeatureFlagsService;

                    beforeEach(() => {
                        repository = new InMemoryFeatureFlagRepository();
                        service = new GetAllFeatureFlagsService(repository);
                    });

                    it('should return all feature flags', async () => {
                        const flag1 = new FeatureFlag('flag1', true, 'desc1');
                        const flag2 = new FeatureFlag('flag2', false, 'desc2');
                        await repository.save(flag1);
                        await repository.save(flag2);

                        const result = await service.execute();

                        expect(result).toEqual([flag1, flag2]);
                    });

                    it('should throw an error if there are no feature flags', async () => {
                        await expect(service.execute()).rejects.toThrow('No feature flags found.');
                    });
                });