import {Redis} from "ioredis";
import {CreateFeatureFlagService} from "application/create-feature-flag.service";
import {DeleteFeatureFlagService} from "application/delete-feature-flag.service";
import {GetFeatureFlagService} from "application/get-feature-flag.service";
import {DeactivateFeatureFlagService} from "application/deactivate-feature-flag.service";
import {RedisRepository} from "infrastructure/repositories/redis.repository";
import {ActivateFeatureFlagService} from "application/activate-feature-flag.service";
import {GetAllFeatureFlagsService} from "application/get-all-feature-flags.service";
import {GetAllActiveFeatureFlagsService} from "application/get-all-active-feature-flags.service";
import {GetAllInactiveFeatureFlags} from "application/get-all-inactive-feature-flags.service";

export class ManagerService {
    private static instance: ManagerService;
    private readonly createService: CreateFeatureFlagService;
    private readonly deleteService: DeleteFeatureFlagService;
    private readonly getService: GetFeatureFlagService;
    private readonly deactivateService: DeactivateFeatureFlagService;
    private readonly activateService: ActivateFeatureFlagService;
    private readonly getAllService: GetAllFeatureFlagsService;
    private readonly getActivatedService: GetAllActiveFeatureFlagsService;
    private readonly getInactiveService: GetAllInactiveFeatureFlags;

    private constructor(redisClient: Redis) {
        const repository = new RedisRepository(redisClient);
        this.createService = new CreateFeatureFlagService(repository);
        this.deleteService = new DeleteFeatureFlagService(repository);
        this.getService = new GetFeatureFlagService(repository);
        this.deactivateService = new DeactivateFeatureFlagService(repository);
        this.activateService = new ActivateFeatureFlagService(repository);
        this.getAllService = new GetAllFeatureFlagsService(repository);
        this.getActivatedService = new GetAllActiveFeatureFlagsService(repository);
        this.getInactiveService = new GetAllInactiveFeatureFlags(repository);
    }

    public static getInstance(redisClient: Redis): ManagerService {
        if (!ManagerService.instance) {
        ManagerService.instance = new ManagerService(redisClient);
        }
        return ManagerService.instance;
    }

    async createFlag(key: string, isActive: boolean, description: string) {
        return this.createService.execute(key, isActive, description);
    }

    async deleteFlag(key: string) {
        return this.deleteService.execute(key);
    }

    async getFlag(key: string) {
        return this.getService.execute(key);
    }

    async deactivateFlag(key: string) {
        return this.deactivateService.execute(key);
    }

    async activateFlag(key: string) {
        return this.activateService.execute(key);
    }

    async getAllFlags() {
        return this.getAllService.execute();
    }

    async getActivatedFlags() {
        return this.getActivatedService.execute();
    }

    async getInactiveFlags() {
        return this.getInactiveService.execute();
    }
}