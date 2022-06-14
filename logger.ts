// deno-lint-ignore-file ban-types

import { throttle, getIngestURL } from './shared.ts';
import { Client } from './client.ts';

const url = getIngestURL();
const throttledSendLogs = throttle(sendLogs, 1000);


let logEvents: object[] = [];

function _log(level: string, message: string, args: object = {}) {
    if (!url) {
        console.warn('axiom: NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT is not defined');
        return;
    }

    const logEvent = {
        level, message,
        _time: new Date(Date.now()).toISOString(),
        fields: Object.keys(args).length > 0 ? args : undefined
    };

    logEvents.push(logEvent);
    throttledSendLogs();
}

export const log = {
    debug: (message: string, args: object = {}) => _log('debug', message, args),
    info: (message: string, args: object = {}) => _log('info', message, args),
    warn: (message: string, args: object = {}) => _log('warn', message, args),
    error: (message: string, args: object = {}) => _log('error', message, args),
    flush: sendLogs,
};

async function sendLogs() {
    if (!logEvents.length) {
        return;
    }

    const client = new Client({ url });
    await client.ingest({
        events: logEvents,
        dataset: 'logs',
    });
    logEvents = [];
}