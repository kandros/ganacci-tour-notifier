import { load } from "cheerio";
import { sendEmail } from "./lib/email";
import { read, write } from "./lib/storage";
import type { TourDate } from "./lib/types";

const url = "https://www.salvatoreganacci.com/old-home";

const html = await fetch(url).then((res) => res.text());
const $ = load(html);

const tourDatesElements = $(".collection-item");

const tourDates: TourDate[] = tourDatesElements
  .map((_, el) => {
    const title = $(el).find(".title-block").text();
    const $content = $(el).find(".widow-content"); /* yes is misspelled */
    const city = $content.find("div > p").text();
    const date = $content.children("p").text();
    return { title, city, date };
  })
  .toArray();

console.log("Next tour dates:");
tourDates.forEach((td) => {
  console.log(`
  ${td.title}
  ${td.city}
  ${td.date}
`);
});

const current = await read("tour-dates.json");
if (current) {
  // store a backup
  await write("tour-dates.old.json", current);
}

await write("tour-dates.json", tourDates);

const hasChanged =
  current && JSON.stringify(current) !== JSON.stringify(tourDates);

if (hasChanged) {
  console.log("Tour dates have changed! notifying with email");
  sendEmail(tourDates);
}
