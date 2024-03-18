## Pterodactyl Backup to Google Drive

This application automatically backs up your Pterodactyl server files to Google Drive on a scheduled basis.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
  - [config.json](#configjson)
  - [credentials.json](#credentialsjson)
- [Setup Credentials](#setup-credentials)
  1. [Create or Select Project](#1-create-or-select-project)
  2. [Enable Google Drive API](#2-enable-google-drive-api)
  3. [Create Service Account](#3-create-service-account)
  4. [Download Service Account Key](#4-download-service-account-key)
  5. [Add Access to Drive Folder](#5-add-access-to-drive-folder)
- [Usage](#usage)
- [Additional Notes](#additional-notes)

### Features

- Compresses and downloads server files specified in the configuration.
- Uploads backups to Google Drive with automatic rotation (keeps a maximum number of backups).
- Schedules backups using cron expressions.

### Installation

1. **Node.js and npm:** Make sure you have Node.js and npm installed on your system. You can download them from the official Node.js website [https://nodejs.org/en](https://nodejs.org/en).
2. **Clone the repository:** Clone this repository to your local machine using git. You can use a service like Github or clone it directly from the command line.
3. **Dependencies:** Install the required dependencies by running `npm install` in the project directory.

**Important:** This application requires configuration before running.

### Configuration

1. **config.json:** Edit the `config.json` file located in the project root directory.
   - `pterodactylUrl`: The URL of your Pterodactyl panel.
   - `pterodactylApiToken`: Your Pterodactyl API token with file permissions.
   - `serverId`: The ID of the server you want to back up.
   - `files`: An array of file paths or directories to include in the backup (relative to the server root).
   - `driveFolderId`: The ID of the Google Drive folder where backups will be stored. You can find the folder ID in the URL of your Google Drive folder. The format of the URL is typically `drive.google.com/drive/folders/YOUR_FOLDER_ID_HERE`
   - `maxBackupFile`: The maximum number of backups to keep in Google Drive (older backups will be automatically deleted).
   - `enableCron`: Set to `true` to enable automatic backups using cron.
   - `cronTime`: The cron expression that defines the scheduling for backups (e.g., `0 * * * *` for every hour). You can use online cron expression generators to create the appropriate schedule [https://crontab.guru/](https://crontab.guru/).
2. **credentials.json:** Create a file named `credentials.json` in the project root directory. You'll need to setup the Google Drive API.

### Setup Credentials

**1. Create or Select Project:**

Go to https://console.cloud.google.com/cloud-resource-manager and click on the button "Create Project".
Give a name to the project, click on "Create" to submit, and wait for the creation to complete.

![](https://cdn.discordapp.com/attachments/868678321049829436/1219415218132750467/image.png?ex=660b37eb&is=65f8c2eb&hm=3f2c0bcb254450031053ae2c625f31f72f4042f2adb31389652215e40c3a7189&)

**2. Enable Google Drive API:**

Once the project is created, select it. You will be redirected to the console dashboard. On the sidebar menu, click on the menu "APIs & Services";
Locate the button labeled "ENABLE APIS AND SERVICES" and click on it.

![](https://media.discordapp.net/attachments/868678321049829436/1219415659272994917/image.png?ex=660b3854&is=65f8c354&hm=c8997bea55289e2d346f3e73c1a6bcf43ae027acd5e1dcae450c36c129865e0e&=&format=webp&quality=lossless)

You will be redirected to a page that lists all the Google APIs. Search for "Google Drive API" and click on it in the result list.

On the next page, click on the button "Enable", you will be redirected to a page where the API will be enabled.

![](https://media.discordapp.net/attachments/868678321049829436/1219415838306603018/image.png?ex=660b387f&is=65f8c37f&hm=101a063444f86dec52c7d406e5f9b289b5585a7c426c5152b5eb0ea20a5f2ac0&=&format=webp&quality=lossless)

**3. Create Service Account:**

Click "Credentials", locate the drop-down button labeled "CREATE CREDENTIALS" click on it, and select the drop-down menu labeled "Service Account".

![](https://media.discordapp.net/attachments/868678321049829436/1219416019534090290/image.png?ex=660b38aa&is=65f8c3aa&hm=b52204f3f66d6b3075c05400a63bc2811b134c73942d2fca963f9f7cef41f64e&=&format=webp&quality=lossless)
![](https://media.discordapp.net/attachments/868678321049829436/1219416075318329365/image.png?ex=660b38b8&is=65f8c3b8&hm=8d4476f3fe68439fbad447d65085ff301a07c69c0d29f6c875b534a45b2ec94f&=&format=webp&quality=lossless)

Fill up the service account details and click DONE

![](https://media.discordapp.net/attachments/868678321049829436/1219416265127628921/image.png?ex=660b38e5&is=65f8c3e5&hm=98b6b43347ef2210c99eedaad12468242630de1d186d737d1eaebfb67c648c26&=&format=webp&quality=lossless)

**4. Download Service Account Key:**

- Select the service account you just created.
- Within the service account details page, click on the "Keys" tab.
- Click the "Add key" button and select "Create new key".
- Choose JSON format and click "Create" to download the key file securely. Keep this file confidential and store it in the app directory with name `credentials.json`.

![](https://media.discordapp.net/attachments/868678321049829436/1219416424687206431/image.png?ex=660b390b&is=65f8c40b&hm=ed83f061b2f4a181e3c4a154a5cd99e4785a3770a86334d16832f592f3ba3485&=&format=webp&quality=lossless)

**5. Add Access to Drive Folder**

- Right click on the Google Drive folder and select "Share" and add the service account email to the access list.

![](https://cdn.discordapp.com/attachments/868678321049829436/1219416621899186285/image.png?ex=660b393a&is=65f8c43a&hm=b07daa505a64a7331e3de8ae20948624faafacb08b3091e3e8c0d2196d4f40fd&)
![](https://media.discordapp.net/attachments/868678321049829436/1219416688190291968/image.png?ex=660b394a&is=65f8c44a&hm=f8bea498a554f3228ba4f45f69929b1b6bb56b43f3f286cae085ca56cebd1a13&=&format=webp&quality=lossless)

Copy the folder id to config.json

![](https://media.discordapp.net/attachments/868678321049829436/1219416790778773606/image.png?ex=660b3962&is=65f8c462&hm=98fb207dd56422731e3adfc66bafed26b23452645f96a95268f19de5ede05f74&=&format=webp&quality=lossless)

### Usage

1. **Run the script:** Once you've configured the application, run the script using `node index.js` in the project directory.
   - If cron is enabled, the script will perform the initial backup and schedule future backups according to the cron expression.
   - If cron is disabled, the script will perform a one-time backup.

### Additional Notes

- Make sure the Pterodactyl API token you provide has the necessary file permissions to access and download server files.
