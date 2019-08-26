const i18next = require("i18next");
const Backend = require("i18next-node-fs-backend");
const fs = require("fs");
const config = require("../config.json");
i18next.use(Backend).init({
    ns: ["bot", "console"],
    defaultNS: "bot",
    backend: {
        loadPath: './locales/{{lng}}/{{ns}}.json',
        addPath: './locales/{{lng}}/{{ns}}.missing.json',
        jsonIndent: 2,
    },
    preload: ['en', 'dev', 'de'],
    debug: true
});

module.exports = i18next;