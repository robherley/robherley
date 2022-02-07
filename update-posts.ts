import { format } from "https://deno.land/std@0.125.0/datetime/mod.ts";

const res = await fetch("https://blog.reb.gg/index.json");
const { items: posts } = await res.json();

const formattedPosts = posts.map((post: any) => {
  const dateFormatted = format(new Date(post.date_published), "MM-dd-yyyy");
  return `- **\`${dateFormatted}\`** · [${post.title}](${post.url})`;
}).splice(0,5);

const FILE_PATH = "./README.md"
const START_TAG = "<!-- STARTBLOG -->";
const END_TAG = "<!-- ENDBLOG -->";

const readme = await Deno.readTextFile(FILE_PATH);

const GUARD_MATCH = new RegExp(String.raw`${START_TAG}[\s\S]*?${END_TAG}`);

const newContent = [START_TAG, ...formattedPosts, END_TAG].join("\n");
const withNewContent = readme.replace(GUARD_MATCH, newContent);

await Deno.writeTextFile(FILE_PATH, withNewContent);
