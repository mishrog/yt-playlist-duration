document.getElementById("calculate-btn").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        // Check if the user is on YouTube
        if (!activeTab.url.includes("youtube.com/playlist")) {
            document.getElementById("result").textContent =
                "Error: Please navigate to a YouTube playlist page.";
            return;
        }

        // Inject the content script dynamically
        chrome.scripting.executeScript(
            {
                target: { tabId: activeTab.id },
                files: ["content.js"],
            },
            () => {
                if (chrome.runtime.lastError) {
                    document.getElementById("result").textContent =
                        "Error: Unable to inject content script.";
                    return;
                }

                // Send message to content script
                chrome.tabs.sendMessage(activeTab.id, { action: "calculateDuration" });
            }
        );
    });
});
