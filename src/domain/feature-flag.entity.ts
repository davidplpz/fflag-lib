export class FeatureFlag {
    constructor(
        public readonly key: string,
        public isActive: boolean,
        public readonly description?: string
    ) {}

    activate() {
        this.isActive = true;
    }

    deactivate() {
        this.isActive = false;
    }
}