import {Vector2d} from "../Vector2d.js";
import {UnitBehavior} from "./UnitBehavior.js";
import {AnimationHandler} from "../AnimationHandler.js";

class Unit
{
    /** @type {Vector2d} Позиция объекта в мире */
    position

    /** @type {UnitBehavior} Поведение объекта */
    behavior

    animations = []
    current_animation
    direction


    constructor() {
        this.position = new Vector2d(0,0)
        this.behavior = new UnitBehavior()
        this.behavior.unit = this
        this.direction = 1
        this.animation = new AnimationHandler();
        this.animation.start('soldier-walk');
    }

    update()
    {
        this.behavior.update()
        this.animation.update()
    }
}
export {Unit}