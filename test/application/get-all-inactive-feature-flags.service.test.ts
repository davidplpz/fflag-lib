import { describe, it, expect, beforeEach } from 'vitest';
        import { GetAllInactiveFeatureFlags } from '../../src/application/get-all-inactive-feature-flags.service';
        import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';
        import { FeatureFlag } from '../../src/domain/feature-flag.entity';

        describe('GetAllInactiveFeatureFlags', () => {
            let repository: InMemoryFeatureFlagRepository;
            let service: GetAllInactiveFeatureFlags;

            beforeEach(() => {
                repository = new InMemoryFeatureFlagRepository();
                service = new GetAllInactiveFeatureFlags(repository);
            });

            it('should return inactive feature flags', async () => {
                const inactiveFlag = new FeatureFlag('flag1', false, 'desc1');
                const activeFlag = new FeatureFlag('flag2', true, 'desc2');
                await repository.save(inactiveFlag);
                await repository.save(activeFlag);

                const result = await service.execute();

                expect(result).toEqual([inactiveFlag]);
            });

            it('should throw an error if there are no inactive feature flags', async () => {
                const activeFlag = new FeatureFlag('flag1', true, 'desc1');
                await repository.save(activeFlag);

                await expect(service.execute()).rejects.toThrow('No inactive feature flags found.');
            });
        });