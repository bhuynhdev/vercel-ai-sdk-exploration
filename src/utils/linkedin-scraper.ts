import puppeteer from "puppeteer";

(async function main() {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      "--deterministic-fetch",
      "--disable-features=IsolateOrigins",
      "--disable-site-isolation-trials"
    ],
    ignoreDefaultArgs: ["--disable-extensions"]
  });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
  });
  await page.goto("https://linkedin.com/in/bhuynhuc", { waitUntil: "networkidle0" });

  // // Set screen size
  // await page.setViewport({ width: 1080, height: 1024 });

  // // Get the name from <h1>
  const heading1 = await page.waitForSelector("h1");
  const name = await heading1?.evaluate((el) => el.innerText);

  console.log(name);

  await page.close();

  await browser.close();
})();

// (async () => {
//   // Launch the browser and open a new blank page
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   // Navigate the page to a URL
//   await page.goto("https://developer.chrome.com/");

//   // Set screen size
//   await page.setViewport({ width: 1080, height: 1024 });

//   // Type into search box
//   await page.type(".search-box__input", "automate beyond recorder");

//   // Wait and click on first result
//   const searchResultSelector = ".search-box__link";
//   await page.waitForSelector(searchResultSelector);
//   await page.click(searchResultSelector);

//   // Locate the full title with a unique string
//   const textSelector = await page.waitForSelector("text/Customize and automate");
//   const fullTitle = await textSelector?.evaluate((el) => el.textContent);

//   // Print the full title
//   console.log('The title of this blog post is "%s".', fullTitle);

//   await browser.close();
// })();
