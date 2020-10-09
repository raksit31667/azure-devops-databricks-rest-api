import axios from "axios";

export async function getJobByName(name: string, region: string, accessToken: string) {
    const listJobsResponse = await axios.get(
        `https://${region}.azuredatabricks.net/api/2.0/jobs/list`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const jobs: Job[] = listJobsResponse.data.jobs;
    if (!jobs || !jobs.some(job => job.settings.name === name)) {
        throw new Error(`Job ${name} does not exist.`);
    }
    return jobs.filter(job => job.settings.name === name)[0];
}

export async function cancelJobRuns(id: number, region: string, accessToken: string) {
    const listActiveRunsResponse = await axios.get(
        `https://${region}.azuredatabricks.net/api/2.0/jobs/runs/list`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        params: {
            job_id: id,
            active_only: true
        }
    });

    if (!listActiveRunsResponse.data.runs) {
        console.warn(`Skipped cancelling since there is no run on job ${id}`);
        return;
    }
    listActiveRunsResponse.data.runs.forEach(async run => {
        const requestBody = {
            run_id: run.run_id
        };

        await axios.post(`https://${region}.azuredatabricks.net/api/2.0/jobs/runs/cancel`, requestBody, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    });
}
