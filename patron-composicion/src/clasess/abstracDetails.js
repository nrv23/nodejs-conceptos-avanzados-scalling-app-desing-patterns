


class AbstractDetails {

    printDetails() {
        throw new Error('Method "printDetails" must be implemented');
    }

    get total() {
        throw new Error('Method "total" must be implemented');
    }
}

module.exports = AbstractDetails;
