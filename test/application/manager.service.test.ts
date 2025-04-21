import { describe, it, expect, beforeEach } from 'vitest';
import { ManagerService } from '../../src';
import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';
import { FeatureFlag } from '../../src/domain/feature-flag.entity';
import { Redis } from 'ioredis';

describe('ManagerService', () => {
    let repository: InMemoryFeatureFlagRepository;
    let managerService: ManagerService;

    beforeEach(() => {
        repository = new InMemoryFeatureFlagRepository();
        const redisClient = {} as Redis;
        managerService = ManagerService.getInstance(redisClient);
        (managerService as any).createService['repository'] = repository;
        (managerService as any).deleteService['repository'] = repository;
        (managerService as any).getService['repository'] = repository;
        (managerService as any).deactivateService['repository'] = repository;
    });

    it('should create a feature flag', async () => {
        const key = 'test-key';
        const description = 'Test feature flag';
        const isActive = true;

        const result = await managerService.createFlag(key, isActive, description);

        expect(result.key).toBe(key);
        expect(result.isActive).toBe(isActive);
        expect(result.description).toBe(description);

        const savedFlag = await repository.get(key);
        expect(savedFlag).toBeDefined();
        expect(savedFlag?.isActive).toBe(isActive);
    });

    it('should retrieve an existing feature flag', async () => {
        const key = 'test-key';
        const featureFlag = new FeatureFlag(key, true, 'Test feature flag');
        await repository.save(featureFlag);

        const result = await managerService.getFlag(key);

        expect(result).toBeDefined();
        expect(result.key).toBe(key);
        expect(result.isActive).toBe(true);
    });

    it('should delete an existing feature flag', async () => {
        const key = 'test-key';
        const featureFlag = new FeatureFlag(key, true, 'Test feature flag');
        await repository.save(featureFlag);

        await managerService.deleteFlag(key);

        const deletedFlag = await repository.get(key);
        expect(deletedFlag).toBeNull();
    });

    it('should deactivate an existing feature flag', async () => {
        const key = 'test-key';
        const featureFlag = new FeatureFlag(key, true, 'Test feature flag');
        await repository.save(featureFlag);

        await managerService.deactivateFlag(key);

        const updatedFlag = await repository.get(key);
        expect(updatedFlag?.isActive).toBe(false);
    });

    it('should throw an error when trying to retrieve a non-existent feature flag', async () => {
        const key = 'non-existent-key';

        await expect(managerService.getFlag(key)).rejects.toThrow(
            `Feature flag with key ${key} not found`
        );
    });
});