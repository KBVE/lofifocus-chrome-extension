import type { PlasmoMessaging } from "@plasmohq/messaging"

const validateResponse = (response) => {
    try {
        JSON.parse(response)
        return false
    } catch (e) {
        return true
    }
}

const fetchCommand = (url, res) => {
    fetch(
        "https://functions.webenclave.com/webhook/generate-music",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url
            })
        }
    ).then(async fetchRes => {
        const message = await fetchRes.text();

        if (!validateResponse(message)) {
            fetchCommand(url, res)
        } else {
            res.send(message);
        }
    })
}

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    chrome.tabs.query({
        active: true, lastFocusedWindow: true
    }, tabs => {
        const url = tabs[0].url
        fetchCommand(url, res)
    })
}

export default handler;