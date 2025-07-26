import { mutation as rawMutation } from "../_generated/server";
import { customCtx, customMutation } from "convex-helpers/server/customFunctions";
import triggers from "./triggers";

export const threadMutation = customMutation(rawMutation, customCtx(triggers.wrapDB));