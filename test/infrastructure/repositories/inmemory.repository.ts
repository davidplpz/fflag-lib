import {FeatureFlagRepository} from "../../../src/domain/feature-flag-repository.entity";
import {FeatureFlag} from "../../../src/domain/feature-flag.entity";

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

    async getAll(): Promise<FeatureFlag[]> {
        return Array.from(this.store.values());
    }

    async getAllActive(): Promise<FeatureFlag[]> {
        return Array.from(this.store.values()).filter(flag => flag.isActive);
    }

    async getAllInactive(): Promise<FeatureFlag[]> {
        return Array.from(this.store.values()).filter(flag => !flag.isActive);
    }
}