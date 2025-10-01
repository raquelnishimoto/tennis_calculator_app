# Tennis Calculator

A simple TypeScript CLI tool to parse tournament files, compute match results, and query player statistics.


## Features

- Parse tournament text files into structured data (`matches`, `players`).  
- Compute **sets won**, **match winner**, and **game statistics**.  
- Query results:
  - `Score Match <id>` → match score and winner
  - `Games Player <name>` → total games won/lost by a player  
- Pure functional design: parsing, aggregation, and queries are modular and testable.

---

## Project Structure

```
src/
├── main.ts # CLI entry point
├── readAndParseFile.ts # Reads and parses tournament files
├── handleQueries.ts # Handles user queries, 
├── types.ts # Shared TypeScript types
test/
└── test_data/ # Example tournament input files
```

## Usage

### 1. Install dependencies

```bash
npm install
```

### 2. Run with ts-node

```bash
npx ts-node src/main.ts test/test_data/full_tournament.txt
```
Then type queries into stdin:

```
Score Match 02
Games Player Person A
```

Press Enter after each query, or use a here-doc:
```
npx ts-node src/main.ts test/test_data/full_tournament.txt << EOF
Score Match 02
Games Player Person A
EOF
```

---
## Example Output
```
Person B defeated Person A
2 sets to 1

23 17
```

## Development
### Run tests (if you add Jest or similar):
```
npm test
```

### Lint / Format:
```
npm run lint
npm run format
```

---

## Assumptions / Limitations
* File Formatting
    - The tournament test file needs to conform to the expected format. 
    - Points should **not** be preceded by special characters such as \r (common when copying from Windows). Improper formatting can break parsing.

* File path usability:
    - Users must provide the correct relative path to the tournament file. Errors such as missing or incorrect paths will result in messages like:
    ```
    Filepath is missing: ts-node src/main.ts <tournament-file>
    ```
    or
    ```
    Something went wrong: <errormessage>
    ```
    which may result in undefined output in the CLI.

* CLI only:
    - This tool is currently designed as a CLI; no GUI or web interface is provided.

* Limited query types:
    - Only Score Match <id> and Games Player <name> are implemented. Other statistics must be added manually in handleQueries.ts.

## Scoring Rules
Details of tennis scoring can be found online. See here for reference:  
https://en.wikipedia.org/wiki/Tennis_scoring_system

The variation used for this application is a best of 3 sets match, with first to 6 games wins a set. 

Details as follows:
* A tennis match is split up into points, games and sets.
* Winning a game requires a person to win 4 points, but they must be ahead by at least 2 points (deuce, advantage, game)
* The first player to win 6 games wins a set. I.e:
    * Players do NOT need to be ahead by 2 to win a set (6-5 finishes a set) 
    * There is nothing special about that final game in a set. All games are the same.
* Best of 3 sets (first to 2 sets wins).
