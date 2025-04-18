import {FeatureFlagRepository} from "domain/feature-flag-repository.entity";

export class DeleteFeatureFlagService {
    constructor(
        private readonly repository: FeatureFlagRepository
    ) {}

    async execute(key: string){
        const existingFlag = await this.repository.get(key);
        if (!existingFlag) {
            throw new Error(`Feature flag with key ${key} does not exist.`);
        }

        await this.repository.delete(key);

    }
}