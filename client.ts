// deno-lint-ignore-file ban-types

const env = Deno.env.toObject();
const defaultAxiomEndpoint = "https://cloud.axiom.co";

interface IngestOptions {
    timestampField?: string;
    timestampFormat?: string;
    csvDelimiter?: string;
}

interface IngestInput {
    events: object[];
    dataset: string;
    // options?: IngestOptions;
}

interface IngestStatus {
    ingested: number;
    failed: number;
    failuers: string[];
    processedBytes: number;
    blocksCreated: number;
    walLength: number;
}


interface QueryInput {
    dataset: string;
    startTime?: Date;
    endTime?: Date;
    apl: string;
    option?: Map<string, string>;
    //datasetMap?: Map<string, string>;
}

interface QueryOutput {
    request: object,
    status: object,
    matches: object[],
    buckets: {
        series: object[],
        totals: object[],
    },
    datasetNames: string[],
    // fieldsMetaMap: object,
}

export class Client {
    private url: string;
    private apiToken?: string;

    constructor(params?: { url?: string, apiToken?: string; }) {
        this.url = params?.url ?? env.AXIOM_URL ?? defaultAxiomEndpoint;
        this.apiToken = params?.apiToken ?? env.AXIOM_TOKEN;
    }

    async ingest(params: IngestInput): Promise<IngestStatus> {
        const url = new URL(this.url);
        url.pathname = `/api/v1/datasets/${params.dataset}/ingest`;

        const body = JSON.stringify(params.events);

        const headers = {
            "Content-Type": "application/json",
            "User-Agent": "axiom-deno",
            "Authorization": `Bearer ${this.apiToken}`,
        };

        const resp = await fetch(url.toString(), {
            method: "POST",
            headers: headers,
            body,
        });

        const status = await resp.json();

        return {
            ingested: status.ingested,
            failed: status.failed,
            failuers: status.failuers,
            processedBytes: status.processedBytes,
            blocksCreated: status.blocksCreated,
            walLength: status.walLength,
        };
    }


    async query(params: QueryInput): Promise<QueryOutput> {
        const url = new URL(this.url);
        url.pathname = `/api/v1/datasets/_apl`;
        url.searchParams.set("format", "legacy");

        for (const [key, value] of params.option?.entries() ?? []) {
            url.searchParams.set(key, value);
        }

        const headers = {
            "Content-Type": "application/json",
            "User-Agent": "axiom-deno",
            "Authorization": `Bearer ${this.apiToken}`,
        };

        const body = JSON.stringify({
            startTime: params.startTime?.toISOString(),
            endTime: params.endTime?.toISOString(),
            apl: params.apl,
        });

        const resp = await fetch(url.toString(), {
            method: "POST",
            headers: headers,
            body,
        });

        const res = await resp.json();

        return {
            request: res.request,
            status: res.status,
            matches: res.matches,
            buckets: res.buckets,
            datasetNames: res.datasetNames,
        };
    }
}