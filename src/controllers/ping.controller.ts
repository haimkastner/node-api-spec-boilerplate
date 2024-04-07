import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
    Tags,
} from "tsoa";

interface Ping {
    /** Who is the request caller (free text) */
    whois: string;
}

interface Pong {
    /** The greeting message arrived from the API caller */
    greeting: string;
    /** The time when the ping request arrived */
    time: number;
}

@Tags('Status')
@Route("status")
export class PingController extends Controller {

    /**
     * Send Ping request to API server.
     * @param greeting The greeting to send :)
     * @param ping The ping payload
     * @returns A Pong object
     */
    @Post()
    public async ping(@Query() greeting: string, @Body() ping?: Ping): Promise<Pong> {

        console.log(`New ping arrived from "${ping?.whois}" who greet us with "${greeting}" :)`);
        return {
            greeting,
            time: new Date().getTime(),
        };
    }

    /**
     * Send Ping request to API server 22.
     * @param greeting The greeting to send :)
     * @param ping The ping payload
     * @returns A Pong object
     */
    @Post('2')
    public async ping2(@Query() greeting: string, @Body() ping?: Ping): Promise<Pong> {

        console.log(`New ping arrived from "${ping?.whois}" who greet us with "${greeting}" :)`);
        return {
            greeting: '2',
            time: new Date().getTime(),
        };
    }
}
