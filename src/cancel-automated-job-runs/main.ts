import * as tl from "azure-pipelines-task-lib/task";
import { cancelJobRuns, getJobByName } from "../job/job_client";

export async function run() {
    try {
        const jobNames: string[] | undefined = tl.getInput("jobs", true)?.split(",").map(name => name.trim());
        const region: string | undefined = tl.getInput("region", true);
        const accessToken: string | undefined = tl.getInput("accessToken", true);

        jobNames.forEach(async name => {
            console.log(`Cancelling all runs for job ${name}`);
            const job = await getJobByName(name, region, accessToken);
            cancelJobRuns(job.job_id, region, accessToken);
        });

    } catch (error) {
        tl.setResult(tl.TaskResult.Failed, error);
    }
}

run();
