console.log("woot?!")
let btnResetCamera;
let btnPlayAll;
let btnPlay1;
let btnPlay2;
let btnPlay3;
let btnPlayCokerieAll;
let btnPlayCokerie1;
let btnPlayCokerie2;
let btnPlayCokerie3;
let btnPlayCokerie4;

async function bindControls() {
    btnResetCamera = document.getElementById('btn_reset_camera');
    btnPlayAll = document.getElementById('btn_play_all');
    btnPlay1 = document.getElementById('btn_play_1');
    btnPlay2 = document.getElementById('btn_play_2');
    btnPlay3 = document.getElementById('btn_play_3');
    btnPlayCokerieAll = document.getElementById('btn_play_all_cokerie');
    btnPlayCokerie1 = document.getElementById('btn_play_cokerie_1');
    btnPlayCokerie2 = document.getElementById('btn_play_cokerie_2');
    btnPlayCokerie3 = document.getElementById('btn_play_cokerie_3');
    btnPlayCokerie4 = document.getElementById('btn_play_cokerie_4');

    const { animationSequences: anims, scenes } = AppConfig;
    const sceneRefs = await SDK3DVerse.engineAPI.findEntitiesByComponents({ mandatoryComponents: ['scene_ref'] });
    const cokerieSceneEntity = sceneRefs.find(e => e.getComponent('scene_ref').value === scenes.cokerie);

    btnResetCamera.addEventListener('click', resetCamera);
    btnPlayAll.addEventListener('click', () => playAnimationSequence(anims.all));
    btnPlay1.addEventListener('click', () => playAnimationSequence(anims.main_1));
    btnPlay2.addEventListener('click', () => playAnimationSequence(anims.main_2));
    btnPlay3.addEventListener('click', () => playAnimationSequence(anims.main_3));
    btnPlayCokerieAll.addEventListener('click', () => playAnimationSequence(anims.coke_all, cokerieSceneEntity));
    btnPlayCokerie1.addEventListener('click', () => playAnimationSequence(anims.coke_1, cokerieSceneEntity));
    btnPlayCokerie2.addEventListener('click', () => playAnimationSequence(anims.coke_2, cokerieSceneEntity));
    btnPlayCokerie3.addEventListener('click', () => playAnimationSequence(anims.coke_3, cokerieSceneEntity));
    btnPlayCokerie4.addEventListener('click', () => playAnimationSequence(anims.coke_2, cokerieSceneEntity, { playbackSpeed: -1, seekOffset: 1 }));
}

function resetCamera() {
    console.log("Reset camera");
    const viewport = SDK3DVerse.engineAPI.cameraAPI.getActiveViewports()[0];
    viewport.reset(true, 1);
}

function playAnimationSequence(uuid, linker, { playbackSpeed, seekOffset } = {seekOffset: 0, playbackSpeed: 1}) {
    console.log("Play anim:", uuid, linker?.getName(), playbackSpeed, seekOffset);
    SDK3DVerse.engineAPI.playAnimationSequence(uuid, {seekOffset, playbackSpeed}, linker);
}