import {Isometria} from "../Isometria.js";

class UnitRenderer
{
    renderer
    constructor(parent) {
        this.renderer = parent
    }


    render(level) {

        let sprites = [];

        for(let id in level.units) {
            let unit = level.units[id]
            let name = unit.animation.currentAnimation
            let animation = level.animations[name]
            let totalFrames = animation.frames
            let tickCount = unit.animation.counter
            let frameIndex = tickCount % totalFrames
            let sprite = animation.getSprite(frameIndex, unit.direction)
            let spritePosition = Isometria.worldToScreenPoint(
                unit.position.x,
                unit.position.y,
                0,
                level.tileWidth,
                level.tileHeight
            )

            sprite.x = spritePosition.x - sprite.offset.x
            sprite.y = spritePosition.y - sprite.offset.y

            sprites.push(sprite)
        }

        this.renderer.spriteRenderer.render(sprites, this.renderer.camera)
    }

}
export {UnitRenderer}