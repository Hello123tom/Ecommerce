import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config({ path: "backend/config/config.env" });

export const stripe = new Stripe(process.env.STRIPE_KEY_SECRET);