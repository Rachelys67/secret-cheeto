
const { GoogleSpreadsheet } = require('google-spreadsheet');
const random = require('random-js');
const { Random } = require("random-js");
const rachelHelper = require("./RachelHelper.js");
const creds = require('./client_secret.json');
const { datastore_v1 } = require('./node_modules/googleapis/build/src/index.js');
const doc = new GoogleSpreadsheet('1D1-YnwEgS7lki8TvF0DONm7dl4d--pE2ZShS9hsUmG8');

const playerSheet = 0;
const policyDeck = 1;
const policyInPlaySheet = 2;
const configSheet = 3;

async function initializeDataSource(sheetId) {
    console.log("intializing...");
    await doc.useServiceAccountAuth({
        client_email: creds.client_email,
        private_key: creds.private_key,
    });
    await doc.getInfo();
    const sheet = doc.sheetsByIndex[sheetId];
    return sheet;
}

async function retrieveDataSource(sheetId) {
    const sheet = await initializeDataSource(sheetId);
    const rows = await sheet.getRows();
    return rows;
}

function filterData(dataStore, searchKey, searchIndex) {
    var dataCount = dataStore.length;
    for (i = 0; i < dataCount; i++) {
        if (dataStore[i]._rawData[searchIndex] == searchKey) {
            return dataStore[i]._rawData;
        }
    }
    return null;
}

async function queryUserInformation(userName, callback) {
    const dataStore = await retrieveDataSource(playerSheet);
    callback(filterData(dataStore, userName, 0));
}

async function getAllPlayers(callback) {
    const dataStore = await retrieveDataSource(playerSheet);
    callback(dataStore);
}

async function removeAllPlayers() {
    const dataStore = await retrieveDataSource(playerSheet);
    for (var i = 0; i < dataStore.length; i++) {
        dataStore[i].delete();
    }
}

async function addPlayer(userName) {
    const sheet = await initializeDataSource(playerSheet);
    console.log("initilized... updating...");
    var userToUpdate =
        sheet.addRow({ Username: userName })
}

async function updateData(dataStore, userToUpdate) {
    var dataCount = dataStore.length;
    for (i = 0; i < dataCount; i++) {
        if (dataStore[i]._rawData[0] == userToUpdate[0]) {
            dataStore[i]._rawData = userToUpdate;
            await dataStore[i].save();
        }
    }
}

async function clearData(sheetId) {
    const dataStore = await retrieveDataSource(sheetId);
    var dataCount = dataStore.length;
    for (var i = dataCount; i > 0; i--) {
        await dataStore[i - 1].delete();
    }
}

async function setGameState(isRunning) {
    const sheet = await initializeDataSource(configSheet);
    const rows = await sheet.getRows();
    if (isRunning == false) {
        await rows[0].delete();
    }
    else {
        var userToUpdate =
            sheet.addRow({ GameRunning: "Yes" })
    }
}
async function drawCommand(callback) {
    const dataStore = await retrieveDataSource(policyDeck);
    var dataCount = dataStore.length;
    var cardsDrawn = [];
    var dataIterator = dataCount;
    console.log("picking cards...");
    for (var j = 0; j < 3; j++) {
        cardsDrawn[j] = await dataStore[dataIterator - 1]._rawData[1];
        dataIterator--;
    }

    dataIterator = dataCount;
    console.log("deleting cards...");
    for (var j = 0; j < 3; j++) {
        await dataStore[dataIterator - 1].delete();
        dataIterator--;
    }
    callback(cardsDrawn);
}

async function DRAW(callback) {
    const dataStore = await retrieveDataSource(policyDeck);
    var dataCount = dataStore.length;
    if (dataCount < 3) {
        //Shuffle...
        await calculatePolicyCount(async function (facistPolicies, liberalPolicies) {
            await clearData(policyDeck);
            await shuffleRemainingPolicies(facistPolicies, liberalPolicies);
            await drawCommand(callback);
        });
    }
    else {
        drawCommand(callback);
    }
    //return cardsDrawn;
}

async function calculatePolicyCount(callback) {
    const dataStore = await retrieveDataSource(policyInPlaySheet);
    var dataCount = dataStore.length;
    var liberalCount = 6;
    var facistCount = 11;
    for (var i = 0; i < dataCount; i++) {
        if (await dataStore[i]._rawData[0] == "Liberal") {
            liberalCount--;
        }
        if (await dataStore[i]._rawData[0] == "Facist") {
            facistCount--;
        }
    }
    callback(facistCount, liberalCount);
}

async function shuffleRemainingPolicies(facistPolicies, liberalPolicies) {
    const sheet = await initializeDataSource(policyDeck);
    var policyCount = liberalPolicies + facistPolicies;
    var chosenCard = false;
    var breakVar = 0;
    const random = new Random();
    for (var i = 0; i < policyCount; i++) {
        chosenCard = false;
        breakVar = 0;
        while (chosenCard == false) {
            var currentPolicyCount = liberalPolicies + facistPolicies;
            cardType = parseInt(random.integer(1, 100));
            var chanceOfLiberal = ((liberalPolicies / currentPolicyCount) * 100);
            if (breakVar > 1000) return;
            else breakVar++;
            console.log(cardType.toString() + "< " + chanceOfLiberal.toString());
            if ((cardType < chanceOfLiberal) && (liberalPolicies > 0)) {
                liberalPolicies--;
                await sheet.addRow({ CardNum: (i + 1), Policy: 'Liberal' });
                chosenCard = true;
            }
            else if (facistPolicies > 0) {
                facistPolicies--;
                await sheet.addRow({ CardNum: (i + 1), Policy: 'Facist' });
                chosenCard = true;
            }
        }
    }
}

async function policyCountExport(callback) {
    const dataStore = await retrieveDataSource(policyInPlaySheet);
    var liberalPolicies = 0;
    var facistPolicies = 0;
    for (var i = 0; i < dataCount; i++) {
        if (await dataStore[i]._rawData[0] == "Liberal") {
            liberalCount++;
        }
        if (await dataStore[i]._rawData[0] == "Facist") {
            facistCount++;
        }
    }
    callback(facistPolicies, liberalPolicies);
}

async function playPolicy(policyName) {
    const sheet = await initializeDataSource(policyInPlaySheet);
    console.log("initilized... updating...");
    var userToUpdate =
        sheet.addRow({ Policy: policyName })
}

module.exports = {
    exportQueryInformation: function (userName, callback) {
        queryUserInformation(userName, callback);
    },
    exportGetAllPlayers: function (callback) {
        getAllPlayers(callback);
    },
    exportRemoveAllPlayers: function () {
        removeAllPlayers();
    },
    exportAddPlayer: function (username) {
        addPlayer(username);
    },
    drawPolicy: function (callback) {
        return DRAW(callback);
    },
    resetGame: function () {
        clearData(playerSheet);
        clearData(policyDeck);
        clearData(policyInPlaySheet);
        setGameState(false);
    },
    startGame: function () {
        setGameState(true);
        shuffleRemainingPolicies(11, 6);
    },
    shufflePolicies: function (policiesInPlay) {
        var facistPolicies = 11;
        var liberalPolicies = 6;
        if (policiesInPlay.length > 0) {
            for (i = 0; i < policiesInPlay.length; i++) {
                if (policiesInPlay[0] == 'Facist') {
                    facistPolicies--;
                }
                else {
                    liberalPolicies--;
                }
            }
        }
        clearData(policyDeck);
        shuffleRemainingPolicies(facistPolicies, liberalPolicies);
    },
    expPlayPolicy: async function (policyName) {
        await playPolicy(policyName);
    },
    getPolicyCounts: function (callback) {
        policyCountExport(callback);
    }
};