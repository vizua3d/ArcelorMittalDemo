export class Player {
    constructor() {
        this.status = {
            MOVING: 0,
            CHECKING_MAP: 1
        }

        this.currentStatus = this.status.MOVING;
    }
}