export class TimestampService {
    private static timestamp: string | null = null

    static generate(): string {
        if (!this.timestamp) {
            this.timestamp = new Date().toISOString()
        }
        return this.timestamp
    }

    static reset() {
        this.timestamp = null
    }
}