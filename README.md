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
1. type `npm run build`. This is the commnad to build the championship spreadsheets located at `data/parsed`.

## Use git/gitbash

1. [Install Git Bash](https://appuals.com/what-is-git-bash/)
1. via gitbash, type `cd ~/Documents`.
1. type `git clone https://github.com/kagd/league-results-parser.git`. This will pull down the source files to your comp.
1. type `cd league-results-parser`
1. type `npm install`. This will install all of the dependencies needed for the project to run.
1. type `npm run build`. This is the commnad to build the championship spreadsheets located at `data/parsed`.
