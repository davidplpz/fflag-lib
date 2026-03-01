import { Pool, PoolConfig } from 'pg';
import { FeatureFlagRepository } from '../../domain/feature-flag-repository.entity';
import { FeatureFlag } from '../../domain/feature-flag.entity';

export class PostgresRepository implements FeatureFlagRepository {
    private pool: Pool;

    constructor(config: PoolConfig) {
        this.pool = new Pool(config);
    }

    async get(key: string): Promise<FeatureFlag | null> {
        const result = await this.pool.query(
            'SELECT id, description, is_active FROM feature_flags WHERE id = $1',
            [key]
        );

        if (result.rows.length === 0) return null;

        const row = result.rows[0];
        return new FeatureFlag(row.id, row.is_active, row.description);
    }

    async save(flag: FeatureFlag): Promise<void> {
        await this.pool.query(
            `INSERT INTO feature_flags (id, description, is_active, updated_at) 
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
             ON CONFLICT (id) 
             DO UPDATE SET description = EXCLUDED.description, is_active = EXCLUDED.is_active, updated_at = CURRENT_TIMESTAMP`,
            [flag.key, flag.description || '', flag.isActive]
        );
    }

    async delete(key: string): Promise<void> {
        await this.pool.query('DELETE FROM feature_flags WHERE id = $1', [key]);
    }

    async exists(key: string): Promise<boolean> {
        const result = await this.pool.query(
            'SELECT 1 FROM feature_flags WHERE id = $1 LIMIT 1',
            [key]
        );
        return result.rows.length > 0;
    }

    async getAll(): Promise<FeatureFlag[]> {
        const result = await this.pool.query('SELECT id, description, is_active FROM feature_flags');
        return result.rows.map((row: any) => new FeatureFlag(row.id, row.is_active, row.description));
    }

    async getAllActive(): Promise<FeatureFlag[]> {
        const result = await this.pool.query('SELECT id, description, is_active FROM feature_flags WHERE is_active = true');
        return result.rows.map((row: any) => new FeatureFlag(row.id, row.is_active, row.description));
    }

    async getAllInactive(): Promise<FeatureFlag[]> {
        const result = await this.pool.query('SELECT id, description, is_active FROM feature_flags WHERE is_active = false');
        return result.rows.map((row: any) => new FeatureFlag(row.id, row.is_active, row.description));
    }

    async quit(): Promise<void> {
        await this.pool.end();
    }
}
