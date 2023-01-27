import { Duration } from 'unitsnet-js';
import { v4 as uuidV4 } from 'uuid';
import { timeout } from 'promise-timeout';

/**
 * The job flag, mark whenever the operation should be executed as a job or not
 */
export enum JobFlag {
    ON = 'ON',
    OFF = 'OFF',
}

/**
 * The header name for the job flag, for the header context @see JobFlag
 */
export const JobFlagHeader = 'x-job-flag'

/** Job status */
export enum JobStatus {
    DONE = 'DONE',
    STARTED = 'STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    FAILED = 'FAILED',
}

/** The job execution options */
export interface JobOptions {
    timeoutInMs?: number;
}

/** The job progress status */
export interface JobProgress {
    /** The job progress in % */
    percentage: number;
    message?: string;
}

/** The job state */
export interface JobState {
    jobId: string;
    /** Job starting timestamp in EPOCH */
    startedOn: number;
    /** Job finished timestamp in EPOCH, undefined if not finished yet */
    finishedOn?: number;
    /** The job status */
    status: JobStatus,
    /** The job results payload, undefined if not yet finished */
    results?: any;
    /** The job progress */
    progress: JobProgress;
}

/** A job in the system */
interface Job {
    // The job execution options
    options: JobOptions;
    /** The job operation to invoke */
    operation: () => any;
    /** The job state */
    jobState: JobState;
}

// The jobs collection. 
const jobs: { [id in string]: Job } = {};

// The interval of the 
let garbageJobCollectorHandler: NodeJS.Timer | undefined;

function activateGarbageJobCollector() {
    // If it's already running, do nothing.
    if (garbageJobCollectorHandler) {
        return;
    }

    // Run the interval abd keep the handler
    garbageJobCollectorHandler = setInterval(() => {
        const nowInMs = new Date().getTime();

        // If jobs collection is empty
        if (!Object.keys(jobs).length) {
            clearInterval(garbageJobCollectorHandler);
            garbageJobCollectorHandler = undefined;
            return;
        }

        // Iterate on all jobs
        for (const [jobId, job] of Object.entries(jobs)) {
            // If it's not finished yet, skip.
            if (!job?.jobState?.finishedOn) {
                continue;
            }

            const now = Duration.FromMilliseconds(nowInMs);
            const finishedOn = Duration.FromMilliseconds(job?.jobState?.finishedOn);
            const timePassed = now.subtract(finishedOn);

            // If 1 hour passed since job finished, remove it from the jobs collection.
            if (timePassed.Hours > 1) {
                delete jobs[jobId];
            }
        }
    }, Duration.FromMinutes(0.1).Milliseconds);
}

/**
 * Execute operation
 * @param jobId The job id to execute
 */
async function executeJob(jobId: string) {
    const job = jobs[jobId];
    try {
        // Mark job status as IN_PROGRESS
        job!.jobState!.status = JobStatus.IN_PROGRESS;
        // Execute operation in a timeout and keep results
        job!.jobState!.results = await timeout(job.operation() as any, job!.options!.timeoutInMs as number);
        // Mark job status as DONE
        job!.jobState!.status = JobStatus.DONE;
    } catch (error) {
        job!.jobState!.status = JobStatus.FAILED;
    }
    // Set progress and take finishedOn timestamp
    job!.jobState!.progress!.percentage = 100;
    job!.jobState!.finishedOn = new Date().getTime();
}

/**
 * Add & execute a new job
 * @param operation The operation to execute
 * @param options The job options
 * @returns The newly created job id
 */
export function runNewJob(operation: () => any, options?: JobOptions): string {
    // Create a new job id
    const newJobId = uuidV4();

    // Prepare the job props
    const newJob: Job = {
        operation,
        jobState: {
            jobId: newJobId,
            status: JobStatus.STARTED,
            startedOn: new Date().getTime(),
            progress: { message: '', percentage: 0 },
        },
        options: {
            timeoutInMs: Duration.FromMinutes(2).Milliseconds,
            ...options // Override by given options
        },
    }
    // Add the job to the collection
    jobs[newJobId] = newJob;

    // Add the operation to be executed in the next Node tick
    setImmediate(() => {
        executeJob(newJobId); // Executed the job
        activateGarbageJobCollector(); // Activate jobs collector, if not yet run.
    });

    return newJobId;
}

/**
 * Publish a new update on a job progress
 * @param jobId The job id
 * @param jobProgress The progress
 */
export function publishProgress(jobId: string | undefined, jobProgress: JobProgress) {
    const job = jobs[jobId || ''];
    // If job not exists, abort. 
    if (!job) {
        console.log(`[publishProgress] Job ${jobId} does not exists `);
        return;
    }
    console.log(`[publishProgress] Job ${jobId} got new progress: ${jobProgress.percentage}% message:${jobProgress.message || ''} `);
    job.jobState.progress = jobProgress;
}

/**
 * Get job state by id
 * @param jobId The job id
 * @returns The @see JobState or undefined if not exists
 */
export function getJob(jobId: string): JobState | undefined {
    return jobs[jobId]?.jobState;
}

/**
 * Remove the job from the jobs collection
 * @param jobId The job id to remove
 */
export function removeJob(jobId: string) {
    delete jobs[jobId];
}
