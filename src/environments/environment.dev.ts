// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `index.ts`, but if you do
// `ng build --env=prod` then `index.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import {NgErrorOverlayModule} from "@gewd/ng-utils/ng-error-overlay";
import {DEFAULT_PORT} from "../../server/constants";

export const AppConfig = {
  production: false,
  environment: 'DEV',
  ngModules: [
    NgErrorOverlayModule
  ],
  expressBase: `http://${location.hostname}:${DEFAULT_PORT}`,
  wsBase: `ws://${location.hostname}:${DEFAULT_PORT}`
};
