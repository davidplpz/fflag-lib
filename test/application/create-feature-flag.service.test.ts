import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryFeatureFlagRepository } from '../infrastructure/repositories/inmemory.repository';
import { CreateFeatureFlagService } from '../../src/application/create-feature-flag.service';

describe('CreateFeatureFlagService', () => {
    let repository: InMemoryFeatureFlagRepository;
    let service: CreateFeatureFlagService;

    beforeEach(() => {
        repository = new InMemoryFeatureFlagRepository();
        service = new CreateFeatureFlagService(repository);
    });

    it('should successfully create a feature flag', async () => {
        const key = 'test-key';
        const isActive = true;
        const description = 'Test description';

        const featureFlag = await service.execute(key, isActive, description);

        expect(featureFlag.key).toBe(key);
        expect(featureFlag.isActive).toBe(isActive);
        expect(featureFlag.description).toBe(description);

        const savedFlag = await repository.get(key);
        expect(savedFlag).not.toBeNull();
        expect(savedFlag?.key).toBe(key);
        expect(savedFlag?.isActive).toBe(isActive);
        expect(savedFlag?.description).toBe(description);
    });

    it('should throw an error if the feature flag already exists', async () => {
        const key = 'test-key';
        const isActive = true;

        await service.execute(key, isActive);

        await expect(service.execute(key, isActive)).rejects.toThrow(
            `Feature flag with key ${key} already exists.`
        );
    });
});