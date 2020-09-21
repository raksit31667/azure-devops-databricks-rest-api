import axios from "axios";
import * as tl from "azure-pipelines-task-lib/task";

export async function run() {
    try {
        const jobNames: string[] | undefined = tl.getInput("jobs", true)?.split(",").map(name => name.trim());
        const region: string | undefined = tl.getInput("region", true);
        const accessToken: string | undefined = tl.getInput("accessToken", true);

        const actualRunningJobs = await axios.get(
            `https://${region}.azuredatabricks.net/api/2.0/jobs/runs/list?active_only=true`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (isEveryJobRunning(actualRunningJobs.data.runs, jobNames)) {
            console.log("Good, all given jobs are running.");
        } else {
            tl.setResult(tl.TaskResult.Failed, "Validation failed. Some jobs are not running :(");
        }
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
