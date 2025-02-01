import {AbstractRepository} from "./base/abstract.repository";

export class RepositoriesManager {
    private static repositories: AbstractRepository<any>[] = [];

    static register(repository: AbstractRepository<any>) {
        this.repositories.push(repository);
    }

    static async initRepositories() {
        for (const repository of this.repositories) {
            repository.init();
        }
    }
}