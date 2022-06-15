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
    options?: IngestOptions;
}

export class Client {
    private url: string;
    private apiToken?: string;

    constructor(params?: { url?: string, apiToken?: string; }) {
        this.url = params?.url ?? env.AXIOM_URL ?? defaultAxiomEndpoint;
        this.apiToken = params?.apiToken ?? env.AXIOM_TOKEN;
    }

    async ingest(params: IngestInput): Promise<Response> {
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
        return resp;
    }
}
