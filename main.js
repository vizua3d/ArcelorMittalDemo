window.addEventListener('load', initApp);

let canvas;
let clickCounter = 0;
let isMoving = false;
let hasMoved = false;

const { SDK3DVerse } = window;
const { engineAPI } = SDK3DVerse;
const { cameraAPI } = engineAPI;
let  viewport;

let infoUtilitiesPanel;
let infoUtilitiesData;
let cokeriePanel;
let cokerieData;
let sinterPanel;
let sinterData;

async function initApp() {
    tailwind.config = {
        theme: {
            extend: {
            colors: {
                clifford: '#da373d',
            }
            }
        }
    };

    canvas = document.getElementById('display-canvas');
    await SDK3DVerse.joinOrStartSession({
        userToken: AppConfig.userToken,
        sceneUUID: AppConfig.mainScene,
        canvas,
        viewportProperties: {
            defaultControllerType: SDK3DVerse.controller_type.editor,
            //defaultControllerType: SDK3DVerse.controller_type.orbit,
        },
        defaultCameraSpeed: 3,
        connectToEditor: true
    });

    viewport = cameraAPI.getActiveViewports()[0];

    await SDK3DVerse.installExtension(SDK3DVerse_ThreeJS_Ext);
    await SDK3DVerse.installExtension(SDK3DVerse_ViewportDomOverlay_Ext);
    //PAF Start
    await SDK3DVerse.installExtension(SDK3DVerse_LabelDisplay_Ext);
    //PAF End
    canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock || canvas.webkitPointerLockElement;
    document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('keypress', onKeyPressed);

    bindControls();

    infoUtilitiesPanel = document.getElementById('info_utilities');
    infoUtilitiesData = document.getElementById('info_utilities_data');

    cokeriePanel = document.getElementById('info_coke');
    cokerieData = document.getElementById('info_coke_data');

    sinterPanel = document.getElementById('info_sinter');
    sinterData = document.getElementById('info_sinter_data');

    SDK3DVerse.notifier.on('onEntitySelectionChanged', onSelectionChanged);
}

function onSelectionChanged(selectedEntities, unselectedEntities)
{
    const selectedEntity = selectedEntities[0];
    console.log('Selected', selectedEntity);
    if(!selectedEntity?.isAttached('scene_ref')) {
        // allow to select only specific entities
        unselect();
        return;
    }

    const sceneLinked = selectedEntity.getComponent('scene_ref').value;
    console.log('Selected linked scene', sceneLinked);
    switch(sceneLinked)
    {
        case AppConfig.scenes.cokerie:
            cokerieData.innerHTML = ArcelorData.processes[0].materials.map(utility => HTMLTemplates.renderCokerieCard(utility)).join('\n');
            cokeriePanel.classList.remove('hidden');
            break;
        case AppConfig.scenes.sinter:
            sinterData.innerHTML = HTMLTemplates.renderSinterCard(ArcelorData.processes[1]);
            sinterPanel.classList.remove('hidden');
            break;
        case AppConfig.scenes.furnace:
            infoUtilitiesData.innerHTML = ArcelorData.utilities.map(utility => HTMLTemplates.renderUtilityCard(utility)).join('\n');
            infoUtilitiesPanel.classList.remove('hidden');
            break;
        default:
            // allow to select only specific entities
            unselect();
            break;
    }
}

function unselect() {
    SDK3DVerse.engineAPI.unselectAllEntities();
    cokeriePanel.classList.add('hidden');
    sinterPanel.classList.add('hidden');
    infoUtilitiesPanel.classList.add('hidden');
}

const onKeyPressed = async (e) => {
}

let mouseStartPos = null;
const onMouseDown = (e) =>
{
    if(clickCounter == 0) {
        mouseStartPos = { x: e.clientX, y: e.clientY };
    }

    // Increase a counter to keep track of how many mouse buttons are held
    clickCounter++;
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousemove', onMouseMove);
    if(!isMoving) {
        canvas.removeEventListener('mouseup', onMouseUp);
        canvas.addEventListener('mouseup', onMouseUp);
    }
};
const onMouseMove = (e) =>
{
    const deltaX = Math.abs(mouseStartPos.x - e.clientX);
    const deltaY = Math.abs(mouseStartPos.y - e.clientY);
    if(deltaX < 20 &&  deltaY < 20) {
        return;
    }

    // Lock the mouse pointer to make mouse pointer disappear
    // as soon as the mouse has moved with a mouse button held down
    isMoving = true;
    canvas.requestPointerLock();
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseup', onMouseUpAfterMove);
};
const onMouseUpAfterMove = () =>
{
    // Exit the mouse pointer lock to make it appear back once all mouse buttons are released
    if(clickCounter > 0 && --clickCounter === 0) {
        canvas.removeEventListener('mouseup', onMouseUpAfterMove);
        isMoving = false;
        document.exitPointerLock();
    }
};

const onMouseUp = async (e) =>
{
    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
    clickCounter = 0;

    const selectEntity = true;
    const keepOldSelection = false;
    const seekExternalLinker = true;
    const options = [selectEntity, keepOldSelection, seekExternalLinker];
    SDK3DVerse.engineAPI.unselectAllEntities();
    const { entity } = await SDK3DVerse.engineAPI.castScreenSpaceRay(e.clientX, e.clientY, ...options);
    console.log("pick", entity?.getName())
};

// Utility function that help to associate a entry in the data.json or data.js to
// to an entity if the scene by using the tags component with some arbitrary naming "metadata-" of a tag
/*
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
*/