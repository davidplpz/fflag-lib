import { Redis } from "ioredis";
import { FeatureFlagRepository } from "domain/feature-flag-repository.entity";
import { FeatureFlag } from "domain/feature-flag.entity";

export class RedisRepository implements FeatureFlagRepository {
    constructor(private readonly client: Redis) {}

    private getRedisKey(key: string) {
        return `feature_flag:${key}`;
    }

    async get(key: string): Promise<FeatureFlag | null> {
        const data = await this.client.hgetall(this.getRedisKey(key));
        if (!data || Object.keys(data).length === 0) return null;
        return new FeatureFlag(key, data.isActive === "true", data.description);
    }

    async save(flag: FeatureFlag): Promise<void> {
        await this.client.hset(this.getRedisKey(flag.key), {
            isActive: flag.isActive.toString(),
            description: flag.description ?? "",
        });
    }

    async delete(key: string): Promise<void> {
        await this.client.del(this.getRedisKey(key));
    }

    async exists(key: string): Promise<boolean> {
        return (await this.client.exists(this.getRedisKey(key))) === 1;
    }

    async getAll(): Promise<FeatureFlag[]> {
        const keys = await this.client.keys("feature_flag:*");
        const featureFlags: FeatureFlag[] = [];

        for (const key of keys) {
            const data = await this.client.hgetall(key);
            if (data && Object.keys(data).length > 0) {
                const flagKey = key.replace("feature_flag:", "");
                featureFlags.push(new FeatureFlag(flagKey, data.isActive === "true", data.description));
            }
        }
        return featureFlags;
    }

    async getAllActive(): Promise<FeatureFlag[]> {
        const allFlags = await this.getAll();
        return allFlags.filter(flag => flag.isActive);
    }

    async getAllInactive(): Promise<FeatureFlag[]> {
        const allFlags = await this.getAll();
        return allFlags.filter(flag => !flag.isActive);
    }
}