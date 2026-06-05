const DOWNLOAD_URL = "http://localhost:3000";
let controller = null;
let totalBytes = 0;
let downloadedBytes = 0;
let chunks = [];

const progressBar = document.getElementById("progress");
const totalSpan = document.getElementById("total");
const downloadedSpan = document.getElementById("downloaded");
const percentageSpan = document.getElementById("percentage");

function updateUI() {
    const percentage = totalBytes > 0
        ? ((downloadedBytes / totalBytes) * 100).toFixed(2)
        : 0;

    progressBar.style.width = `${percentage}%`;
    totalSpan.textContent = totalBytes.toLocaleString();
    downloadedSpan.textContent = downloadedBytes.toLocaleString();
    percentageSpan.textContent = percentage;
}

async function download(startByte = downloadedBytes) {
    controller = new AbortController();
    const headers = {};

    if (startByte > 0) {
        headers.Range = `bytes=${startByte}-`; // asginar el rango inciail de bytes
    }

    const response = await fetch(DOWNLOAD_URL, {
        headers,
        signal: controller.signal
    });

    const contentRange = response.headers.get("Content-Range");

    if (contentRange) {
        const total = Number(contentRange.split("/")[1]); // el tamaño total de bytes completos del archivo
        totalBytes = total;
    } else {
        totalBytes = Number(response.headers.get("Content-Length"));// el tamaño total de bytes completos del archivo
        // se obtiene de Content-Length
    }

    console.log({
        contentRange,
        totalBytes
    })

    updateUI();

    const reader = response.body.getReader();

    try {
        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                console.log("Descarga completada");

                const blob = new Blob(chunks, { type: "video/mp4" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");

                a.href = url;
                a.download = "video.mp4";
                a.click();

                URL.revokeObjectURL(url);
                break;
            }

            chunks.push(value);
            downloadedBytes += value.length;

            updateUI();
            console.log(`Bytes descargados: ${downloadedBytes}`);
        }
    } catch (error) {
        if (error.name === "AbortError") {
            console.log(`Descarga pausada en byte ${downloadedBytes}`);
            return;
        }
        throw error;
    }
}

document.getElementById("downloadBtn").addEventListener("click", async () => {
    if (downloadedBytes !== 0) {
        return;
    }

    chunks = [];
    downloadedBytes = 0;

    await download();
});

document.getElementById("pauseBtn").addEventListener("click", () => {
    if (controller) {
        controller.abort();
    }
});

document.getElementById("resumeBtn").addEventListener("click", async () => {
    await download(downloadedBytes);
});
