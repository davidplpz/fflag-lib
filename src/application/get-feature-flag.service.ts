import {FeatureFlagRepository} from "domain/feature-flag-repository.entity";

export class GetFeatureFlagService {
    constructor(
        private readonly repository: FeatureFlagRepository
    ) {}

    async execute(key: string) {
        const featureFlag = await this.repository.get(key);
        if (!featureFlag) {
            throw new Error(`Feature flag with key ${key} not found.`);
        }

        return featureFlag;
    }
}