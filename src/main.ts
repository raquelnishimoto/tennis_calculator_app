import { handleQueries } from "./handleQueries";
import { readTournamentFile } from "./readAndParseFile";

function main() {
  const filepath = process.argv[2];
  if (!filepath) {
    console.error("Filepath is missing: ts-node src/main.ts <tournament-file>");
    process.exit(1);
  }

  const { matches, players } = readTournamentFile(filepath);

  process.stdin.setEncoding("utf8");

  process.stdin.on("data", (chunk: string) => {
    const output = handleQueries(chunk, matches, players);
    console.log(output);
  });
}

// Run if this is the main module
if (require.main === module) {
  main();
}
