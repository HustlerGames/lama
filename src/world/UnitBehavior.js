import {Behavior} from "./Behavior.js";

class UnitBehavior extends Behavior
{
    unit
    context


    constructor() {
        super()
    }



    update() {
        super.update ();

        let target = {x:0,y:0}

        if(this.unit.position.x < 3 && this.unit.position.y < 3)
        {
            target = {x:49,y:1}
        }

        if(this.unit.position.x > 48 && this.unit.position.y < 2)
        {
            target = {x:49,y:49}
        }

        if(this.unit.position.x > 48 && this.unit.position.y > 48)
        {
            target = {x:0,y:0}
        }

        this.moveTo(target.x, target.y)
    }

    moveTo(x, y) {
        let pos_x = this.unit.position.x;
        let pos_y = this.unit.position.y;

        // Вектор до цели
        let dx = x - pos_x;
        let dy = y - pos_y;

        // Длина (расстояние до цели)
        let dist = Math.sqrt(dx*dx + dy*dy);

        if (dist > 0.01) { // чтобы не "дрожал" около цели
            let speed = 0.1; // скорость передвижения

            // Нормализованный вектор движения
            let vx = dx / dist;
            let vy = dy / dist;

            // Двигаем юнит
            this.unit.position.x += vx * speed;
            this.unit.position.y += vy * speed;
        }
    }



}
export {UnitBehavior}