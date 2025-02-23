const fs = require("fs");

if (!fs.existsSync("config.json")) {
  fs.writeFileSync(
    "config.json",
    JSON.stringify({
      pterodactylUrl: "https://panel.example.com",
      pterodactylApiToken: "ptlc_abcdefghijklmnopqrstuvwxyz",
      serverId: "abcd123-1234-1234-1234-123456789",
      files: ["world", "world_nether", "world_the_end", "plugins"],
      driveFolderId: "",
      maxBackupFile: 20,
      enableCron: true,
      cronTime: "0 * * * *",
    })
  );
  console.log("Edit the config.json file and run this again");
  process.exit(1);
}

if (!fs.existsSync("credentials.json")) {
  console.log("credentials.json file not found");
  process.exit(1);
}

const Downloader = require("nodejs-file-downloader");
const { google } = require("googleapis");
const cron = require("node-cron");
const parser = require("cron-parser");

const config = JSON.parse(fs.readFileSync("config.json"));
const credentials = JSON.parse(fs.readFileSync("credentials.json"));
const { default: axios } = require("axios");

const headers = {
  headers: {
    Authorization: "Bearer " + config.pterodactylApiToken,
  },
};

const endpoints = {
  compress: `${config.pterodactylUrl}/api/client/servers/${config.serverId}/files/compress`,
  download: (fileName) =>
    `${config.pterodactylUrl}/api/client/servers/${config.serverId}/files/download?file=/${fileName}`,
  delete: `${config.pterodactylUrl}/api/client/servers/${config.serverId}/files/delete`,
};

async function authorize() {
  const driveClient = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/drive"]
  );

  await driveClient.authorize();

  return driveClient;
}

async function uploadFile(authClient, path, fileName) {
  const drive = google.drive({ version: "v3", auth: authClient });

  let data = [];

  if (fs.existsSync("data.json")) {
    data = JSON.parse(fs.readFileSync("data.json"));
    if (data.length >= config.maxBackupFile) {
      for (let i = 0; i <= data.length - config.maxBackupFile; i++) {
        await drive.files.delete({
          fileId: data[i],
        });
      }
      data.splice(0, data.length + 1 - config.maxBackupFile);
    }
  }

  const file = await drive.files.create({
    resource: {
      name: fileName,
      parents: [config.driveFolderId],
    },
    media: {
      mimeType: "application/tar+gzip",
      body: fs.createReadStream(path),
    },
  });

  data.push(file.data.id);
  fs.writeFileSync("data.json", JSON.stringify(data));
}

async function backup() {
  console.log("Starting backup");
  const compressed = await axios.post(
    endpoints.compress,
    {
      files: config.files,
      root: "/",
    },
    headers
  );

  const fileName = compressed.data.attributes.name;
  const download = await axios.get(endpoints.download(fileName), headers);

  const tempPath = "./.temp/" + fileName;

  console.log("Downloading file");
  await new Downloader({
    url: download.data.attributes.url,
    directory: "./.temp/",
    ...headers,
  }).download();

  console.log("Uploading file to Google Drive");
  await uploadFile(await authorize(), tempPath, fileName);

  fs.unlinkSync(tempPath);

  await axios.post(
    endpoints.delete,
    {
      files: [fileName],
      root: "/",
    },
    headers
  );

  console.log("Backup complete");
}

if (config.enableCron) {
  console.log("Program started with cron enabled");
  console.log(
    "Next backup: " + parser.parseExpression(config.cronTime).next().toString()
  );

  cron.schedule(config.cronTime, () => {
    try {
      backup().then(() => {
        console.log(
          "Next backup: " +
            parser.parseExpression(config.cronTime).next().toString()
        );
      });
    } catch (error) {
      console.log(error.toString());
    }
  });
} else {
  try {
    backup();
  } catch (error) {
    console.log(error.toString());
  }
}
