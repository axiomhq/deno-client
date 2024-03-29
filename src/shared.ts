// deno-lint-ignore-file ban-types
export const isBrowser = typeof window !== 'undefined';

export enum EndpointType {
    webVitals = 'web-vitals',
    logs = 'logs',
}

export function getIngestURL() {
    const ingestEndpoint = Deno.env.get('AXIOM_URL') ?? 'https://cloud.axiom.co';
    const url = new URL(ingestEndpoint);
    return url.toString();
};

export function throttle(fn: Function, wait: number) {
    let lastFn: ReturnType<typeof setTimeout>, lastTime: number;
    // deno-lint-ignore no-explicit-any
    return function (this: any) {
        // deno-lint-ignore no-this-alias
        const context = this,
            args = arguments;

        // First call, set lastTime
        if (lastTime == null) {
            lastTime = Date.now();
        }

        clearTimeout(lastFn);
        lastFn = setTimeout(() => {
            if (Date.now() - lastTime >= wait) {
                fn.apply(context, args);
                lastTime = Date.now();
            }
        }, Math.max(wait - (Date.now() - lastTime), 0));
    };
};