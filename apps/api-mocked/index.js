const organization = require('./db/organization');
const offer = require('./db/offer');

module.exports = () => {
    const data = { organizations: [], offers: [] };

    for (let i = 0; i < 10; i++) {
        const fakeOrganization = organization.fake(i);

        for (let j = 0; j < 3; j++) {
            const fakeOffer = offer.fake(j, fakeOrganization);
            data.offers.push(fakeOffer);

            organization.addOffer(fakeOrganization, fakeOffer);
        }

        data.organizations.push(fakeOrganization);
    }

    return data;
};
