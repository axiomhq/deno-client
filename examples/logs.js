import { log } from '../logger.ts';

// create main function
if (import.meta.main) {
    log.error("this is an error");
    log.warn("this is a warning");
    log.info("this is an info");
    log.debug("this is a debug");
    const res = await log.flush();
    console.log(res);
}