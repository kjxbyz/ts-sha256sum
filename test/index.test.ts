import { sep } from "path";
import { test, assert } from "vitest";
import {
  shasum,
  // writeToFile,
  // readFromFile,
  verify,
  type HashFileTuple,
  type HashFileVerifiedTuple,
} from "../src";

const sha256sumContent: HashFileTuple[] = [
  [
    "31de1b83be7cad0d6a5222ce771f6bbf5b4139b98358449bca9c93b7fd220adf",
    `test${sep}data${sep}b.txt`,
  ],
  [
    "f7679f192cb75a5be4cfc1f24a3dd9840078df1b27c82d2d6757a273c610d455",
    `test${sep}data${sep}a.txt`,
  ],
];

const sha256sumVerifiedContent: HashFileVerifiedTuple[] = [
  [`test${sep}data${sep}b.txt`, true],
  [`test${sep}data${sep}a.txt`, true],
];

test("shasum", async () => {
  const sha256sum = await shasum("test/**/*.txt");
  // writeToFile("./SHASUMS256.txt", sha256sum);
  console.log(sha256sum);

  // const dataFromFile = readFromFile("./SHASUMS256.txt");
  // console.log(dataFromFile);

  assert.deepEqual(sha256sum, sha256sumContent);
});

test("verify", async () => {
  const sha256sumVerified = await verify("test/**/*.txt", sha256sumContent);
  console.log(sha256sumVerified);
  assert.deepEqual(sha256sumVerified, sha256sumVerifiedContent);
});
