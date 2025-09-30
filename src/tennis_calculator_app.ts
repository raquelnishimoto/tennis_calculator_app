import * as fs from "fs";
import * as path from "path";

/**
 * Loads tournament full score from a file
 * @param {string} filename - name of the file in test/test_data folder
 * @returns {string}
 */
function readTournamentFile(filename: string): string {
    const filepath = path.join(__dirname, '..', 'test', 'test_data', filename);
    return fs.readFileSync(filepath, 'utf8')
}

console.log(readTournamentFile('full_tournament.txt'))