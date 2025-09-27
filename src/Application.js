import {ResourceManager} from "./resources/ResourceManager.js";
import { TextureResource } from "./resources/TextureResource.js";
import { View } from "./View.js";
import { Renderer } from "./Renderer.js";
import {World} from "./world/World.js";
import { Rect } from "./Rect.js";
import {Sprite} from "./Sprite.js";
import { Level } from "./Level.js";
import { LevelLoader } from "./LevelLoader.js";
import { Camera } from "./Camera.js";


/**
 * Класс приложения.  Это движок для 2Д игры.  Все рисование идет только 2д спрайтами
 */
class Application {


    /** @type {Object} */
    options

    /** @type {View} */
    view

    /** @type {Renderer} */
    renderer

    // параметры цикла
    timestep = 1000 / 30   // логика обновляется каждые 16.6 мс (30 FPS)
    lastUpdate = 0
    
    // FPS счетчик
    frameCount = 0
    lastFpsUpdate = 0

    
    /** @type {LevelLoader} */
    levelLoader = null

    /** @type {Level} */
    level

    /** @type {Camera} */
    camera

    /** @type {Object} */
    keys = {}




    run(options) {
        this.options = options
        this.timestep = 1000 / options.fps
        console.log(`starting with timestep = ${this.timestep} ms`)

        this.view = new View(this.options.view)
        this.resourceManager = new ResourceManager(this.view.getContext3D())
        this.renderer = new Renderer(this.view, options.renderer)
        this.camera = this.renderer.camera
        this.setupControls()

        this.levelLoader = new LevelLoader(this.resourceManager)
        this.levelLoader.load('data/levels/test/testlevel.json')
        this.levelLoader.onLoad((level) => {
            this.onLevelLoaded(level)
        })
    }



    /**
     * @param {Level} level 
     */
    onLevelLoaded(level)
    {
        this.level = level
        this.startLoop();
    }



    startLoop()
    {
        this.lastUpdate = performance.now()
        this.lastFpsUpdate = performance.now()
        requestAnimationFrame(this.loop.bind(this))
    }



    setupControls() {
        document.addEventListener('keydown', (event) => {
            this.keys[event.code] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
    }

    /**
     * Создает 3000 тестовых спрайтов для проверки производительности
     */
    createTestSprites() {
        const spriteCount = 3000;
        const spriteSize = 50;
        const canvasWidth = this.view.canvas.width;
        const canvasHeight = this.view.canvas.height;
        
        console.log(`Создаем ${spriteCount} спрайтов с наложением для тестирования производительности`);
        
        for (let i = 0; i < spriteCount; i++) {
            // Генерируем случайные позиции в пределах canvas
            const x = Math.random() * (canvasWidth - spriteSize);
            const y = Math.random() * (canvasHeight - spriteSize);
            
            // Создаем прямоугольник для спрайта
            let rect = new Rect(x, y, spriteSize, spriteSize);
            
            // Получаем текстуру
            let texture = this.resourceManager.getTexture('/test.jpg');
            
            // Создаем спрайт
            let sprite = new Sprite(rect, texture);
            this.sprites.push(sprite);
        }
        
        console.log(`Создано ${this.sprites.length} спрайтов с наложением`);
    }

    update(dt) {
        // Управление камерой
        const moveDistance =  5;

        if (this.keys['KeyW'] || this.keys['ArrowUp']) {
            this.camera.moveBy(0, -moveDistance);
        }
        if (this.keys['KeyS'] || this.keys['ArrowDown']) {
            this.camera.moveBy(0, moveDistance);
        }
        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            this.camera.moveBy(-moveDistance, 0);
        }
        if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            this.camera.moveBy(moveDistance, 0);
        }

        this.level.update()
    }

    loop(now) {
        const elapsed = now - this.lastUpdate

        if (elapsed >= this.timestep) {
            // 1. обновляем логику с фиксированным шагом
            this.update(elapsed)

            this.lastUpdate = now

            // 2. если прошло слишком много времени → пропускаем рендер
            if (elapsed > this.timestep * 2) {
                requestAnimationFrame(this.loop.bind(this))
                return
            }

            // 3. отрисовываем
            this.renderer.render(this.level)
            
            // 4. увеличиваем счетчик кадров
            this.frameCount++
        }

        // 5. проверяем, прошла ли секунда для вывода FPS
        if (now - this.lastFpsUpdate >= 1000) {
            const fps = this.frameCount
            console.log(`FPS: ${fps}`)
            this.frameCount = 0
            this.lastFpsUpdate = now
        }

        // 6. продолжаем цикл
        requestAnimationFrame(this.loop.bind(this))
    }
}

export { Application }
