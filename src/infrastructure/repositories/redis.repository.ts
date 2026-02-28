import { Redis } from "ioredis";
import { FeatureFlagRepository } from "domain/feature-flag-repository.entity";
import { FeatureFlag } from "domain/feature-flag.entity";

export class RedisRepository implements FeatureFlagRepository {
    private subscriber: Redis;
    private cache = new Map<string, FeatureFlag | null>();
    private readonly cacheChannel = "fflags_updates";

    constructor(private readonly client: Redis) {
        this.subscriber = this.client.duplicate();
        this.subscriber.subscribe(this.cacheChannel).catch(console.error);
        this.subscriber.on("message", (channel, message) => {
            if (channel === this.cacheChannel) {
                if (message === "ALL") {
                    this.cache.clear();
                } else {
                    this.cache.delete(message);
                }
            }
        });
    }

    private getRedisKey(key: string) {
        return `feature_flag:${key}`;
    }

    async get(key: string): Promise<FeatureFlag | null> {
        if (this.cache.has(key)) {
            return this.cache.get(key) as FeatureFlag | null;
        }

        const data = await this.client.hgetall(this.getRedisKey(key));
        if (!data || Object.keys(data).length === 0) {
            this.cache.set(key, null);
            return null;
        }

        const flag = new FeatureFlag(key, data.isActive === "true", data.description);
        this.cache.set(key, flag);
        return flag;
    }

    async save(flag: FeatureFlag): Promise<void> {
        await this.client.hset(this.getRedisKey(flag.key), {
            isActive: flag.isActive.toString(),
            description: flag.description ?? "",
        });

        this.cache.set(flag.key, flag);
        await this.client.publish(this.cacheChannel, flag.key);
    }

    async delete(key: string): Promise<void> {
        await this.client.del(this.getRedisKey(key));

        this.cache.delete(key);
        await this.client.publish(this.cacheChannel, key);
    }

    async exists(key: string): Promise<boolean> {
        if (this.cache.has(key)) {
            return this.cache.get(key) !== null;
        }
        return (await this.client.exists(this.getRedisKey(key))) === 1;
    }

    async getAll(): Promise<FeatureFlag[]> {
        const matchingKeys: string[] = [];
        let cursor = "0";

        do {
            const [nextCursor, keys] = await this.client.scan(cursor, "MATCH", "feature_flag:*", "COUNT", 100);
            cursor = nextCursor;
            matchingKeys.push(...keys);
        } while (cursor !== "0");

        if (matchingKeys.length === 0) return [];

        const pipeline = this.client.pipeline();
        for (const key of matchingKeys) {
            pipeline.hgetall(key);
        }

        const results = await pipeline.exec();
        const featureFlags: FeatureFlag[] = [];

        if (results) {
            for (let i = 0; i < matchingKeys.length; i++) {
                const [err, data] = results[i];
                if (!err && data && Object.keys(data as any).length > 0) {
                    const flagKey = matchingKeys[i].replace("feature_flag:", "");
                    const flag = new FeatureFlag(flagKey, (data as any).isActive === "true", (data as any).description);
                    featureFlags.push(flag);
                    this.cache.set(flagKey, flag);
                }
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

    async quit(): Promise<void> {
        this.subscriber.disconnect();
    }
}