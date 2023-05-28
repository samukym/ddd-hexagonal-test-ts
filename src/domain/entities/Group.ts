import { UUID } from "../../types/types.js";
import { Application } from "./Application.js";

export class Group {
  id: UUID;
  applications: Array<Application>;
  label?: string;

  private constructor(id: UUID, label?: string, applications: Array<Application> = []) {
    this.id = id;
    this.applications = applications;
    this.label = label;
  }

  static createGroup(id: UUID, label?: string, applications: Array<Application> = []) {
    return new Group(id, label, applications);
  }
}
