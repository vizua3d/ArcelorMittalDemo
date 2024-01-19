import AppConfig from './AppConfig.mjs';

export async function bindControls() {
    const { animationSequences: anims, scenes, animationLabels: labels } = AppConfig;
    console.log("Reset camera");

    const sceneRefs = await SDK3DVerse.engineAPI.findEntitiesByComponents({ mandatoryComponents: ['scene_ref'] });
    const cokerieSceneEntity = sceneRefs.find(e => e.getComponent('scene_ref').value === scenes.cokerie);

    bindClick('btn_reset_camera', resetCamera);
    bindClick('btn_play_all', () => play(anims.all, labels.lbl_all));
    bindClick('btn_play_1', () => play(anims.main_1, labels.lbl_main_1));
    bindClick('btn_play_2', () => play(anims.main_2, labels.lbl_main_2));
    bindClick('btn_play_3', () => play(anims.main_3, labels.lbl_main_3));
    bindClick('btn_play_all_cokerie', () => play(anims.coke_all, labels.lbl_coke_all, cokerieSceneEntity));
    bindClick('btn_play_cokerie_1', () => play(anims.coke_1, labels.lbl_coke_1, cokerieSceneEntity));
    bindClick('btn_play_cokerie_2', () => play(anims.coke_2, labels.lbl_coke_2, cokerieSceneEntity));
    bindClick('btn_play_cokerie_3', () => play(anims.coke_3, labels.lbl_coke_3, cokerieSceneEntity));
    bindClick('btn_play_cokerie_4', () => play(anims.coke_2, labels.lbl_coke_2, cokerieSceneEntity, { playbackSpeed: -1, seekOffset: 1 }));
}

function getElement(id) {
    return document.getElementById(id);
}

function bindClick(id, callback) {
    const element = getElement(id);
    return element.addEventListener('click', callback);
}

function resetCamera() {
    console.log("Reset camera");
    const viewport = SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0];
    viewport.reset(true, 1);
}

async function play(uuid, labelId, linker, { playbackSpeed, seekOffset } = {seekOffset: 0, playbackSpeed: 1}) {
    console.log("labelId:", labelId);
    console.log("Play anim:", uuid, linker?.getName(), playbackSpeed, seekOffset);

    const eLabel = await SDK3DVerse.engineAPI.findEntitiesByEUID(labelId);
    SDK3DVerse.extensions.LabelDisplay.onLabelClicked( eLabel[0]);
    SDK3DVerse.engineAPI.playAnimationSequence(uuid, {seekOffset, playbackSpeed}, linker);
}
