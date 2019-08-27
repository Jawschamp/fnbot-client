# FNBot

FNBot is a Fortnite bot that can show every skin and emote in the lobby. It was written in Node.js using the [epicgames-fortnite-client](https://epicgames-client.kysune.me/) library.

#### Discord
https://discord.gg/WWSTpbb
> Note that the server is new so probably there won't be that many people on it.


## Features
- Set the bots skin and emote to everything you'd like
- Up to 15 people can join the bots lobby
- Multiple languages supported
  > There are translations for cosmetics and for bot messages. Currently, there are bot message translations for german. If you'd like to contribute, feel free to DM me on Discord (Terax#0916). If you want to know more about the cosmetic translations, visit the [server repository](https://github.com/Terax235/fnbot-server).
- Use commands to set cosmetics (You can provide either the name or the ID of the cosmetic).
- Simple installation (no need to install Node.js nor dependencies)

## Installation
> Important: In order to be able to use the bot, you must also use the [cosmetic server](https://github.com/Terax235/fnbot-server). I have created an instance of one, so if you want to use my server, just provide http://fnserver.terax235.com/ instead.
If you want to host the server, follow the guide at [the servers repository](https://github.com/Terax235/fnbot-server). Please note that you should only host the server if you have some experience with Node.js and build tools which are required to install the packages.

> It's very simple to install the bot, you don't even need to install Node.js or anything.

1. Go to the [releases](https://github.com/Terax235/fnbot-client/releases/latest) page and download the latest release.
2. Extract the zip to a new folder.
3. Fill out `config.example.json` in the bot folder.
   - Enter your bots account data
   - Enter the cosmetic server url
   - Enter the language you'd like the bot to display (currently only english (en) and german (de) are supported)
4. Open the bot folder in a terminal.
5. Run the bot using the following command:
   - Windows users: `./FNBot.exe`
   - Linux and macos users: `./FNBot`
6. Maybe you will be prompted to restart the bot.
   > This can happen if a new build id was found. Just restart the script and everything should be working fine.

7. Done. Now you can join the bots lobby and set its cosmetics. For a list of available commands, see [Commands](#Commands)

## Commands
- `skin <name/ID>` - Sets the bots skin. `value` can be either the ID or the name of the skin you'd like to display
- `emote <name/ID>` - Sets the bots emote. `value` can be either the ID or the name of the emote you'd like to display

## Dependencies
#### npm
- [authenticator](https://www.npmjs.com/package/)
- [epicgames-client](https://www.npmjs.com/package/epicgames-client)
- [epicgames-fortnite-client](https://www.npmjs.com/package/epicgames-fortnite-client)
- [i18next](https://www.npmjs.com/package/i18next)
- [i18next-node-fs-backend](https://www.npmjs.com/package/i18next-node-fs-backend)
- [node-fetch](https://www.npmjs.com/package/node-fetch)
- [pkg](https://www.npmjs.com/package/pkg) (used to compile application into a single file)

#### Other
- [benbotfn API](http://benbotfn.tk:8080/api/docs) (used to get encryption keys)
