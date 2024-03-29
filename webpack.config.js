const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ReplaceInFileWebpackPlugin = require("replace-in-file-webpack-plugin");
const WebpackCommon = require("./webpack.common.config");

const Target = WebpackCommon.GetTargetPath();

const Settings = {
    "production": {
        Tag: "",
        TaskGuid: "3a377eb1-bc1c-49ff-9eb0-61c57ce60f30",
    },
    "development": {
        Tag: "Dev",
        TaskGuid: "56161162-c7ee-4082-99b1-2e0102c7f829",
    }
    // Can add more flavors here as needed. For example, a flavor for pre-production
};

module.exports = env => {

    const validEnvs = Object.keys(Settings);
    if (!validEnvs.includes(env)) {
        console.error(`BUILD_ENV not set correctly. Allowed values are: ${validEnvs.join(", ")}`);
        process.exit(1);
    }

    const tasks = ['verify-all-jobs-running', 'update-instance-pools', 'cancel-automated-job-runs'];
    return tasks.map(task => {
        const config = {

            entry: {
                "main": `./src/${task}/main.ts`,
            },
    
            plugins: [
                new CopyWebpackPlugin([
                    // These files are needed by azure-pipelines-task-lib library.
                    {
                        from: path.resolve("./node_modules/azure-pipelines-task-lib/lib.json"),
                        to: path.join(Target, task)
                    },
                    {
                        from: path.resolve("./node_modules/azure-pipelines-task-lib/Strings"),
                        to: path.join(Target, task)
                    },
    
                    {
                        from: path.join(__dirname, `./src/${task}/task.json`),
                        to: path.join(Target, task)
                    },
                    {
                        from: path.join(__dirname, "./images/icon.png"),
                        to: path.join(Target, task, "icon.png")
                    },
                    {
                        from: path.join(__dirname, "./manifests/base.json"),
                        to: Target
                    },
                    {
                        from: path.join(__dirname, "./manifests", `${env}.json`),
                        to: Target
                    },
                    {
                        from: path.join(__dirname, "./images/icon.png"),
                        to: Target
                    },
                    {
                        from: path.join(__dirname, "./README.md"),
                        to: Target
                    }
                ]),
    
                WebpackCommon.PackageJsonLoadFixer(Target, [
                    `${task}/main.js`,
                ]),
    
                WebpackCommon.VersionStringReplacer(Target, [
                    `${task}/task.json`,
                    "base.json"
                ]),
    
                new ReplaceInFileWebpackPlugin([
                    {
                        dir: Target,
                        files: [
                            `${task}/main.js`,
                            `${task}/task.json`,
                            "base.json"
                        ],
                        rules: [
                            // This replacement is required to allow azure-pipelines-task-lib to load the 
                            // json resource file correctly
                            {
                                search: /__webpack_require__\(.*\)\(resourceFile\)/,
                                replace: 'require(resourceFile)'
                            },
                            {
                                search: /{{taskid}}/ig,
                                replace: Settings[env].TaskGuid
                            },
                            {
                                search: /{{tag}}/ig,
                                replace: Settings[env].Tag
                            }
                        ]
                    }
                ])
            ],
        };
    
        return WebpackCommon.FillDefaultNodeSettings(config, env, task);
    });
};
