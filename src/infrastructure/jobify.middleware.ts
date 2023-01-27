import { JobFlag, JobFlagHeader, runNewJob } from "../services/jobs.service";
import { BaseController } from "./base.controller";

export interface JobInfo {
    jobId: string;
}

/**
 * "Jobify" operation by getting the request, controller and the operation method, and executing it as a job if required.
 * This function will be called by the generated TSOA routes before and operation execution.
 * @param request The HTTP request called by consumer
 * @param controller The controller instance created for this operation 
 * @param method The method in the controller to execute to run the operation
 * @param args The method args to execute with.
 * @returns 
 */
export async function jobify(request: any, controller: BaseController, method: () => any, args: any) : Promise<any | JobInfo> {
    // Read the job flag header
    const jobFlag = request?.headers?.[JobFlagHeader] as JobFlag;
    if (jobFlag !== JobFlag.ON) {
        // If it's not marked as a job, just run it with any additional logic.
        return method.apply(controller, args);
    }
    // Add the operation execution as a new job. 
    const jobId = runNewJob(() => method.apply(controller, args));
    // Inject the new created jod id to the controller context
    controller.context = { jobId };
    // Set job flag as ON to be send back to the consumer. 
    controller.setHeader(JobFlagHeader, JobFlag.ON)
    // Return to express the @see JobInfo instead the original operation return payload. 
    return {
        jobId
    } as JobInfo;
}