/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ResendOTP from "../ResendOTP.js";
import type * as admin from "../admin.js";
import type * as auth from "../auth.js";
import type * as builders from "../builders.js";
import type * as bulkBuilderImport from "../bulkBuilderImport.js";
import type * as debug from "../debug.js";
import type * as exhibitions from "../exhibitions.js";
import type * as gmbIntegration from "../gmbIntegration.js";
import type * as http from "../http.js";
import type * as leads from "../leads.js";
import type * as locations from "../locations.js";
import type * as quotes from "../quotes.js";
import type * as siteSettings from "../siteSettings.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ResendOTP: typeof ResendOTP;
  admin: typeof admin;
  auth: typeof auth;
  builders: typeof builders;
  bulkBuilderImport: typeof bulkBuilderImport;
  debug: typeof debug;
  exhibitions: typeof exhibitions;
  gmbIntegration: typeof gmbIntegration;
  http: typeof http;
  leads: typeof leads;
  locations: typeof locations;
  quotes: typeof quotes;
  siteSettings: typeof siteSettings;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
