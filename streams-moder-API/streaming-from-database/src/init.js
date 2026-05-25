import { faker } from '@faker-js/faker';
import sqlit3 from 'sqlite3';
import { promisify } from 'node:util';

const connection = sqlit3.verbose();
const db = new connection.Database("./data/db");
const promisifiedSerialized = promisify(db.serialize.bind(db));
const promisifiedRun = promisify(db.run.bind(db));

function buildFakeUser() {
    const user = {
        name: faker.internet.username(),
        age: faker.number.int({ min: 22, max: 120 })
    };

    return [user.name, user.age];
}

await promisifiedSerialized;

await promisifiedRun("CREATE TABLE  users(name TEXT, age NUMBER)");

const promises = [];

for (let i = 0; i < 100; i++) {

    const user = buildFakeUser();
    promises.push(promisifiedRun(`INSERT INTO users(name, age) values(${user.map(_ => "?").join(",")})`, user));
}

await Promise.all(promises);

