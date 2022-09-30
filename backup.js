// mongodump --db=toss-mip --archive=./toss-mip.gzip --gzip
const { spawn } = require("child_process");
const path = require("path");
const cron = require("node-cron");

const DB = "toss-mip";
const ARCHIVE_PATH = path.join(__dirname, "backup_data", `${DB}.gzip`);

const backupMonboDB = function () {
  const child = spawn("mongodump", [
    `--db=${DB}`,
    `--archive=${ARCHIVE_PATH}`,
    "--gzip",
  ]);

  child.stdout.on("data", (data) => {
    console.log("stdout:\n", data);
  });
  child.stderr.on("data", (data) => {
    console.log("stderr:\n", Buffer.from(data).toString());
  });

  child.on("error", (error) => {
    console.log("error:\n", error);
  });

  child.on("exit", (code, signal) => {
    if (code) console.log("Process exit with code:", code);
    else if (signal) console.log("Process killed with signal:", signal);
    else console.log("Backup is successful");
  });
};

// cron.schedule("0 0 * * *", () => backupMonboDB());
cron.schedule("*/5 * * * * *", () => backupMonboDB());
