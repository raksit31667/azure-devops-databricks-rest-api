# Azure DevOps Databricks REST API

![Azure Databricks](./images/icon.png)

## Introduction

This repository contains an Azure DevOps extension for interacting with Azure Databricks via [REST API](https://docs.databricks.com/dev-tools/api/latest/index.html). It supports Databricks management on clusters, jobs, and instance pools.  

You may find this extension **useful** when:
- You are running Spark (structured) streaming jobs attached to automated clusters.
- You are leveraging instance pools for [fast startup time](https://databricks.com/blog/2019/11/11/databricks-pools-speed-up-data-pipelines.html) and scalability.

You may find this extension **useless** when:
- You are running Spark jobs on an interactive clusters, or running on scheduled manner.
- You are running jobs via Jupyter notebooks.

## Getting started

- Install an extension via <https://marketplace.visualstudio.com/items?itemName=raksit31667.azure-devops-databricks-rest-api>.
- Add Azure DevOps task similar as a code snippet below:

```yaml
- task: VerifyAllDatabricksJobRunning@1
displayName: Verify Databricks jobs
inputs:
    jobs: '<your-job-name-here>'
    region: 'your-region-here>'
    accessToken: '<your-databricks-access-token>'
```

Note that every task requires **region** and **access token**. You can find a region from your 
Databricks workspace URL (e.g. <https://southcentralus.azuredatabricks.net/?o=0000000>). For access token, you can generate via **User Settings**, see an instruction <https://docs.databricks.com/dev-tools/api/latest/authentication.html>.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
