import {AppInit} from "./src/shared/app-init";

beforeAll(async () => {
    const appInit = new AppInit();

    await appInit.init()
})