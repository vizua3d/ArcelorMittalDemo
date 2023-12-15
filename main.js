window.addEventListener('load', initApp);
import {Player} from "./Player.js"

let canvas;
let clickCounter = 0;

var engineApi;
var cameraApi;
var viewport;
var cameraEntity;
var currentPlayer;
var currentVideoPLayer;
async function initApp() {
    canvas = document.getElementById('display-canvas');
    await SDK3DVerse.joinOrStartSession({
        userToken: 'public_FGgoJaVhB2UPv8y_',
        sceneUUID: 'f4a5efae-dc6f-42e9-a093-b1bfe12ed2e5',
        canvas,
        viewportProperties: {
            defaultControllerType: SDK3DVerse.controller_type.editor,
            //defaultControllerType: SDK3DVerse.controller_type.orbit,
        },
    });

    await SDK3DVerse.installExtension(SDK3DVerse_ThreeJS_Ext);

    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitPointerLockElement;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

    canvas.addEventListener('mouseup', onKeyOrMousePressed);
    canvas.addEventListener('keypress', onKeyOrMousePressed);
    canvas.addEventListener('click', onKeyOrMousePressed);
    //canvas.addEventListener('mousemove', onKeyOrMousePressed);

    engineApi = SDK3DVerse.engineAPI;
    cameraApi = engineApi.cameraAPI;
    viewport = cameraApi.getActiveViewports()[0];
    cameraEntity = viewport.getCamera();

    currentPlayer = new Player(engineApi, cameraApi, viewport, cameraEntity);

    //currentVideoPLayer = new VideoPlayer()

    //var pEntity = engineApi.getEntity("2706955184");
    //currentVideoPLayer.addScreens(pEntity)

    //currentVideoPLayer.initialize(engineApi.canvas, canvas);



}



const onKeyOrMousePressed = async (e) =>
{

    console.log(currentPlayer.currentStatus);
    switch (currentPlayer.currentStatus) {
        case currentPlayer.status.MOVING:
            switch (e.which) {
                case 109:
                    onGodView();
                    currentPlayer.currentStatus = currentPlayer.status.CHECKING_MAP;
                    break;

                case 1:
                    openUI(e);

                default:
                    break;
            }
            break;

        case currentPlayer.status.CHECKING_MAP:
            switch (e.which) {
                case 109:
                    //onPeviousView();
                    break;

                case 1:
                    onMapSelecting(e);

                    break;

                case 0:
                    //const {entity, pickedPosition, pickedNormal} = await SDK3DVerse.engineAPI.castScreenSpaceRay(e.clientX, e.clientY, true, false);
                    break;

                default:
                    break;
            }
            break;

        default:
            break;
    }

    if(e.which === 112){
        console.log(viewport.getTransform());
    }else if (e.which === 0){
        //console.log(isTpe);
        //console.log(currentPlayer.currentStatus);
    }

}

const metadataParsedFromJSON = {
    train: { mass: 1000, volume: 200, deisgnation: "convoyeur Coke" }
};

async function openUI(e)
{
    let clickedEntity;
    const target = await SDK3DVerse.engineAPI.castScreenSpaceRay(
        e.clientX,
        e.clientY
    );

    if (!target.pickedPosition) return;
    clickedEntity = target.entity;
    console.log(clickedEntity);

    fetch('UI.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById("UI").innerHTML = html;
        })
        .catch(error => console.error('Erreur de chargement du fichier UI.html:', error));

}
function getMetadata(clickedEntity) {
    const tags = clickedEntity.getComponent('tags')?.value;

    if(tags) {
        for(const tag of tags) {
            if(tag.startsWith('metadata-')) {
                const metataDataKey = tag.replace("metadata-", "");
                return metadataParsedFromJSON[metataDataKey];
            }
        }
    }

    const parent = clickedEntity.getParent();
    if(!parent) {
        return null;
    }

    console.log("metadata not found, search into next parent:", parent.getName());

    return getMetadata(parent);
}

const onGodView = () =>
{
    cameraApi.travel(viewport, [612,618,497], [-0.3741917908191681,0.010681639425456524,0.004310362506657839,0.9272798299789429], 500);

}

const onMapSelecting = async (e) =>
{

    const {entity, pickedPosition, pickedNormal} = await SDK3DVerse.engineAPI.castScreenSpaceRay(e.clientX, e.clientY, true, false, true);
    //const entity = await SDK3DVerse.engineAPI.castScreenSpaceRay(e.clientX, e.clientY, true, true);

    let selectedUnit = engineApi.getSelectedEntities()[0];

    if(selectedUnit !== undefined){
        var childs = await selectedUnit.getChildren();

        for (const child of childs) {
            console.log(child.getName());
            if(child.getName() === "TP_POINT"){
                let childPos = child.getGlobalTransform().position;
                cameraApi.travel(viewport, childPos, [-0.037684690207242966, -0.6933388113975525, -0.03635463863611221, 0.7187068462371826], 300);
                currentPlayer.currentStatus = currentPlayer.status.MOVING;
            }
        }
    }
}
