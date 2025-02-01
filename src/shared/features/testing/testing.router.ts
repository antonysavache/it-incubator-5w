import {Router} from "express";
import {testingController} from "./testing.controller";
import {SETTINGS} from "../../../settings";
export const testingRouter = Router({});

testingRouter.delete(SETTINGS.PATH.ALL_DATA, testingController.deleteAll)