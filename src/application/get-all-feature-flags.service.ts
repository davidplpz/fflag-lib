import {FeatureFlagRepository} from "domain/feature-flag-repository.entity";

export class GetAllFeatureFlagsService {
    constructor(
        private readonly repository: FeatureFlagRepository
    ) {}

    async execute() {
        const featureFlags = await this.repository.getAll();
        if (!featureFlags || featureFlags.length === 0) {
            throw new Error(`No feature flags found.`);
        }

        return featureFlags;
    }
}