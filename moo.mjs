import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import cowsay from "cowsay";

const res = await fetch("https://api.quotable.io/random?tags=technology");
if (!res.ok)
  throw new Error(`bad api response: ${res.status}: ${res.statusText}`);
const { content, author } = await res.json();

const cow = cowsay.say({
  text: `${content.match(/\S.{1,40}\S(?= |$)/g).join("\n")}\n\n- ${author}`,
});

console.log(cow);

const filepath = path.join(process.cwd(), "README.md");
const readme = await fs.promises.readFile(filepath, {
  encoding: "utf8",
});

const START_TAG = "<!-- STARTCOW -->";
const END_TAG = "<!-- ENDCOW -->";
const GUARD_MATCH = new RegExp(String.raw`${START_TAG}[\s\S]*?${END_TAG}`);
const withBlocks = [START_TAG, "```", cow, "```", END_TAG].join("\n");
const readmeWithCow = readme.replace(GUARD_MATCH, withBlocks);
await fs.promises.writeFile(filepath, readmeWithCow);
