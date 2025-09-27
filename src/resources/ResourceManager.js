// ResourceManager.js
import { TextureResource } from "./TextureResource.js";

class ResourceManager {

    constructor(context) {
        this.context = context
        this.loadCounter = 0
        this.callback = null
        this.textures = {}
    }


    getTexture(url) {
        // Если уже есть объект ресурса → вернуть сразу
        if (this.textures[url]) {
            return this.textures[url];
        }
        // Иначе загрузить
        return this._loadTexture(url);
    }


    counterDown()
    {
        this.loadCounter--;
        if(this.loadCounter === 0) {
            if(this.callback)
                this.callback()
        } 
    }

    counterUp()
    {
        this.loadCounter++;
    }



    _loadTexture(url) {
        // Создаём пустой ресурс-заглушку
        const resource = new TextureResource();
        this.textures[url] = resource;

        this.counterUp();

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            let webglTexture = this.createTextureFromImage(img)
            resource.textureWidth = img.width
            resource.textureHeight = img.height
            resource.webglTexture = webglTexture;
            resource.markLoaded();
            console.log(`Текстура загружена: ${url}`);
            this.counterDown()
        };
        img.onerror = (err) => {
            this.counterUp();
            console.error(`Ошибка загрузки текстуры: ${url}`, err);
        };
        img.src = url;

        return resource; // возвращаем ссылку сразу
    }


    createTextureFromImage(img){
        // Создаем WebGL текстуру из изображения
        const gl = this.context;
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

        // Устанавливаем параметры фильтрации и обертки
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        gl.bindTexture(gl.TEXTURE_2D, null);

        return texture;
    }

    onLoad(callback) {
        this.callback = callback
    }
}

export { ResourceManager }
