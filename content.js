function calculatePlaylistDuration() {
    const timeElements = document.querySelectorAll(
        "ytd-thumbnail-overlay-time-status-renderer span"
    );

    if (timeElements.length === 0) {
        return "No videos found in the playlist.";
    }

    let totalSeconds = 0;

    timeElements.forEach((el) => {
        const timeParts = el.textContent.trim().split(":").map(Number);
        if (timeParts.length === 3) {
            totalSeconds += timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2];
        } else if (timeParts.length === 2) {
            totalSeconds += timeParts[0] * 60 + timeParts[1];
        }
    });

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
}

function displayDurationOnPage(duration) {
    const existingResult = document.getElementById("playlist-duration-result");
    if (existingResult) {
        existingResult.remove();
    }

    const resultDiv = document.createElement("div");
    resultDiv.id = "playlist-duration-result";
    resultDiv.textContent = `Total Playlist Duration: ${duration}`;
    resultDiv.style.position = "fixed";
    resultDiv.style.bottom = "80px";
    resultDiv.style.right = "20px";
    resultDiv.style.padding = "10px 15px";
    resultDiv.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    resultDiv.style.color = "white";
    resultDiv.style.borderRadius = "8px";
    resultDiv.style.zIndex = "9999";
    resultDiv.style.fontSize = "16px";
    resultDiv.style.fontFamily = "Arial, sans-serif";

    document.body.appendChild(resultDiv);

    setTimeout(() => {
        resultDiv.remove();
    }, 5000);
}

function addFloatingButton() {
    if (document.getElementById("calculate-playlist-button")) return;

    const button = document.createElement("button");
    button.id = "calculate-playlist-button";
    button.textContent = "⏰";
    button.title = "Calculate Playlist Duration";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.width = "50px";
    button.style.height = "50px";
    button.style.borderRadius = "50%";
    button.style.backgroundColor = "#ff0000";
    button.style.color = "white";
    button.style.border = "none";
    button.style.zIndex = "9999";
    button.style.cursor = "pointer";
    button.style.fontSize = "24px";
    button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";

    button.addEventListener("click", () => {
        const duration = calculatePlaylistDuration();
        displayDurationOnPage(duration);
    });

    document.body.appendChild(button);
}

function removeFloatingButton() {
    const button = document.getElementById("calculate-playlist-button");
    if (button) button.remove();
}

function handlePageChange() {
    const isPlaylistPage = window.location.href.includes("youtube.com/playlist?");
    if (isPlaylistPage) {
        addFloatingButton();
    } else {
        removeFloatingButton();
    }
}

function observePageChanges() {
    let lastUrl = window.location.href;

    // Observe DOM mutations to detect URL changes
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            handlePageChange();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize the button when the content script loads
handlePageChange();
observePageChanges();
