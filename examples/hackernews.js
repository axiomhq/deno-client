import { Client } from "../client.ts";

const by = "";
const id = 0;

const q = `
['hackernews']
| where _timde >= now(-90d)
| where ['by'] != "${by}" and ['id'] != ${id}
| extend xType = case (type == "story" and title startswith_cs "Show HN:", "show", type == "story" and title startswith_cs "Ask HN:", "ask", type)
| project title, xType, ref, url
| take 10000
`;

// create main function
if (import.meta.main) {
  const c = new Client();

  try {
    const x = await c.query({
      apl: q,
    });

    console.log(x);

    const dict = {
      "show": [],
      "story": [],
      "comment": [],
      "job": [],
      "ask": [],
    };

    x.matches.forEach((s) => {
      dict[s.data.xType].push({
        ...s.data,
        time: s._time,
      });
    });

    console.log(dict);
  } catch (e) {
    console.log(e);
  }
}
