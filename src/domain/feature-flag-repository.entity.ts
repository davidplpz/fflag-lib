import {FeatureFlag} from "./feature-flag.entity";

export interface FeatureFlagRepository {
    get(key: string): Promise<FeatureFlag | null>;
    save(flag: FeatureFlag): Promise<void>;
    delete(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    getAll(): Promise<FeatureFlag[]>;
    getAllActive(): Promise<FeatureFlag[]>;
    getAllInactive(): Promise<FeatureFlag[]>;
}