import {Resource} from "./Resource.js";

class TextureResource extends Resource
{
    webglTexture = null
    textureWidth = 0
    textureHeight = 0

    constructor() {
        super();
    }


    getHeight()
    {
        return this.textureHeight;
    }

    getWidth()
    {
        return this.textureWidth;
    }

}

export {TextureResource}