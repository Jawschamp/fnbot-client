const { Launcher } = require('epicgames-client');
const Fortnite = require('epicgames-fortnite-client');
const fetch = require("node-fetch");
const { ESubGame, EInputType } = Fortnite;
const config = require(process.cwd() + "\\config.json", "must-exclude");
const Authenticator = require("./structures/Authenticator.js");

var client;

if (config.build && config.build.launcher) {
  client = new Launcher({ build: config.build.launcher.build, engineVersion: config.build.launcher.engineVersion, netCL: config.build.launcher.netCL });
} else {
  client = new Launcher();
};

const i18next = require("i18next");
const Backend = require("i18next-node-fs-backend");
i18next.use(Backend).init({
  ns: ["bot", "console"],
  defaultNS: "bot",
  backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json',
      addPath: './locales/{{lng}}/{{ns}}.missing.json',
      jsonIndent: 2,
  },
  preload: ['en', 'dev', 'de'],
  debug: false
}).then(async () => {

var serverOff = false;

const currentLoadout = {
  skin: null,
  emote: null,
};

function buildPath(type, value) {
  if (type == "skin") return "/Game/Athena/Items/Cosmetics/Characters/" + value + "." + value;
  if (type == "emote") return "/Game/Athena/Items/Cosmetics/Dances/" + value + "." + value;
};

console.log("[1] " + i18next.t("initiating", { ns: "console", lng: config.preferred_language }));

if (config.server_url_base.split("")[config.server_url_base.split("").length-1] == "/") {
  config.server_url_base = config.server_url_base.split("").slice(0, config.server_url_base.split("").length-1).join("");
};
client.init().then(async (success) => {
  if(!success) throw new Error(i18next.t("initiating_fail", { ns: "console", lng: config.preferred_language }));

  // Fetching current build id
  try {
    var buildRequestURL = config.server_url_base + "/api/build";
    if (config.server_version) {
      buildRequestURL = config.server_url_base + "/api/"+config.server_version+"/build";
    };
    var buildRequest = await fetch(buildRequestURL).then(res => res.json());
    if (!config.build || !config.build.fortnite || !config.build.launcher || buildRequest.fortniteOptions.buildID !== config.build.fortnite.buildID || buildRequest.fortniteOptions.netCL !== config.build.fortnite.netCL) {
      config.build = {
        fortnite: buildRequest.fortniteOptions,
        launcher: buildRequest.launcherOptions,
      };
      require("fs").writeFileSync("./config.json", JSON.stringify(config));
      console.log(`[${i18next.t("information", { ns: "console", lng: config.preferred_language })}] ${i18next.t("build_update", { ns: "console", lng: config.preferred_language })}`);
      return process.exit(0);
    };
  } catch (e) {
    console.log(e)
    console.log(`[${i18next.t("warning", { ns: "console", lng: config.preferred_language})}] ${i18next.t("build_fetch_fail", { ns: "console", lng: config.preferred_language })}`);
  };

  if (config.bot_account.token_2fa) {
    console.log("[2] " + i18next.t("logging_in.2fa", { ns: "console", lng: config.preferred_language }));
      if(!await client.login({ email: config.bot_account.email, password: config.bot_account.password, twoFactorCode: await Authenticator.GetAuthToken(config.bot_account.token_2fa) })) throw new Error('[ERROR] Login failed. Check if your data is correct.');
  } else {
    console.log("[2] " + i18next.t("logging_in.no_2fa", { ns: "console", lng: config.preferred_language }));
      if(!await client.login({ email: config.bot_account.email, password: config.bot_account.password })) throw new Error('[ERROR] Login failed. Check if your data is correct and make sure the account has no 2FA. If the account has 2FA, simply provide token_2fa as a param in config containing the 2fa code generation token.');
  };
  console.log("    " + i18next.t("logging_in.logged_in", { ns: "console", lng: config.preferred_language, username: client.account.name, account_id: client.account.id }));
  console.log("[3] " + i18next.t("starting_fn", { ns: "console", lng: config.preferred_language }));
  const fortnite = await client.runGame(Fortnite, { netCL: config.build.fortnite.netCL, partyBuildId: config.build.fortnite.buildID, http: { headers: { "User-Agent" : config.build.fortnite.UserAgent } }, });
  console.log("[4] " + i18next.t("prepare_br", { ns: "console", lng: config.preferred_language }));
  const br = await fortnite.runSubGame(ESubGame.BattleRoyale);
  console.log(`[${i18next.t("ready", { ns: "console", lng: config.preferred_language })}] ${i18next.t("bot_in_lobby", { ns: "console", lng: config.preferred_language })}`);
  client.communicator.on("friend:request", async FR => {
    await FR.accept();
  });
  fortnite.communicator.on("friend:request", async FR => {
    await FR.accept();
  });
  let botWaved = false;
  fortnite.communicator.on("party:member:joined", async PMD => {
    if (PMD.id !== client.account.id && !botWaved) {
      botWaved = true;
      fortnite.party.me.setOutfit(buildPath("skin", "CID_434_Athena_Commando_F_StealthHonor"));
      setTimeout(() => {
        fortnite.party.me.setEmote(buildPath("emote", "EID_Wave"));
        setTimeout(() => {
          fortnite.party.me.clearEmote();
        }, 3000);
      }, 1000)
    };
  });
  async function handleMSGInput(msg, userid) {
    let command = msg.split(" ")[0];
    let args = msg.split(" ").slice(1).join(" ");
    let displayName = args;
    let type = "skin";
    if (command == "skin") type = "skin";
    if (command == "emote") type = "emote";
    if (!serverOff) {
      var requestURL = config.server_url_base + "/api/cosmetics/search?q=" + args + "&type=" + type;
      if (config.server_version) {
        requestURL = config.server_url_base + "/api/"+config.server_version+"/cosmetics/search?q=" + args + "&type=" + type;
      };
      const Res = await fetch(requestURL).then(res => res.json());
      if (Res && Res.id) {
        args = Res.id;
        if (config.preferred_language && Res.name[config.preferred_language]) {
          displayName = Res.name[config.preferred_language]
        } else {
          displayName = Res.name.en;
        };
      };
    };
    if (command == "skin") {
      await fortnite.party.me.setOutfit(buildPath("skin", args));
      if (currentLoadout.emote) {
        await fortnite.party.me.clearEmote();
        await fortnite.party.me.setEmote(buildPath("emote", currentLoadout.emote))
      };
      currentLoadout.skin = args;
      return await fortnite.communicator.sendMessage(userid,  i18next.t("msg_skinchanged", { ns: "bot", lng: config.preferred_language, skin: "[" + displayName + "]" }));
    };
    if (command == "emote") {
      await fortnite.party.me.setEmote(buildPath("emote", args));
      currentLoadout.emote = args;
      return await fortnite.communicator.sendMessage(userid, i18next.t("msg_emotechanged", { ns: "bot", lng: config.preferred_language, emote: "[" + displayName + "]" }));
    };
  };

  fortnite.communicator.on("friend:message", async FM => {
    if (!fortnite.party || !fortnite.party.me) return;
    if (!fortnite.party.members.filter(m => m.id == FM.friend.id)[0]) return await fortnite.communicator.sendMessage(FM.friend.id, i18next.t("msg_notingroup", { ns: "bot", lng: config.preferred_language }))
    await handleMSGInput(FM.message, FM.friend.id);
  });
  async function checkStatus() {
    try {
      const request = await fetch(config.server_url_base + "/api/status").then(res => res.json());
      if (request.state == "online" && serverOff == true) {
        console.log(`[${i18next.t("warning", { ns: "console", lng: config.preferred_language })}] ${i18next.t("server_status.server_on", { ns: "console", lng: config.preferred_language })}`);
        serverOff = false;
      };
    } catch (err) {
      if (!serverOff || serverOff == false) {
        console.log(`[${i18next.t("warning", { ns: "console", lng: config.preferred_language })}] ${i18next.t("server_status.server_off", { ns: "console", lng: config.preferred_language })}`);
        serverOff = true;
      };
    };
  };
  await checkStatus();
  setInterval(async () => {
    await checkStatus();
  }, 1000*60);
});
});
