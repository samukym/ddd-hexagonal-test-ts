import "reflect-metadata";
import { Container } from "inversify";
import { IGroupRepository } from "./../../domain/repositories/IGroupRespository.js";
import { TYPES } from "./types.js";
import { InMemoryDb } from "../inMemoryDB/InMemoryDb.js";
import { GroupRespository } from "../data-sources/persistance/group/GroupRepository.js";
import { DeleteExpiredApplicationsAction } from "../../application/applications/DeleteExpiredApplicationsAction.js";

const DIContainer = new Container({ autoBindInjectable: true });

DIContainer.bind<IGroupRepository>(TYPES.GroupRepository).to(GroupRespository);
DIContainer.bind<DeleteExpiredApplicationsAction>(TYPES.DeleteExpiredApplicationsAction).to(DeleteExpiredApplicationsAction)
DIContainer.bind(InMemoryDb).to(InMemoryDb).inSingletonScope();

export default DIContainer;
