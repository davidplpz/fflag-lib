import { FeatureFlagRepository } from '../../../src';
import { FeatureFlag } from '../../../src'

export class InMemoryFeatureFlagRepository implements FeatureFlagRepository {
    private readonly store: Map<string, FeatureFlag> = new Map();

    async get(key: string): Promise<FeatureFlag | null> {
        return this.store.get(key) || null;
    }

    async save(flag: FeatureFlag): Promise<void> {
        this.store.set(flag.key, flag);
    }

    async delete(key: string): Promise<void> {
        this.store.delete(key);
    }

    async exists(key: string): Promise<boolean> {
        return this.store.has(key);
    }
}