import { Terrain } from "./Terrain.js"


class Level
{
    /** @type string Название уровня */
    name


    units = []

    passability

    /** @type {Terrain} */
    terrain

    constructor() {

    }

    soldiersTileset


    animations = {}

    update()
    {
        this.units.forEach((unit) => {
            unit.update()
        })
    }
}

export {Level}