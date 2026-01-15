import { createClient } from "redis";

type RedisClient = {
  connectRedis: () => Promise<void>;
  disconnectRedis: () => Promise<void>;
  getByKey: (key: string) => Promise<string | null>;
  setByKey: (key: string, value: string, expTime?: number) => Promise<void>;
  delByKey: (key: string) => Promise<void>;
  getAllKeys: () => Promise<string[]>;
};

const client = createClient({
  url: "rediss://default:ATLtAAIjcDE3YzZjZWE0OTI2NjQ0ZDhhODZkZDQ3ZDIyODc1MmVlMnAxMA@fond-pegasus-13037.upstash.io:6379",
});

client.on("error", (err) => console.log("Redis Client Error", err));

let isConnected = false;

async function connectRedis(): Promise<void> {
  if (isConnected) return;
  console.log("Connecting to Redis...");
  try {
    await client.connect();
    isConnected = true;
    console.log("Redis connected successfully.");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    throw error;
  }
}

async function disconnectRedis(): Promise<void> {
  try {
    await client.quit();
    console.log("Redis disconnected successfully.");
  } catch (error) {
    console.error("Error disconnecting from Redis:", error);
    throw error;
  }
}

async function getByKey(key: string): Promise<string | null> {
  try {
    return await client.get(key);
  } catch (error) {
    console.error(`Error getting value for key "${key}":`, error);
    throw error;
  }
}

async function setByKey(
  key: string,
  value: string,
  expTime = 3600
): Promise<void> {
  try {
    await client.set(key, value, { EX: expTime });
  } catch (error) {
    console.error(`Error setting value for key "${key}":`, error);
    throw error;
  }
}

async function delByKey(key: string): Promise<void> {
  try {
    await client.del(key);
  } catch (error) {
    console.error(`Error deleting key "${key}":`, error);
    throw error;
  }
}

async function getAllKeys(): Promise<string[]> {
  try {
    return await client.keys("*");
  } catch (error) {
    console.error("Error retrieving all keys:", error);
    throw error;
  }
}

export default {
  connectRedis,
  disconnectRedis,
  getByKey,
  setByKey,
  delByKey,
  getAllKeys,
} as RedisClient;
