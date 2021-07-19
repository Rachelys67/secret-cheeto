
const { GoogleSpreadsheet } = require('google-spreadsheet');
const random = require('random-js');
const { Random } = require("random-js");
const rachelHelper = require("./RachelHelpers.js");
const creds = require('./client_secret.json');
const { datastore_v1 } = require('./node_modules/googleapis/build/src/index.js');
const doc = new GoogleSpreadsheet('1D1-YnwEgS7lki8TvF0DONm7dl4d--pE2ZShS9hsUmG8');

const playerSheet = 0;

async function initializeDataSource(sheetId) {
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

async function getAllPlayers() {
    const dataStore = await retrieveDataSource(playerSheet);
    return dataStore;
}

async function removeAllPlayers() {
    const dataStore = await retrieveDataSource(playerInformation);
    for (var i = 0; i < dataStore.length; i++) {
        dataStore[i].delete();
    }
}

async function addPlayer(userName) {
    const sheet = await initializeDataSource(playerInformation);
    var userToUpdate =
        sheet.addRow({ UserName: userNamedominantUserName })
}

async function deleteUser(userName) {
    const dataStore = await retrieveDataSource(playerInformation);
    for (var i = 0; i < dataStore.length; i++) {
        if (dataStore[i]._rawData[0] == userName) {
            dataStore[i].delete();
        }
    }

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

module.exports = {
    exportQueryInformation: function (userName, callback) {
        queryUserInformation(userName, callback);
    },
    exportGetAllPlayers: function () {
        getAllPlayers();
    },
    exportRemoveAllPlayers: function () {
        removeAllPlayers();
    },
    exportAddPlayer: function (username) {
        addPlayer(username);
    }
};