import { ResourceManager } from "./resources/ResourceManager.js"
import { Level } from "./Level.js";
import { Tilemap } from "./Tilemap.js"
import { Layer } from "./Layer.js";
import { Isometria } from "./Isometria.js";
import { Sprite } from "./Sprite.js";
import { Terrain } from "./Terrain.js";
import { Tileset } from "./Tileset.js";
import {Unit} from "./world/Unit.js";
import {Animation} from "./Animation.js";


class LevelLoader
{
    /** @type {(level: Level) => void}  Функция , вызываемая после загрузки уровня*/
    callback = null

    onLoad(callback) {
        this.callback = callback
    }

    /**
     * 
     * @param {ResourceManager} rm 
     */
    constructor(rm) {
        this.rm = rm
    }

    load(url) {

        return fetch(url)
            .then(response => response.json())
            .then(json => {
                // json - это объект уровня
                this.preload(json);
            })
            .catch(error => {
                console.error("Ошибка загрузки уровня:", error);
                throw error;
            });
    }

    init(data)
    {
        let level = new Level()
        level.name = data.name;
        level.passability = data.passability
        level.tileWidth = data.tileWidth
        level.tileHeight = data.tileHeight
        level.terrain = this.initTerrain(data)
        level.animations = this.loadAnimations(data.animations)

        let unit = new Unit()
        unit.position.x = 10;
        unit.position.y = 10;
        level.units.push(unit);

        unit = new Unit()
        unit.position.x = 15;
        unit.position.y = 45;
        level.units.push(unit);


        unit = new Unit()
        unit.position.x = 20;
        unit.position.y = 13;
        level.units.push(unit);

        unit = new Unit()
        unit.position.x = 40;
        unit.position.y = 20;
        level.units.push(unit);

        this.callback(level);
    }

    preload(data)
    {
        data.textures.forEach((url) => {
            this.rm.getTexture(url)
        });

        this.rm.onLoad(() => {
            this.init(data)
        });
    }

    initTerrain(config)
    {
        let terrain = new Terrain()
        terrain.tilemap = this.loadTilemap(config.tilemap)
        terrain.layer = new Layer();
        terrain.layer.sprites = this.loadSprites(terrain.tilemap)
        return terrain;
    }



    loadSprites(tilemap)
    {
        const tileset = tilemap.tileset;
        const tileWidth = tileset.tileWidth
        const tileHeight = tileset.tileHeight

        let sprites = []

        tilemap.tiles.forEach((row, y) => {
            row.forEach((tile, x) => {
                let sprite = new Sprite();
                sprite.texture = tileset.getTexture()
                sprite.uvRect = tileset.getTileUVRect(tile);
                sprite.rect = Isometria.getSpriteRect(x, y, tileWidth, tileHeight)
                sprites.push(sprite);
            });
        });

        return sprites;
    }

    loadTilemap(config)
    {
        let tilemap = new Tilemap()
        tilemap.tiles = config.tiles
        tilemap.tileset = this.loadTileset(config.tileset)
        return tilemap;
    }



     /**
     * Получает конфигурацию
     * 
     * {
            "name": "grass-1",
            "offset": 1,
            "border": 1,
            "cols": 2,
            "rows": 4,
            "tileWidth": 64,
            "tileHeight": 32
        }
     * @param {Object} options 
        @returns {Tileset}
     */
    loadTileset(options)
    {
        let tileset = new Tileset()
        tileset.cols = options.cols
        tileset.rows = options.rows
        tileset.border = options.border
        tileset.offset = options.offset
        tileset.name = options.name
        tileset.tileWidth = options.tileWidth
        tileset.tileHeight = options.tileHeight
        tileset.tileOffsetX = options.tileOffsetX
        tileset.tileOffsetY = options.tileOffsetY
        tileset.texture = this.rm.getTexture(options.url)
        return tileset;
    }



    loadAnimations(animations)
    {
        let collection = {}

        for (let id in animations) {
            let config = animations[id]
            let animation = new Animation()
            animation.tileset = this.loadTileset(config.tileset)
            animation.loop = config.loop
            animation.speed = config.speed
            animation.frames = config.frames
            animation.layers = config.layers
            collection[id] = animation
        }

        return collection;
    }


}


export {LevelLoader}