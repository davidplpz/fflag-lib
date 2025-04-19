import {FeatureFlagRepository} from "domain/feature-flag-repository.entity";

export class DeactivateFeatureFlagService {
    constructor(
        private readonly repository: FeatureFlagRepository
    ) {}

    async execute(id: string) {
        const featureFlag = await this.repository.get(id);
        if (!featureFlag) {
            throw new Error(`Feature flag with id ${id} not found`);
        }
        featureFlag.deactivate();
        await this.repository.save(featureFlag);

        return featureFlag;
    }
}