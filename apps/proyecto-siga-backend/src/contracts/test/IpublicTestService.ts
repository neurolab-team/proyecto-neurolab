import { PublicTestCard } from "@packages/common-types/test.types";

export interface IPublicTestService {
  getLandingCards(): Promise<PublicTestCard[]>;
}
