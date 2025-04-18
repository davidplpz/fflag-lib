import {FeatureFlagRepository} from "domain/feature-flag-repository.entity";

export class ActivateFeatureFlagService {
    constructor(
        private readonly repository: FeatureFlagRepository
    ) {}

    async activateFeatureFlag(id: string) {
        const featureFlag = await this.repository.get(id);
        if (!featureFlag) {
            throw new Error(`Feature flag with id ${id} not found`);
        }
        featureFlag.activate();
        await this.repository.save(featureFlag);

        return featureFlag;
    }
}
