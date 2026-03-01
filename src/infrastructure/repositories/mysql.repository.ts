import { createPool, Pool, PoolOptions } from 'mysql2/promise';
import { FeatureFlagRepository } from '../../domain/feature-flag-repository.entity';
import { FeatureFlag } from '../../domain/feature-flag.entity';

export class MysqlRepository implements FeatureFlagRepository {
    private pool: Pool;

    constructor(config: PoolOptions) {
        this.pool = createPool(config);
    }

    async get(key: string): Promise<FeatureFlag | null> {
        const [rows] = await this.pool.query(
            'SELECT id, description, is_active FROM feature_flags WHERE id = ?',
            [key]
        );

        const resultRows = rows as any[];
        if (resultRows.length === 0) return null;

        const row = resultRows[0];
        // mysql2 returns boolean as 1 or 0 for tinyint(1)
        return new FeatureFlag(row.id, Boolean(row.is_active), row.description);
    }

    async save(flag: FeatureFlag): Promise<void> {
        await this.pool.query(
            `INSERT INTO feature_flags (id, description, is_active, updated_at) 
             VALUES (?, ?, ?, CURRENT_TIMESTAMP)
             ON DUPLICATE KEY UPDATE description = VALUES(description), is_active = VALUES(is_active), updated_at = CURRENT_TIMESTAMP`,
            [flag.key, flag.description || '', flag.isActive]
        );
    }

    async delete(key: string): Promise<void> {
        await this.pool.query('DELETE FROM feature_flags WHERE id = ?', [key]);
    }

    async exists(key: string): Promise<boolean> {
        const [rows] = await this.pool.query(
            'SELECT 1 FROM feature_flags WHERE id = ? LIMIT 1',
            [key]
        );
        return (rows as any[]).length > 0;
    }

    async getAll(): Promise<FeatureFlag[]> {
        const [rows] = await this.pool.query('SELECT id, description, is_active FROM feature_flags');
        return (rows as any[]).map(row => new FeatureFlag(row.id, Boolean(row.is_active), row.description));
    }

    async getAllActive(): Promise<FeatureFlag[]> {
        const [rows] = await this.pool.query('SELECT id, description, is_active FROM feature_flags WHERE is_active = TRUE');
        return (rows as any[]).map(row => new FeatureFlag(row.id, Boolean(row.is_active), row.description));
    }

    async getAllInactive(): Promise<FeatureFlag[]> {
        const [rows] = await this.pool.query('SELECT id, description, is_active FROM feature_flags WHERE is_active = FALSE');
        return (rows as any[]).map(row => new FeatureFlag(row.id, Boolean(row.is_active), row.description));
    }

    async quit(): Promise<void> {
        await this.pool.end();
    }
}
