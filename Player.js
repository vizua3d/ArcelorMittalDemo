export class Player {

    constructor(engineApi, cameraApi, viewportEntity, cameraEntity) {
        this.engineApi = engineApi;
        this.cameraApi = cameraApi;
        this.viewportEntity = viewportEntity;
        this.cameraEntity = cameraEntity;
        this.status = {
            MOVING: 0,
            CHECKING_MAP: 1
        }

        this.currentStatus = this.status.MOVING;
    }



}