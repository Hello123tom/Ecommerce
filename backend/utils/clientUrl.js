const LOCAL_CLIENT_URL = "http://localhost:5173";

export const getClientUrl = () => {
    const configuredUrl = process.env.CLIENT_URL?.trim();
    if (!configuredUrl) {
        if (process.env.NODE_ENV === "production") {
            throw new Error("CLIENT_URL must be configured in production");
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
