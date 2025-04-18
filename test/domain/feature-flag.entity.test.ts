import { describe, it, expect } from 'vitest';
import { FeatureFlag } from '../../src';

describe('FeatureFlag', () => {
    it('debería inicializar correctamente con los valores proporcionados', () => {
        const featureFlag = new FeatureFlag('test-key', false, 'Descripción de prueba');
        expect(featureFlag.key).toBe('test-key');
        expect(featureFlag.isActive).toBe(false);
        expect(featureFlag.description).toBe('Descripción de prueba');
    });

    it('debería activar el feature flag', () => {
        const featureFlag = new FeatureFlag('test-key', false);
        featureFlag.activate();
        expect(featureFlag.isActive).toBe(true);
    });

    it('debería desactivar el feature flag', () => {
        const featureFlag = new FeatureFlag('test-key', true);
        featureFlag.deactivate();
        expect(featureFlag.isActive).toBe(false);
    });
});