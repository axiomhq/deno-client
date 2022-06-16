import { Client } from "../client.ts";

const env = Deno.env.toObject();

// create main function
if (import.meta.main) {
  const c = new Client();

  const ev1 = {
    _time: new Date(Date.now()).toISOString(),
    a: 1,
    b: "foo",
    c: {
      "bla": "blub",
    },
  };

  const ev2 = {
    _time: new Date(Date.now()).toISOString(),
    a: 2,
    b: "bar",
  };

  const resp = await c.ingest({
    events: [ev1, ev2],
    dataset: env.AXIOM_DATASET,
  });

  console.log(resp);

  const x = await c.query({
    dataset: env.AXIOM_DATASET,
    apl:
      "['deno'] | where _time > now(-1d) | summarize count() by bin_auto(_time)",
  });

  console.log(x);
}
