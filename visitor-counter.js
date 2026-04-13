async function loadVisitorCount() {
    const counterElement = document.getElementById("visitor-count");

    if (!counterElement) {
        return;
    }

    const configuredApiUrl = counterElement.dataset.apiUrl;
    const isLocalHost =
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1" ||
        window.location.hostname === "";
    const apiUrl = configuredApiUrl || (isLocalHost
        ? "http://localhost:7071/api/GetResumeCounter"
        : "/api/GetResumeCounter");

    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { "Accept": "application/json" }
        });

        if (!response.ok) {
            throw new Error("Counter request failed.");
        }

        const data = await response.json();
        counterElement.textContent = typeof data.count === "number" ? String(data.count) : "Unavailable";
    } catch (error) {
        console.error("Unable to load visitor count.", error);
        counterElement.textContent = "Unavailable";
    }
}

loadVisitorCount();
