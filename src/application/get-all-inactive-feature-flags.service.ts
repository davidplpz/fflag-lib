import {FeatureFlagRepository} from "domain/feature-flag-repository.entity";

export class GetAllInactiveFeatureFlags {
    constructor(
        private readonly repository: FeatureFlagRepository
    ) {}

    async execute() {
        const featureFlags = await this.repository.getAllInactive();
        if (!featureFlags || featureFlags.length === 0) {
            throw new Error(`No inactive feature flags found.`);
        }

        return featureFlags;
    }
}