import { Rect } from './Rect.js'
import { TextureResource } from './resources/TextureResource.js'
import { UVRect } from './UVRect.js'
import {Vector2d} from "./Vector2d.js";


class Sprite
{
    /** @type {TextureResource} */
    texture
    /** @type {Rect} */
    rect

    /** @type {UVRect} */
    uvRect

    /** @type {Vector2d} */
    offset

    /**
     * @param {Rect} rect - Позиция и размер спрайта (x, y, width, height)
     * @param {TextureResource} texture
     * @param {UVRect} uvRect
     * @param {Vector2d} offset
     */
    constructor(
        rect = new Rect(0, 0, 1, 1),
        texture = null,
        uvRect = new UVRect(0, 0, 1, 1),
        offset = new Vector2d(0,0)
    ) {
        this.rect = rect
        this.texture = texture
        this.uvRect = uvRect
        this.offset = offset
    }

    // Удобные геттеры/сеттеры для позиции
    get x() { return this.rect.x; }
    set x(value) { this.rect.x = value; }
    
    get y() { return this.rect.y; }
    set y(value) { this.rect.y = value; }
    
    get width() { return this.rect.width; }
    set width(value) { this.rect.width = value; }
    
    get height() { return this.rect.height; }
    set height(value) { this.rect.height = value; }
}

export {Sprite}