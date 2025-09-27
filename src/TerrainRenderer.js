import { Renderer } from "./Renderer.js"
import { Terrain } from "./Terrain.js"

class TerrainRenderer
{

    /** @type {Renderer} */
    renderer = null

    constructor(renderer)
    {
        this.renderer = renderer
    }

    /** @type {Terrain} */
    render(terrain)
    {
        let camera = this.renderer.camera


        // Получаем все спрайты слоя террейна
        const sprites = terrain.layer.sprites;
        const visibleSprites = [];

        for (let i = 0; i < sprites.length; i++) {
            const sprite = sprites[i];
            // Проверяем, видим ли спрайт в камере
            if (
                camera.isVisible(
                    sprite.rect.x,
                    sprite.rect.y,
                    sprite.rect.width,
                    sprite.rect.height
                )
            ) {
                visibleSprites.push(sprite);
            }
        }

        // Отправляем видимые спрайты на рендеринг
        this.renderer.spriteRenderer.render(visibleSprites, camera);
    }
}

export {TerrainRenderer}