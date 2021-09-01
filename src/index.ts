import { Client } from "discord.js";
import { DownloadAllAttachments } from "./lib/DownloadAllAttachments";
import { DumpAllMessageWithAttachments } from "./lib/DumpAllMessageWithAttachments";

const client = new Client({
  intents: ["GUILD_MESSAGES"],
});

client.on("rateLimit", (rateLimitData) => {
  console.log(
    `Oops! Looks like Discord is limiting you in getting the messages, please wait ${rateLimitData.timeout}ms.`
  );
});

client.on("ready", async () => {
  console.log("Bot ready, dumping all images from Foxy Pics!");

  const loadAllAttachments = new DumpAllMessageWithAttachments(client);
  await loadAllAttachments.execute();

  const downloadAllAttachments = new DownloadAllAttachments();
  await downloadAllAttachments.execute();

  console.log("Yay! All images have been downloaded. Have a great day!");
  client.destroy();
});

client.login(process.env.BOT_TOKEN);
