# Getting started

There are 2 options for using this program. Download the latest release (this will require you download
the latest zip when you need to upgrade) or use git/gitbash (this will make upgrading easier, but will require
more setup).

## Download latest release

1. [Download the latest version](https://github.com/kagd/league-results-parser/releases).
1. Extract the files to `Documents` into a folder named `leagueResultsParser`.
1. Open the Command Prompt. You can do this by typing `cmd` in the windows search and hitting enter.
1. Next you will need to navigation to the `leagueResultsParser` location via the command prompt. Type `cd ~/Documents/leagueResultsParser`.
1. type `npm install`. This will install all of the dependencies needed for the project to run.
1. type `npm run build`. This is the commnad to build the championship spreadsheets located at `data/final`.

## Use git/gitbash

1. [Install Git Bash](https://appuals.com/what-is-git-bash/)
1. via gitbash, type `cd ~/Documents`.
1. type `git clone https://github.com/kagd/league-results-parser.git`. This will pull down the source files to your comp.
1. type `cd league-results-parser`
1. type `npm install`. This will install all of the dependencies needed for the project to run.
1. type `npm run build`. This is the commnad to build the championship spreadsheets located at `data/final`.

## Raw file names

- Data files need to be in the format `camelCaseRaceName-r.json` for race and `camelCaseRaceName-q.json` for qualification.
- You can see the names of the races [races here](./seasonConfig.json#L97). When there are multiple races, the app expects a format of `monzaRace1-r.json` and `monzaRace2-r.json`.

## Docker and docker-compose (Recommended)

 These instructions were tested on Linux and Mac.  Changes for Windows should be minimal.

1. Install [Docker](https://www.docker.com/get-started) if you haven't already.
1. Make sure you have the latest version of docker and docker-compose installed. (You will have this if you just installed)
1. Ensure the data folder exists in the root of the git directory structure.  This will get mounted into the container.
1. Run `docker-compose build`
1. Run `docker-compose up`.  Because it does not run a daemon, you will get all log output to your terminal/console.  There is no need to run this in the background with -d.
1. Run `docker-compose rm` to clean up exited containers (optional).
