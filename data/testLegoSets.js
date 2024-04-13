
const legoSets = require('./modules/legoSets');

legoSets.initialize()
    .then(() => {
        console.log("All Sets:", legoSets.getAllSets());
        console.log("Set by Number (setData.json):", legoSets.getSetByNum("setData.json"));
        console.log("Sets by Theme (setData.json):", legoSets.getSetsByTheme("setData.json"));
    })
    .catch(err => {
        console.error("Initialization failed:", err);
    });
