import app from "./app.js";
import dotenv from "dotenv";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { v2 as cloudinary } from "cloudinary";
import Stripe from 'stripe';

if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: "backend/config/config.env" });
}


let server;
let shuttingDown = false;
let shutdownPromise;
let shutdownExitCode = 0;
let startupPromise;


cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})



const shutdown = (reason, exitCode = 0) => {
    if (exitCode !== 0) {
        shutdownExitCode = exitCode;
    }
    if (shutdownPromise) {
        return shutdownPromise;
    }

    shuttingDown = true;
    console.log(`Shutting down server: ${reason}`);

    shutdownPromise = (async () => {
        await startupPromise?.catch(() => { });

        try {
            if (server?.listening) {
                await new Promise((resolve, reject) => {
                    server.close((error) => error ? reject(error) : resolve());
                });
            }
        } catch (error) {
            console.error(`Failed to close HTTP server: ${error.message}`);
            shutdownExitCode = 1;
        }

        try {
            await disconnectDatabase();
            console.log("Database connection closed");
        } catch (error) {
            console.error(`Failed to close database connection: ${error.message}`);
            shutdownExitCode = 1;
        }

        process.exitCode = shutdownExitCode;
    })();

    return shutdownPromise;
};

process.on("uncaughtException", (error) => {
    console.error(`Uncaught exception: ${error.stack || error.message}`);
    void shutdown("uncaught exception", 1);
});

process.on("unhandledRejection", (reason) => {
    console.error(`Unhandled promise rejection: ${reason?.stack || reason}`);
    void shutdown("unhandled promise rejection", 1);
});

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

const startServer = async () => {
    await connectDatabase();
    if (shuttingDown) {
        return;
    }

    server = app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};

startupPromise = startServer();
startupPromise.catch((error) => {
    console.error(`Failed to start server: ${error.message}`);
    void shutdown("startup failure", 1);
});