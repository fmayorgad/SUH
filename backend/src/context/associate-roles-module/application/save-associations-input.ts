export class SaveAssociationsInput {
  readonly #profileId: string;
  readonly #moduleId: string;
  readonly #permissionId: string;

  constructor(profileId: string, moduleId: string, permissionId: string) {
    this.#profileId = profileId;
    this.#moduleId = moduleId;
    this.#permissionId = permissionId;
  }

  get profileId(): string {
    return this.#profileId;
  }

  get moduleId(): string {
    return this.#moduleId;
  }

  get permissionId(): string {
    return this.#permissionId;
  }
}
