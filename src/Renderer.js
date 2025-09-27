import { View } from './View.js'
import {Sprite} from "./Sprite.js";
import {Rect} from "./Rect.js";
import {SpriteRenderer} from "./SpriteRenderer.js";
import { TerrainRenderer } from './TerrainRenderer.js';
import { Camera } from './Camera.js';
import {UnitRenderer} from "./world/UnitRenderer.js";



class Renderer
{
    options = null

    /** @type {View} */
    view = null
    context = null

    /** @type {Camera} */
    camera


    constructor(view, options) {
        this.options = options
        this.view = view
        this.context = this.view.getContext3D()
        this.camera = new Camera(0, 0, this.view.canvas.width, this.view.canvas.height)
        this.spriteRenderer = new SpriteRenderer(this.context)
        this.terrainRenderer = new TerrainRenderer(this)
        this.unitRenderer = new UnitRenderer(this)
    }


    /**
     *
     * @param {array} sprites
     */
    render(level)
    {
        this.clear()
        this.terrainRenderer.render(level.terrain)
        this.unitRenderer.render(level)
    }

    clear() {
        this.context.clearColor(0, 0, 0, 1)
        this.context.clear(this.context.COLOR_BUFFER_BIT)
    }
}


export { Renderer }