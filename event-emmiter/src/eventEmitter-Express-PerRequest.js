import express from "express";
import EventEmitter from "events";

const app = express();

class RequestProcessor extends EventEmitter {

    process() {

        // simulamos proceso async
        setTimeout(() => {

            this.emit("progress", 25);

            setTimeout(() => {

                this.emit("progress", 50);

                setTimeout(() => {

                    this.emit("progress", 100);

                    this.emit("finish", {
                        success: true
                    });

                }, 500);

            }, 500);

        }, 500);

        return this;
    }
}

app.get("/process", (req, res) => {

    // NUEVA instancia por request
    const processor = new RequestProcessor();

    // listeners SOLO para esta request
    const onProgress = (percent) => {
        console.log(`Request ${req.url}: ${percent}%`);
    };

    const onFinish = (result) => {

        console.log("Finished:", result);

        // responder al cliente
        res.json(result);

        // cleanup
        processor.off("progress", onProgress);
        processor.off("finish", onFinish);
    };

    processor.on("progress", onProgress);

    processor.once("finish", onFinish);

    processor.process();
});

app.listen(3000, () => {
    console.log("Server running");
});