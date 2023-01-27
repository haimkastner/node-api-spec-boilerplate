import { Controller } from "tsoa";

/**
 * The context with some meta about request.
 */
export interface ControllerContext {
    /** The job id, or undefined if it's not a job request */
    jobId?: string;
}

export class BaseController extends Controller {
    /** The request context */
    public context: ControllerContext;
    constructor () {
        super();
        // Init as empty, later it will be injected in the middleware
        this.context = {};
    }
}