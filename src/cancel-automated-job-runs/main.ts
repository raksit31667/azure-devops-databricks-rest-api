import * as tl from "azure-pipelines-task-lib/task";
import { cancelJobRuns, getJobByName } from "../job/job_client";

export async function run() {
    try {
        const jobNames: string[] | undefined = tl.getInput("jobs", true)?.split(",").map(name => name.trim());
        const region: string | undefined = tl.getInput("region", true);
        const accessToken: string | undefined = tl.getInput("accessToken", true);

        jobNames.forEach(async name => {
            const job = await getJobByName(name, region, accessToken);
            cancelJobRuns(job.job_id, region, accessToken);
        });

    } catch (error) {
        tl.setResult(tl.TaskResult.Failed, error);
    }
}

export function isEveryJobRunning(jobRuns: any, expectedJobNames: string[]) {
    if (expectedJobNames.length === 0) {
        return false;
    }
    return jobRuns.filter(job => {
        return expectedJobNames.includes(job.run_name);
    }).length === expectedJobNames.length;
}

run();
