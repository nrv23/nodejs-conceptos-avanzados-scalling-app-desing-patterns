import { LocalStorage } from "node-localstorage";
import { mkdirSync, existsSync } from "node:fs";

const SHARDS = 3;
const DATA_DIR = "./data";

if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
}

/*
  Cada shard es una carpeta distinta:

  data/shard_0
  data/shard_1
  data/shard_2

  node-localstorage guarda datos como archivos internos.
*/
const shards = Array.from({ length: SHARDS }, (_, shardId) => {
    return new LocalStorage(`${DATA_DIR}/shard_${shardId}`);
});

/*
  Shard key:

  El id define en qué shard cae el usuario.

  id % 3

  id 1 -> shard 1
  id 2 -> shard 2
  id 3 -> shard 0
*/
export function getShardId(userId) {
    return Number(userId) % SHARDS;
}

export function createUser(user) {
    const shardId = getShardId(user.id);
    const shard = shards[shardId];
    console.log({
        shardId,
        shard
    })
    const userToSave = {
        id: Number(user.id),
        name: user.name,
        email: user.email,
        shardId
    };

    /*
      Guardamos por clave:
  
      user:1
      user:2
      user:3
    */
    shard.setItem(
        `user:${userToSave.id}`,
        JSON.stringify(userToSave)
    );

    return userToSave;
}

export function findUserById(userId) {
    const shardId = getShardId(userId);
    const shard = shards[shardId];

    const data = shard.getItem(`user:${Number(userId)}`);

    if (!data) return null;

    return JSON.parse(data);
}

/*
  Como email NO es nuestra shard key,
  toca buscar en todos los shards.

  Este es el costo de elegir mal o limitado
  el criterio de partición.
*/
export function findUserByEmail(email) {
    for (let shardId = 0; shardId < SHARDS; shardId++) {
        const shard = shards[shardId];

        for (let i = 0; i < shard.length; i++) {
            const key = shard.key(i);

            if (!key.startsWith("user:")) continue;

            const user = JSON.parse(shard.getItem(key));

            if (user.email === email) {
                return user;
            }
        }
    }

    return null;
}

export function findAllUsers() {
    const users = [];

    for (let shardId = 0; shardId < SHARDS; shardId++) {
        const shard = shards[shardId];

        for (let i = 0; i < shard.length; i++) {
            const key = shard.key(i);

            if (!key.startsWith("user:")) continue;

            users.push(JSON.parse(shard.getItem(key)));
        }
    }

    return users;
}