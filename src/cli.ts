import { cac } from "cac";
import * as pkgInfo from "../package.json";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cli = cac("shasum");

console.log(`cli: ${pkgInfo.version}`);
