import readline from "node:readline/promises";
import dns from "node:dns";
import "dotenv/config";
import { stdin, stdout } from "node:process";
import argon2 from "argon2";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import { ROLE } from "@ecommerce/shared/constants/index.js";

const rl = readline.createInterface({ input: stdin, output: stdout });

const customDnsServers = process.env.CUSTOM_DNS_SERVERS;

if (customDnsServers) {
  const servers = customDnsServers.split(",").map((s) => s.trim());
  dns.setServers(servers);
  console.log("Using custom DNS servers:", servers);
}

try {
  await mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGODB_NAME,
  });

  const name = await rl.question("Enter name: ");
  const email = await rl.question("Enter email: ");
  const username = await rl.question("Enter username: ");
  const password = await rl.question("Enter password: ");
  const role = await rl.question(
    `Enter role (${Object.values(ROLE).join("/")}): `,
  );

  const hashedPassword = await argon2.hash(password);

  const user = await User.create({
    name,
    email,
    username: username.toLowerCase() || undefined,
    password: hashedPassword,
    role: role.toLowerCase() || ROLE.USER,
  });

  console.log("\nUser created successfully:", user);
} catch (error) {
  console.error("\nError creating user:", error.message);
} finally {
  rl.close();
  await mongoose.disconnect();
}
