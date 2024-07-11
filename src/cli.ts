import { cac } from "cac";
import { shasum, verify, writeToFile, readFromFile } from "./main";
import * as pkgInfo from "../package.json";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cli = cac("shasum");

// global options
interface GlobalCLIOptions {
  "--"?: string[];
  algorithm?: string;
}

cli
  .command("create <entry> [...files]", "Compute SHA256 message digest.")
  .option(
    "--algorithm <algorithm>",
    "The `algorithm` is dependent on the available algorithms supported by the version of OpenSSL on the platform. Examples are `'sha256'`, `'sha512'`, etc. On recent releases of OpenSSL, `openssl list -digest-algorithms` will display the available digest algorithms. (default: sha256) ",
    { default: "sha256" },
  )
  .action(async (entry: string, files: string[], options: GlobalCLIOptions) => {
    console.debug(files, options);

    try {
      const shasumContent = await shasum(files, options.algorithm);
      console.warn(shasumContent);
      writeToFile(entry, shasumContent);
      console.log("Saved successfully");
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

cli
  .command("verify <entry> [...files]", "Check SHA256 message digest.")
  .option(
    "--algorithm <algorithm>",
    "The `algorithm` is dependent on the available algorithms supported by the version of OpenSSL on the platform. Examples are `'sha256'`, `'sha512'`, etc. On recent releases of OpenSSL, `openssl list -digest-algorithms` will display the available digest algorithms. (default: sha256) ",
    { default: "sha256" },
  )
  .action(async (entry: string, files: string[], options: GlobalCLIOptions) => {
    console.debug(entry, files, options);

    try {
      const dataFromFile = readFromFile(entry);
      const shasumVerified = await verify(
        files,
        dataFromFile,
        options.algorithm,
      );
      console.warn(shasumVerified);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

cli.help();
cli.version(pkgInfo.version);

cli.parse();
