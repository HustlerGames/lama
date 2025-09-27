import {Tileset} from "./Tileset.js";
import {Sprite} from "./Sprite.js";
import {Rect} from "./Rect.js";

class Animation
{
    /** @type {Tileset} */
    tileset

    constructor() {
    }

    speed = 1

    loop = true

    layers = [
        { sequence: [1,2,3,4] },
        { sequence: [1,2,3,4] },
        { sequence: [1,2,3,4] },
        { sequence: [1,2,3,4] },
        { sequence: [1,2,3,4] },
        { sequence: [1,2,3,4] },
        { sequence: [1,2,3,4] },
        { sequence: [1,2,3,4] },
        { sequence: [1,2,3,4] },
    ]

    getSprite(frameIndex, layer)
    {
        let tile = this.layers[layer].sequence[frameIndex]

        let sprite = new Sprite();
        sprite.texture = this.tileset.getTexture()
        sprite.uvRect = this.tileset.getTileUVRect(tile);
        sprite.rect = new Rect(0,0, this.tileset.tileWidth, this.tileset.tileHeight)
        sprite.offset.x = this.tileset.tileOffsetX
        sprite.offset.y = this.tileset.tileOffsetY
        return sprite
    }


}
export {Animation}