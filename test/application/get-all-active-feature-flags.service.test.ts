import { describe, it, expect, beforeEach } from 'vitest';
        import { GetAllActiveFeatureFlagsService } from '../../src/application/get-all-active-feature-flags.service';
        import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';
        import { FeatureFlag } from '../../src/domain/feature-flag.entity';

        describe('GetAllActiveFeatureFlagsService', () => {
            let repository: InMemoryFeatureFlagRepository;
            let service: GetAllActiveFeatureFlagsService;

            beforeEach(() => {
                repository = new InMemoryFeatureFlagRepository();
                service = new GetAllActiveFeatureFlagsService(repository);
            });

            it('should return active feature flags', async () => {
                const activeFlag = new FeatureFlag('flag1', true, 'desc1');
                const inactiveFlag = new FeatureFlag('flag2', false, 'desc2');
                await repository.save(activeFlag);
                await repository.save(inactiveFlag);

                const result = await service.execute();

                expect(result).toEqual([activeFlag]);
            });

            it('should throw an error if there are no active feature flags', async () => {
                const inactiveFlag = new FeatureFlag('flag1', false, 'desc1');
                await repository.save(inactiveFlag);

                await expect(service.execute()).rejects.toThrow('No active feature flags found.');
            });
        });