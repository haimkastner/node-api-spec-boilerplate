import { JobFlag, JobFlagHeader, runNewJob , JobOptions as JobOptionsObject } from "../services/jobs.service";
import { BaseController } from "./base.controller";

export interface JobInfo {
    jobId: string;
}

/** Hold job option per operation name */
const predefinedJobOptions : { [operation in string]: JobOptionsObject } = {};

/**
 * Set predefined job option annotation.
 * @param options The job options to defined.
 */
export const JobOptions = (options: JobOptionsObject) : Function => ((target: any, operationName: string) => {
    // The operation name is a unique name given to every API call. 
    predefinedJobOptions[operationName] = options;
})

/**
 * "Jobify" operation by getting the request, controller and the operation method, and executing it as a job if required.
 * This function will be called by the generated TSOA routes before and operation execution.
 * @param request The HTTP request called by consumer
 * @param controller The controller instance created for this operation 
 * @param method The method in the controller to execute to run the operation
 * @param args The method args to execute with.
 * @param operationName The operation name key.
 * @returns 
 */
export async function jobify(request: any, controller: BaseController, method: () => any, args: any, operationName: string) : Promise<any | JobInfo> {
    // Read the job flag header
    const jobFlag = request?.headers?.[JobFlagHeader] as JobFlag;
    if (jobFlag !== JobFlag.ON) {
        // If it's not marked as a job, just run it with any additional logic.
        return method.apply(controller, args);
    }
    // Add the operation execution as a new job. 
    const jobId = runNewJob(() => method.apply(controller, args), predefinedJobOptions[operationName]);
    // Inject the new created jod id to the controller context
    controller.context = { jobId };
    // Set job flag as ON to be send back to the consumer. 
    controller.setHeader(JobFlagHeader, JobFlag.ON)
    // Return to express the @see JobInfo instead the original operation return payload. 
    return {
        jobId
    } as JobInfo;
}