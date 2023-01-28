import { Body, Header, Post, Route, Tags } from "tsoa";
import sleep from 'sleep-promise';
import { Duration } from 'unitsnet-js';
import { publishProgress, JobFlag, JobFlagHeader } from "../services/jobs.service";
import { BaseController } from "../infrastructure/base.controller";
import { JobOptions } from "../infrastructure/jobify.middleware";

/**
 * Long pong payload
 */
interface LongPong {
    /** The time the action took overall */
    timeTook: number;
}

@Tags('Status')
@Route("status")
export class LongPingController extends BaseController {

    /**
     * Send long ping that can take some time to finished, this operation can be invoked as a job.
     * @param jobFlag The flag whenever run this operation as a job.
     * @returns The operation response payload
     */
    @JobOptions({ timeoutInMs: 1000 * 60 })
    @Post('/long')
    public async longPing(@Header(JobFlagHeader) jobFlag: JobFlag): Promise<LongPong> {

        // Sample the time once the operation starts
        const startedOn = new Date().getTime();
        console.log(`New long ping operation request arrived`);
        // Publish operation status using the job got in context
        publishProgress(this.context.jobId, { percentage: 10, message: 'Starting the process right now' });
        await sleep(Duration.FromSeconds(5).Milliseconds);
        publishProgress(this.context.jobId, { percentage: 50, message: 'We are on the middle of the work' });
        await sleep(Duration.FromSeconds(5).Milliseconds);
        publishProgress(this.context.jobId, { percentage: 95, message: 'We almost done' });
        await sleep(Duration.FromSeconds(2).Milliseconds);
        publishProgress(this.context.jobId, { percentage: 100, message: 'Processing finished' });
        const endedOn = new Date().getTime();

        return {
            timeTook: endedOn - startedOn
        };
    }
}