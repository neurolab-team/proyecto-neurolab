export type DependencyStatus = "up" | "down";

export interface HealthReport {
  status: "ok" | "degraded";
  version: string;
  uptime: number;
  timestamp: string;
  dependencies: {
    database: DependencyStatus;
    redis: DependencyStatus;
  };
}

export interface IHealthService {
  check(): Promise<HealthReport>;
}
