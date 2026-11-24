const LOCAL_CLIENT_URL = "http://localhost:5173";

export const getClientUrl = () => {
    const isRender = process.env.RENDER === "true";
    let configuredUrl = process.env.CLIENT_URL?.trim();

    if (isRender && configuredUrl) {
        try {
            const configuredHost = new URL(configuredUrl).hostname;
            if (["localhost", "127.0.0.1", "[::1]"].includes(configuredHost)) {
                configuredUrl = process.env.RENDER_EXTERNAL_URL?.trim();
            }
        } catch {
            // Let the validation below report an invalid CLIENT_URL.
        }
    }

    if (isRender && !configuredUrl) {
        configuredUrl = process.env.RENDER_EXTERNAL_URL?.trim();
    }

    if (!configuredUrl) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("CLIENT_URL or RENDER_EXTERNAL_URL must be configured in production");
        }
        return LOCAL_CLIENT_URL;
    }

    let clientUrl;
    try {
        clientUrl = new URL(configuredUrl);
    } catch {
        throw new Error("CLIENT_URL must be an absolute URL");
    }

    if (
        process.env.NODE_ENV === "production" &&
        (clientUrl.protocol !== "https:" ||
            ["localhost", "127.0.0.1", "[::1]"].includes(clientUrl.hostname))
    ) {
        throw new Error("CLIENT_URL must be the public HTTPS URL in production");
    }

    return clientUrl.toString().replace(/\/+$/, "");
};
