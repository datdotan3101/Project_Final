const { execSync } = require("child_process");
const fs = require("fs");

try {
  console.log("Running prisma db push...");
  const pushOutput = execSync("npx prisma db push --accept-data-loss", {
    encoding: "utf8",
  });
  fs.writeFileSync("prisma_push_log.txt", pushOutput);

  console.log("Running prisma generate...");
  const genOutput = execSync("npx prisma generate", { encoding: "utf8" });
  fs.writeFileSync("prisma_gen_log.txt", genOutput);

  console.log("Success!");
} catch (error) {
  console.error("Error:", error);
  fs.writeFileSync("prisma_error_log.txt", error.stdout || error.message);
}
