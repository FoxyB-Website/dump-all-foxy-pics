import {
  Client,
  Message,
  MessageAttachment,
  Snowflake,
  TextChannel,
} from "discord.js";
import fs from "fs";

export class DumpAllMessageWithAttachments {
  constructor(private client: Client) {}

  private writeMessagesFile(messages: Message[]) {
    const attachments: MessageAttachment[] = [];

    // Yeah, very ugly but it works
    messages.forEach((message) => {
      message.attachments.forEach((attachment) => {
        attachments.push(attachment);
      });
    });

    fs.writeFileSync(
      "./data/attachmentsDump.json",
      JSON.stringify(attachments)
    );
  }

  async execute(): Promise<void> {
    if (fs.existsSync("./data/attachmentsDump.json")) {
      console.log("Dump file already exists, skipping...");
      return;
    }

    const channel = await this.client.channels.fetch("732497260256165888");

    if (!channel || !channel.isText() || !(channel instanceof TextChannel))
      throw new Error("Error in getting Foxy Pics channel.");

    let messages: Message[] = [];
    let lastID: Snowflake = "";
    while (true) {
      const fetchedMessages = await channel.messages.fetch({
        limit: 100,
        ...(lastID && { before: lastID }),
      });

      if (fetchedMessages.size === 0) {
        messages = messages.reverse();
        messages = messages.filter((message) => message.attachments.size > 0);
        this.writeMessagesFile(messages);
        return;
      }

      messages = messages.concat(Array.from(fetchedMessages.values()));
      lastID = fetchedMessages.lastKey() as string;
    }
  }
}
