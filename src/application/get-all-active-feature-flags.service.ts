import {FeatureFlagRepository} from "domain/feature-flag-repository.entity";

export class GetAllActiveFeatureFlagsService {
    constructor(
        private readonly repository: FeatureFlagRepository
    ) {}

    async execute() {
        const featureFlags = await this.repository.getAllActive();
        if (!featureFlags || featureFlags.length === 0) {
            throw new Error(`No active feature flags found.`);
        }

        return featureFlags;
    }
}