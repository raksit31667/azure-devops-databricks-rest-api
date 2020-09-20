import axios from "axios";
import * as tl from "azure-pipelines-task-lib/task";

async function run() {
    try {
        const name: string | undefined = tl.getInput("name", true);
        const nodeTypeId: string | undefined = tl.getInput("nodeTypeId", true);
        const minIdleInstances: string | undefined = tl.getInput("minIdleInstances", true);
        const maxCapacity: string | undefined = tl.getInput("maxCapacity", true);
        const idleInstanceAutoTerminationMinutes: string | undefined = tl.getInput(
            "idleInstanceAutoTerminationMinutes", true);

        const region: string | undefined = tl.getInput("region", true);
        const accessToken: string | undefined = tl.getInput("accessToken", true);

        const listPoolResponse = await axios.get(
            `https://${region}.azuredatabricks.net/api/2.0/instance-pools/list`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        const pools: InstancePool[] = listPoolResponse.data.instance_pools;

        if (!pools || !pools.some(pool => pool.instance_pool_name === name)) {
            tl.setResult(tl.TaskResult.Failed, `Instance pool ${name} not exist`);
        }

        const targetPool: InstancePool = pools.filter(pool => pool.instance_pool_name === name)[0];
        targetPool.node_type_id = nodeTypeId;
        targetPool.min_idle_instances = +minIdleInstances;
        targetPool.max_capacity = +maxCapacity;
        targetPool.idle_instance_autotermination_minutes = +idleInstanceAutoTerminationMinutes;

        await axios.post(
            `https://${region}.azuredatabricks.net/api/2.0/instance-pools/edit`, targetPool, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log(`Instance pool ${name} updated.`);
    } catch (error) {
        tl.setResult(tl.TaskResult.Failed, error);
    }
}

run();
