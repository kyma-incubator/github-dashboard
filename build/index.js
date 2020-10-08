const fs = require('fs');

function main(filename) {
  // [START bigquery_query]
  // [START bigquery_client_default_credentials]
  // Import the Google Cloud client library using default credentials
  const { BigQuery } = require("@google-cloud/bigquery");
  const options = {
    // keyFilename: './service_account.json',
    credentials: JSON.parse(process.env.SERVICE_ACCOUNT) || {},
    projectId: 'sap-kyma-vvcloud-dev',
  };
  const bigquery = new BigQuery(options);
  // [END bigquery_client_default_credentials]
  async function query() {
    // Queries the U.S. given names dataset for the state of Texas.

    const query = `
    SELECT
      *
    FROM
      \`sap-kyma-vvcloud-dev.kyma_github_stats.all_agregated\`
    ORDER BY
      date ASC
    `;

    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
      query: query,
      // Location must match that of the dataset(s) referenced in the query.
      location: "US",
    };

    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();
    fs.writeFileSync(filename || '../test.json', JSON.stringify(rows, null, 2))
    
  }
  // [END bigquery_query]
  try {
    query();
  } catch (error) {
    console.error(error)
  }
}
main(...process.argv.slice(2));
