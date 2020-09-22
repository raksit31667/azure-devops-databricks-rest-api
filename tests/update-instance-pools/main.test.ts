import { getInstancePoolByName, instancePoolsExist } from "../../src/update-instance-pools/main";

describe("Update instance pools", () => {
    test("should return true when instancePoolsExist given pool with name 'some-pool' exists", () => {
        const pools: InstancePool[] = [
            {
                instance_pool_id: "1",
                instance_pool_name: "another-pool",
                node_type_id: "Standard_DS3_v2",
                min_idle_instances: 2,
                max_capacity: 10,
                idle_instance_autotermination_minutes: 60
            },
            {
                instance_pool_id: "2",
                instance_pool_name: "some-pool",
                node_type_id: "Standard_DS3_v2",
                min_idle_instances: 2,
                max_capacity: 10,
                idle_instance_autotermination_minutes: 60
            },
        ];
        expect(instancePoolsExist(pools, "some-pool")).toEqual(true);
    });

    test("should return false when instancePoolsExist given pool 'some-pool' not exist", () => {
        const pools: InstancePool[] = [
            {
                instance_pool_id: "1",
                instance_pool_name: "another-pool",
                node_type_id: "Standard_DS3_v2",
                min_idle_instances: 2,
                max_capacity: 10,
                idle_instance_autotermination_minutes: 60
            },
            {
                instance_pool_id: "2",
                instance_pool_name: "not-this-pool",
                node_type_id: "Standard_DS3_v2",
                min_idle_instances: 2,
                max_capacity: 10,
                idle_instance_autotermination_minutes: 60
            },
        ];
        expect(instancePoolsExist(pools, "some-pool")).toEqual(false);
    });

    test("should return false when instancePoolsExist given no pools exist", () => {
        const pools: InstancePool[] = [];
        expect(instancePoolsExist(pools, "some-pool")).toEqual(false);
    });

    test("should return instance pool when getInstancePoolByName given name 'some-pool", () => {
        const pools: InstancePool[] = [
            {
                instance_pool_id: "1",
                instance_pool_name: "another-pool",
                node_type_id: "Standard_DS3_v2",
                min_idle_instances: 2,
                max_capacity: 10,
                idle_instance_autotermination_minutes: 60
            },
            {
                instance_pool_id: "2",
                instance_pool_name: "some-pool",
                node_type_id: "Standard_DS3_v2",
                min_idle_instances: 2,
                max_capacity: 10,
                idle_instance_autotermination_minutes: 60
            },
        ];
        expect(getInstancePoolByName(pools, "some-pool")).toEqual({
            instance_pool_id: "2",
            instance_pool_name: "some-pool",
            node_type_id: "Standard_DS3_v2",
            min_idle_instances: 2,
            max_capacity: 10,
            idle_instance_autotermination_minutes: 60
        });
    });
});
