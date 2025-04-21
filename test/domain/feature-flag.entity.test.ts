import { describe, it, expect } from 'vitest';
import { FeatureFlag } from "../../src/domain/feature-flag.entity";

describe('FeatureFlag', () => {
    it('should initialize correctly with the provided values', () => {
        const featureFlag = new FeatureFlag('test-key', false, 'Test description');
        expect(featureFlag.key).toBe('test-key');
        expect(featureFlag.isActive).toBe(false);
        expect(featureFlag.description).toBe('Test description');
    });

    it('should activate the feature flag', () => {
        const featureFlag = new FeatureFlag('test-key', false);
        featureFlag.activate();
        expect(featureFlag.isActive).toBe(true);
    });

    it('should deactivate the feature flag', () => {
        const featureFlag = new FeatureFlag('test-key', true);
        featureFlag.deactivate();
        expect(featureFlag.isActive).toBe(false);
    });
});