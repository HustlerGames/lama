import { Sprite } from "./Sprite.js";
import { SpriteRendererShaderProgram } from "./SpriteRendererShaderProgram.js";

class SpriteRenderer
{

    constructor(context) 
    {
        this.context = context;
        this.maxSprites = 5000; // Максимальное количество спрайтов
        this.verticesPerSprite = 4; // 4 вершины на спрайт (квад)
        this.indicesPerSprite = 6; // 6 индексов на спрайт (2 треугольника)
        
        // Буферы данных
        this.vertexData = new Float32Array(this.maxSprites * this.verticesPerSprite * 4); // x, y, u, v
        this.indexData = new Uint16Array(this.maxSprites * this.indicesPerSprite);

        // Создаем буфер вершин
        this.vertexBuffer =  this.context.createBuffer();
        this.context.bindBuffer( this.context.ARRAY_BUFFER, this.vertexBuffer);
        this.context.bufferData( this.context.ARRAY_BUFFER, this.vertexData,  this.context.DYNAMIC_DRAW);


        // Генерируем индексы для всех спрайтов заранее
        for (let i = 0; i < this.maxSprites; i++) {
            const baseIndex = i * this.verticesPerSprite;
            const indexOffset = i * this.indicesPerSprite;
            
            // Первый треугольник: 0, 1, 2
            this.indexData[indexOffset + 0] = baseIndex + 0;
            this.indexData[indexOffset + 1] = baseIndex + 1;
            this.indexData[indexOffset + 2] = baseIndex + 2;
            
            // Второй треугольник: 0, 2, 3
            this.indexData[indexOffset + 3] = baseIndex + 2;
            this.indexData[indexOffset + 4] = baseIndex + 1;
            this.indexData[indexOffset + 5] = baseIndex + 3;
        }

        // Создаем буфер индексов
        this.indexBuffer =  this.context.createBuffer();
        this.context.bindBuffer( this.context.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.context.bufferData( this.context.ELEMENT_ARRAY_BUFFER, this.indexData,  this.context.STATIC_DRAW);

        this.spriteRendererShaderProgram = new SpriteRendererShaderProgram(this.context);
        this.spriteRendererShaderProgram.compile();
    }


    updateVertices(sprites, offset) {
        for (let i = 0; i < sprites.length; i++) {
            const sprite = sprites[i];
            const vertexOffset = i * this.verticesPerSprite * 4;

            // Используем UV координаты из спрайта
            const u1 = sprite.uvRect ? sprite.uvRect.u1 : 0.0;
            const v1 = sprite.uvRect ? sprite.uvRect.v1 : 0.0;
            const u2 = sprite.uvRect ? sprite.uvRect.u2 : 1.0;
            const v2 = sprite.uvRect ? sprite.uvRect.v2 : 1.0;

            // Верхний левый угол
            this.vertexData[vertexOffset + 0] = sprite.rect.x - offset.x;
            this.vertexData[vertexOffset + 1] = sprite.rect.y - offset.y;
            this.vertexData[vertexOffset + 2] = u1;
            this.vertexData[vertexOffset + 3] = v1;

            // Верхний правый угол
            this.vertexData[vertexOffset + 4] = sprite.rect.x + sprite.rect.width +  - offset.x;
            this.vertexData[vertexOffset + 5] = sprite.rect.y  - offset.y;
            this.vertexData[vertexOffset + 6] = u2;
            this.vertexData[vertexOffset + 7] = v1;
            
            // Нижний левый угол
            this.vertexData[vertexOffset + 8] = sprite.rect.x - offset.x;
            this.vertexData[vertexOffset + 9] = sprite.rect.y + sprite.rect.height - offset.y;
            this.vertexData[vertexOffset + 10] = u1;
            this.vertexData[vertexOffset + 11] = v2;

            // Нижний правый угол
            this.vertexData[vertexOffset + 12] = sprite.rect.x + sprite.rect.width - offset.x;
            this.vertexData[vertexOffset + 13] = sprite.rect.y + sprite.rect.height - offset.y;
            this.vertexData[vertexOffset + 14] = u2;
            this.vertexData[vertexOffset + 15] = v2;
        }

        // Загружаем обновленные данные в буфер
        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.vertexBuffer);
        this.context.bufferSubData(this.context.ARRAY_BUFFER, 0, this.vertexData);
    }


    /**
     * 
     * @param {Sprite} sprites 
     * @param {Object} offset
     */
    render(sprites, offset = {x:0, y:0})
    {
        if (sprites.length === 0) return;
        
        // Проверяем, не превышает ли количество спрайтов лимит буфера
        if (sprites.length > this.maxSprites) {
            console.warn(`Количество спрайтов (${sprites.length}) превышает лимит буфера (${this.maxSprites}). Рендерим только первые ${this.maxSprites} спрайтов.`);
            sprites = sprites.slice(0, this.maxSprites);
        }

        let gl = this.context;

        // Обновляем данные вершин
        this.updateVertices(sprites, offset);

        // Используем шейдерную программу
        this.spriteRendererShaderProgram.use();
        this.spriteRendererShaderProgram.setResolution(this.context.canvas.width, this.context.canvas.height)
        
        // Настраиваем атрибуты
        const posLocation = this.spriteRendererShaderProgram.getAttribLocation('aPos');
        const texCoordLocation = this.spriteRendererShaderProgram.getAttribLocation('aTexCoord');
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        
        // Настраиваем атрибут позиции
        gl.enableVertexAttribArray(posLocation);
        gl.vertexAttribPointer(posLocation, 2, gl.FLOAT, false, 16, 0); // 16 байт на вершину
        
        // Настраиваем атрибут текстурных координат
        gl.enableVertexAttribArray(texCoordLocation);
        gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 16, 8); // смещение 8 байт

        // Устанавливаем текстуру для рендера
        if (sprites[0].texture && sprites[0].texture.webglTexture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, sprites[0].texture.webglTexture);
            // Устанавливаем uniform для сэмплера
            const samplerLocation = this.spriteRendererShaderProgram.getUniformLocation('uSampler');
            gl.uniform1i(samplerLocation, 0);
        }
        // Привязываем буфер индексов
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        // Рендерим все спрайты одним вызовом
        const indexCount = sprites.length * this.indicesPerSprite;
        gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
        
        // Отключаем атрибуты
        gl.disableVertexAttribArray(posLocation);
        gl.disableVertexAttribArray(texCoordLocation);
    }
}

export {SpriteRenderer}