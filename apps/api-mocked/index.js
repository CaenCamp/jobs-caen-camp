const organization = require('./db/organization');
const job = require('./db/job');

module.exports = () => {
    const data = { organizations: [], jobs: [] };

    for (let i = 0; i < 10; i++) {
        const fakeOrganization = organization.fake(i);

        for (let j = 0; j < 3; j++) {
            const fakeJob = job.fake(j, fakeOrganization);
            data.jobs.push(fakeJob);

            organization.addJob(fakeOrganization, fakeJob);
        }

        data.organizations.push(fakeOrganization);
    }

    return data;
};
