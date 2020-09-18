import axios from "axios";
import * as tl from "azure-pipelines-task-lib/task";

async function run() {
    try {
        const jobs: string[] | undefined = tl.getInput("jobs", true)?.split(",").map(name => name.trim());
        const region: string | undefined = tl.getInput("region", true);
        const accessToken: string | undefined = tl.getInput("accessToken", true);

        const actualRunningJobs = await axios.get(
            `https://${region}.azuredatabricks.net/api/2.0/jobs/runs/list?active_only=true`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (actualRunningJobs.data.runs.map((job: { run_name: string; }) => jobs?.includes(job.run_name))) {
            console.log("Good, all given jobs are running.");
        } else {
            tl.setResult(tl.TaskResult.Failed, "Validation failed. Some jobs are not running :(");
        }
    } catch (error) {
        tl.setResult(tl.TaskResult.Failed, error);
    }
}

run();
