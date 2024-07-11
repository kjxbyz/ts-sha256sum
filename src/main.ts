import { globSync } from "glob";
import { createHash, type HashOptions } from "node:crypto";
import {
  createReadStream,
  writeFileSync,
  readFileSync,
  type PathOrFileDescriptor,
  type WriteFileOptions,
  type ObjectEncodingOptions,
} from "node:fs";

export type HashFileTuple = [string, string];
export type HashFileVerifiedTuple = [string, boolean];

export default shasum;

export async function verify(
  pattern: string | string[],
  previous: HashFileTuple[],
  algorithm: string = "sha256",
  hashOptions?: HashOptions,
  options?: BufferEncoding,
): Promise<HashFileVerifiedTuple[]> {
  const current = Object.fromEntries(
    (await shasum(pattern, algorithm, hashOptions, options)).map(([a, b]) => [
      b,
      a,
    ]),
  );
  return previous.reduce<HashFileVerifiedTuple[]>(
    (accumulator: HashFileVerifiedTuple[], [sum, file]: HashFileTuple) => {
      accumulator.push([file, sum == current[file] ? true : false]);
      return accumulator;
    },
    [],
  );
}

export async function shasum(
  pattern: string | string[],
  algorithm: string = "sha256",
  hashOptions?: HashOptions,
  options?: BufferEncoding,
): Promise<HashFileTuple[]> {
  return await Promise.all(
    (await files(pattern)).map(async (item: string) => [
      await checksum(item, algorithm, hashOptions, options),
      item,
    ]),
  );
}

export function writeToFile(
  file: PathOrFileDescriptor,
  data: HashFileTuple[],
  options?: WriteFileOptions,
) {
  const content = data.map(
    ([sha256, path]: HashFileTuple) => `${sha256}  ${path}`,
  );
  writeFileSync(file, content.join("\n"), options);
}

export function readFromFile(
  file: PathOrFileDescriptor,
  options?:
    | (ObjectEncodingOptions & {
        flag?: string | undefined;
      })
    | BufferEncoding
    | null,
  encoding?: BufferEncoding,
): HashFileTuple[] {
  let data = readFileSync(file, options);
  if (Buffer.isBuffer(data)) {
    data = data.toString(encoding);
  }

  return (
    data
      ?.split("\n")
      ?.reduce<
        HashFileTuple[]
      >((accumulator: HashFileTuple[], currentValue: string) => {
        accumulator.push(currentValue.split("  ") as HashFileTuple);
        return accumulator;
      }, []) || []
  );
}

function checksum(
  location: string,
  algorithm: string,
  hashOptions?: HashOptions,
  options?: BufferEncoding,
): Promise<string> {
  return new Promise(function (resolve, reject) {
    const hash = createHash(algorithm, hashOptions);
    const input = createReadStream(location, options);
    input.on("readable", () => {
      const data = input.read();
      if (data) {
        hash.update(data);
      } else {
        resolve(hash.digest("hex"));
      }
    });
    input.on("error", (error) => {
      reject(error);
    });
  });
}

function files(pattern: string | string[]): Promise<string[]> {
  return new Promise(function (resolve, reject) {
    try {
      const files = globSync(pattern, {});
      resolve(files);
    } catch (error) {
      reject(error);
    }
  });
}
