import express from "express";

import {
    createUser,
    findUserById,
    findUserByEmail,
    findAllUsers
} from "./db.js";

const app = express();

app.use(express.json());

app.post("/users", (req, res) => {
    const { id, name, email } = req.body;

    if (!id || !name || !email) {
        return res.status(400).json({
            message: "id, name and email are required"
        });
    }

    const user = createUser({ id, name, email });

    res.status(201).json({
        message: "User created",
        user
    });
});

app.get("/users/:id", (req, res) => {
    const user = findUserById(req.params.id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);
});

app.get("/users/email/:email", (req, res) => {
    const user = findUserByEmail(req.params.email);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    res.json(user);
});

app.get("/users", (req, res) => {
    res.json(findAllUsers());
});

app.listen(3000, () => {
    console.log("Sharding API running on http://localhost:3000");
});