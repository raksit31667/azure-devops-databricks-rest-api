import { isEveryJobRunning } from "../../src/verify-all-jobs-running/main";

describe("Verify all jobs running", () => {
    test("should return true when isEveryJobRunning given every job name exist in actual runs", () => {
        const jobRuns = [
            {
                run_name: "some-job"
            },
            {
                run_name: "another-job"
            },
        ];
        const jobNames = ["some-job", "another-job"];
        expect(isEveryJobRunning(jobRuns, jobNames)).toEqual(true);
    });

    test("should return false when isEveryJobRunning given some job name not exist in actual runs", () => {
        const jobRuns = [
            {
                run_name: "some-job"
            },
        ];
        const jobNames = ["some-job", "another-job"];
        expect(isEveryJobRunning(jobRuns, jobNames)).toEqual(false);
    });

    test("should return false when isEveryJobRunning given every actual run is unavailable", () => {
        const jobRuns = [];
        const jobNames = ["some-job", "another-job"];
        expect(isEveryJobRunning(jobRuns, jobNames)).toEqual(false);
    });

    test("should return false when isEveryJobRunning given no job names", () => {
        const jobRuns = [
            {
                run_name: "some-job"
            },
            {
                run_name: "another-job"
            },
        ];
        const jobNames = [];
        expect(isEveryJobRunning(jobRuns, jobNames)).toEqual(false);
    });
});
