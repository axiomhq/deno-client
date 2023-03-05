# axiom-deno

Send events and logs easily to Axiom from deno

## Guide

1. Create an account at [Axiom Cloud](http://cloud.axiom.co)
2. Create a dataset and an API token with ingest permission for that dataset
3. Export the env variables `AXIOM_DATASET` and `AXIOM_TOKEN`
4. Follow the examples to send [events](examples/events.ts) and/or [logs](examples/logs.ts)