import axios from "axios";
import { MessageAttachment } from "discord.js";
import fs from "fs";
import { delay } from "../utils/delay";

export class DownloadAllAttachments {
  private counter = 0;

  private async downloadFile(attachment: MessageAttachment): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const name = attachment.name;
      const fileExtension = name?.split(".").pop();

      const writer = fs.createWriteStream(
        `./images/foxy-${this.counter}.${fileExtension}`
      );

      const response = await axios.get(attachment.proxyURL, {
        responseType: "stream",
      });

      response.data.pipe(writer);
      writer
        .on("finish", () => {
          resolve();
        })
        .on("error", (err) => reject(err));
    });
  }

  async execute() {
    const attachmentsString = fs
      .readFileSync("./data/attachmentsDump.json")
      .toString();
    const attachments: MessageAttachment[] = JSON.parse(attachmentsString);

    for (const attachment of attachments) {
      this.counter++;
      console.log(`> Downloading ${attachment.name}`);
      try {
        await this.downloadFile(attachment);
        console.log(`> Finished ${attachment.name}`);
      } catch (err) {
        console.log(
          `> Failed to download ${attachment.proxyURL}, trying again...`,
          err
        );
      }
    }
  }
}
