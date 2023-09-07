import Parser from "rss-parser";
import jsdom from "jsdom";

const parser = new Parser();

export async function getRssText() {
  const feed = await parser.parseURL("https://importai.substack.com/feed");

  const htmlString = feed.items[1]["content:encoded"];

  // console.log(htmlString);

  const dom = new jsdom.JSDOM(htmlString);

  const text = dom.window.document.body.textContent;
  return text;
}
