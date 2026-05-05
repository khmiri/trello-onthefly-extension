chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "AUTH") {
        const redirectUri = chrome.identity.getRedirectURL();

        const authUrl = `https://trello.com/1/authorize?expiration=never&name=TrelloSidebar&scope=read,write&response_type=token&key=${request.apiKey}&return_url=${encodeURIComponent(redirectUri)}`;

        chrome.identity.launchWebAuthFlow(
            {
                url: authUrl,
                interactive: true
            },
            (redirectUrl) => {
                if (chrome.runtime.lastError) {
                    console.error("Auth error:", chrome.runtime.lastError);
                    sendResponse({ success: false });
                    return;
                }

                if (!redirectUrl) {
                    console.error("No redirect URL returned");
                    sendResponse({ success: false });
                    return;
                }

                console.log("Redirect URL:", redirectUrl);

                const hash = redirectUrl.split("#")[1];
                const params = new URLSearchParams(hash);
                const token = params.get("token");

                if (token) {
                    chrome.storage.local.set({ trello_token: token }, () => {
                        sendResponse({ success: true });
                    });
                } else {
                    console.error("Token missing in redirect");
                    sendResponse({ success: false });
                }
            }
        );

        return true; // async response
    }
});