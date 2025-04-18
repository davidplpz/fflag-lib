import {FeatureFlagRepository} from "domain/feature-flag-repository.entity";
import {FeatureFlag} from "domain/feature-flag.entity";

export class CreateFeatureFlagService {
    constructor(
        private readonly repository: FeatureFlagRepository
    ) {}

    async execute(key: string, isActive: boolean, description?: string) {
        const existingFlag = await this.repository.exists(key);
        if (existingFlag) {
            throw new Error(`Feature flag with key ${key} already exists.`);
        }

        const featureFlag = new FeatureFlag(key, isActive, description);
        await this.repository.save(featureFlag);

        return featureFlag;
    }
}