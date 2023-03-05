import { Client } from "../mod.ts";

const AXIOM_DATASET = Deno.env.get("AXIOM_DATASET");
if (!AXIOM_DATASET) throw new Error(`You have to set the env var: AXIOM_DATASET for this example!`)

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
    dataset: AXIOM_DATASET,
  });

  console.log(resp);

  const x = await c.query({
    dataset: AXIOM_DATASET,
    apl:
      "['deno'] | where _time > now(-1d) | summarize count() by bin_auto(_time)",
  });

  console.log(x);
}
