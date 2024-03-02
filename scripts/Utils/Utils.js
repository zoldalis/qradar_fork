
const { PlayersDrawing } = require('../Drawings/PlayersDrawing.js');
const { HarvestablesDrawing } = require('../Drawings/HarvestablesDrawing.js');
const { MobsDrawing } = require('../Drawings/MobsDrawing.js');
const { ChestsDrawing } = require('../Drawings/ChestsDrawing.js');
const { DungeonsDrawing } = require('../Drawings/DungeonsDrawing.js');
let DungeonsHandler = require('../Handlers/DungeonsHandler.js');
let PlayersHandler = require('../Handlers/PlayersHandler.js');
let ChestsHandler = require('../Handlers/ChestsHandler.js');
let MobsHandler = require('../Handlers/MobsHandler.js');
let HarvestablesHandler = require('../Handlers/HarvestablesHandler.js');
const WebSocket = require('ws');

const dungeonsHandler = new DungeonsHandler();

const chestsHandler = new ChestsHandler();
const mobsHandler = new MobsHandler();


const harvestablesHandler = new HarvestablesHandler();
const playersHandler = new PlayersHandler();

let lpX = 0.0;
let lpY = 0.0;



function runUtilsWS()
{
    const socket = new WebSocket('ws://localhost:5002');

    socket.addEventListener('open', (event) => {
        console.log('Connected to the WebSocket server.');
    
    });
    
    socket.addEventListener('message', (event) => {
        var data = JSON.parse(event.data);
    
        // Extract the string and dictionary from the object
        var extractedString = data.code;
    
        var extractedDictionary = JSON.parse(data.dictionary);
    
    
    
        if (extractedString === "request") {
            onRequest(extractedDictionary["parameters"]);
        }
        else {
            onEvent(extractedDictionary["parameters"]);
        }
    });
}

function onEvent(Parameters) {






    const id = parseInt(Parameters[0]);
    const eventCode = Parameters[252];


    if (eventCode == 1) {


        playersHandler.removePlayer(id);
        mobsHandler.removeMist(id);
        mobsHandler.removeMob(id);
        dungeonsHandler.removeMob(id);
        chestsHandler.removeChest(id);



    }
    else if (eventCode == 3) {


        const posX = Parameters[4];
        const posY = Parameters[5];
        playersHandler.updatePlayerPosition(id, posX, posY);
        mobsHandler.updateMistPosition(id, posX, posY);
        mobsHandler.updateMobPosition(id, posX, posY);


    }
    else if (eventCode == 27) {
        playersHandler.handleNewPlayerEvent(id, Parameters, settings.ignoreList, settings.settingSound);







    }
    else if (eventCode == 36) {


        harvestablesHandler.newSimpleHarvestableObject(Parameters);

    }
    else if (eventCode == 37) {

        harvestablesHandler.newHarvestableObject(id, Parameters);
    }

    else if (eventCode == 58) {

        harvestablesHandler.harvestFinished(Parameters);


    }
    else if (eventCode == 44) {
        mobsHandler.updateEnchantEvent(Parameters);


    }
    else if (eventCode == 86) {
        playersHandler.updateItems(id, Parameters);


    }
    else if (eventCode == 118) {

        mobsHandler.NewMobEvent(Parameters);
    }

    else if (eventCode == 201) {

        playersHandler.handleMountedPlayerEvent(id, Parameters);


    }
    else if (eventCode == 309) {
        dungeonsHandler.dungeonEvent(Parameters);
    }
    else if (eventCode == 378) {

        chestsHandler.addChestEvent(Parameters);

    }



};

function onRequest(Parameters) {




    if (Parameters[253] == 21) {



        lpX = Parameters[1][0];
        lpY = Parameters[1][1];


    }





};

//requestAnimationFrame(gameLoop);

function render() {



    context.clearRect(0, 0, canvas.width, canvas.height);

    harvestablesDrawing.invalidate(context, harvestablesHandler.harvestableList);

    mobsDrawing.invalidate(context, mobsHandler.mobsList, mobsHandler.mistList);
    chestsDrawing.invalidate(context, chestsHandler.chestsList);
    dungeonsDrawing.invalidate(context, dungeonsHandler.dungeonList);
    playersDrawing.invalidate(context, playersHandler.playersInRange);


}





var previousTime = performance.now();




function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}



function update() {

    const currentTime = performance.now();
    const deltaTime = currentTime - previousTime;
    const t = Math.min(1, deltaTime / 100);


    harvestablesHandler.removeNotInRange(lpX, lpY);
    //harvestablesDrawing.interpolate(harvestablesHandler.harvestableList, lpX, lpY, t);


    //mobsDrawing.interpolate(mobsHandler.mobsList, mobsHandler.mistList, lpX, lpY, t);


    //chestsDrawing.interpolate(chestsHandler.chestsList, lpX, lpY, t);
    //dungeonsDrawing.interpolate(dungeonsHandler.dungeonList, lpX, lpY, t);
    //playersDrawing.interpolate(playersHandler.playersInRange, lpX, lpY, t);




    previousTime = currentTime;




}

/* function drawItems() {


    contextItems.clearRect(0, 0, canvasItems.width, canvasItems.height);

    if (settings.settingItems) {
        playersDrawing.drawItems(contextItems, canvasItems, playersHandler.playersInRange, settings.settingItemsDev);
    }




}
const intervalItems = 500;
setInterval(drawItems, intervalItems); */

function checkLocalStorage() {
    //settings.update(settings);
    //setDrawingViews();
}
const interval = 300;
setInterval(checkLocalStorage, interval)

module.exports = {harvestablesHandler, runUtilsWS};