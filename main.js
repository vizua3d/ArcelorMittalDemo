window.addEventListener('load', initApp);
import {Player} from "./Player.js"

let canvas;
//let clickCounter = 0;

const { SDK3DVerse } = window;
const { engineAPI } = SDK3DVerse;
const { cameraAPI } = engineAPI;
let  viewport;
let player;

const topViewSettings = {
    position: [612,618,497],
    orientation: [-0.3741917908191681,0.010681639425456524,0.004310362506657839,0.9272798299789429],
    speed: 500
};
const floorViewSettings = {
    orientation: [-0.037684690207242966, -0.6933388113975525, -0.03635463863611221, 0.7187068462371826],
    speed: 300
};

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

    viewport = cameraAPI.getActiveViewports()[0];

    await SDK3DVerse.installExtension(SDK3DVerse_ThreeJS_Ext);

    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitPointerLockElement;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

    canvas.addEventListener('mouseup', onKeyOrMousePressed);
    canvas.addEventListener('keypress', onKeyOrMousePressed);
    canvas.addEventListener('click', onKeyOrMousePressed);
    //canvas.addEventListener('mousemove', onKeyOrMousePressed);

    player = new Player();

    //const videoPlayer = new VideoPlayer()
    //var pEntity = engineAPI.getEntity("2706955184");
    //videoPlayer.addScreens(pEntity)
    //videoPlayer.initialize(engineAPI.canvas, canvas);
}

const onKeyOrMousePressed = async (e) => {
    const { currentStatus } = player;
    console.log(`Player's status: ${currentStatus}`);

    switch (currentStatus) {
        case player.status.MOVING:
            switch (e.which) {
                case 109:
                    gotoTopView();
                    player.currentStatus = player.status.CHECKING_MAP;
                    break;
                case 1:
                    openUI(e);
                    break;
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
                    checkMap(e);
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

    if(e.which === 112) {
        console.log(viewport.getTransform());
    }
    else if (e.which === 0) {
        //console.log(isTpe);
        //console.log(currentPlayer.currentStatus);
    }
}

const metadataParsedFromJSON = {
    train: { mass: 1000, volume: 200, deisgnation: "convoyeur Coke" }
};

async function openUI(e) {
    const target = await SDK3DVerse.engineAPI.castScreenSpaceRay(
        e.clientX,
        e.clientY
    );

    if (!target.pickedPosition) {
        return;
    }

    console.debug("Clicked entity:", target.entity);
    fetch('UI.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById("UI").innerHTML = html;
        })
        .catch(error => {
            console.error('Erreur de chargement du fichier UI.html:', error);
        });
}

const gotoTopView = () => {
    const { position, orientation, speed } = topViewSettings;
    cameraAPI.travel(viewport, position, orientation, speed);
}

const checkMap = async (e) => {
    //const {entity, pickedPosition, pickedNormal} = 
    await engineAPI.castScreenSpaceRay(e.clientX, e.clientY, true, false, true);

    // Get the selected entity which may be different from the picked entity if it belongs to a scene linker
    let selectedUnit = engineAPI.getSelectedEntities()[0];
    if(!selectedUnit) {
        return;
    }

    const childs = await selectedUnit.getChildren();
    for (const child of childs) {
        console.debug('child entity:', child.getName());
        if(child.getName() === "TP_POINT"){
            const { position } = child.getGlobalTransform();
            const { orientation, speed } = floorViewSettings;
            cameraAPI.travel(viewport, position, orientation, speed);
            player.currentStatus = player.status.MOVING;
        }
    }
}

function getMetadata(entity) {
    const tags = entity.getComponent('tags')?.value || [];
    for(const tag of tags) {
        if(tag.startsWith('metadata-')) {
            const metataDataKey = tag.replace("metadata-", "");
            return metadataParsedFromJSON[metataDataKey];
        }
    }

    const parent = entity.getParent();
    if(!parent) {
        return null;
    }

    console.debug("Metadata not found, search into next parent:", parent.getName());
    return getMetadata(parent);
}
