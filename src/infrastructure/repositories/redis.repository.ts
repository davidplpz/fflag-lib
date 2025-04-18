import { RedisClientType } from "redis";
import {FeatureFlagRepository} from "domain/feature-flag-repository.entity";
import {FeatureFlag} from "domain/feature-flag.entity";

export class RedisRepository implements FeatureFlagRepository {
    constructor(private readonly client: RedisClientType) {}

    private getRedisKey(key: string) {
        return `feature_flag:${key}`;
    }

    async get(key: string): Promise<FeatureFlag | null> {
        const data = await this.client.hGetAll(this.getRedisKey(key));
        if (!data || Object.keys(data).length === 0) return null;
        return new FeatureFlag(key, data.isActive === "true", data.description);
    }

    async save(flag: FeatureFlag): Promise<void> {
        await this.client.hSet(this.getRedisKey(flag.key), {
            isActive: flag.isActive.toString(),
            description: flag.description ?? "",
        });
    }

    async delete(key: string): Promise<void> {
        await this.client.del(this.getRedisKey(key));
    }

    async exists(key: string): Promise<boolean> {
        return await this.client.exists(this.getRedisKey(key)) === 1;
    }
}