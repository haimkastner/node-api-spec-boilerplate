import { Delete, Get, Header, Route, Tags, SuccessResponse, Response } from "tsoa";
import { JobFlag, JobFlagHeader, getJob, JobState, removeJob } from "../services/jobs.service";
import { BaseController } from "../infrastructure/base.controller";

@Tags('Jobs')
@Route("jobs")
export class JobsController extends BaseController {

    /**
     * Get the status of a given job
     * @param jobFlag Force operation to NOT be run as job
     * @param jobId The job id to get status of
     * @returns The job status
     */
    @Response(404, 'Job not found')
    @Get('{jobId}')
    public async getJob(@Header(JobFlagHeader) jobFlag: JobFlag.OFF, jobId: string): Promise<JobState> {
        const job = getJob(jobId);

        // If job exists set 404 as status and abort.
        if (!job) {
            this.setStatus(404);
            return {} as any;
        }

        return job;
    }

    /**
     * Remove job from the jobs collection
     * @param jobFlag Force operation to NOT be run as job
     * @param jobId The job id to remove
     */
    @Delete('{jobId}')
    public async removeJob(@Header(JobFlagHeader) jobFlag: JobFlag.OFF, jobId: string): Promise<void> {
        // Remove it...
        removeJob(jobId);
    }
}