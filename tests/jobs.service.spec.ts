import { expect } from 'chai';
import { describe } from 'mocha';
import { getJob, JobStatus, removeJob, runNewJob } from '../src/services/jobs.service';
import sleep from 'sleep-promise';
import { Duration } from 'unitsnet-js';

async function testIt(number: number): Promise<number> {
    await sleep(Duration.FromSeconds(0.5).Milliseconds);
    return number * 2;
}

describe('# Jobs Service Tests', () => {

    it('Job should return the expected value on finish', async () => {
        const jobId = runNewJob(() => testIt(5));
        while (true) {
            await sleep(Duration.FromSeconds(0.5).Milliseconds);
            const job = getJob(jobId);
            if (job?.status === JobStatus.DONE) {
                removeJob(jobId);
                expect(job.results).be.equal(10)
                break;
            }
        }
    });
});
