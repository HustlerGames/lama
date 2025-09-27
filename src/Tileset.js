import { Rect } from './Rect.js'
import { UVRect } from './UVRect.js'
import { TextureResource } from './resources/TextureResource.js'


/**
 * Этот класс представляет набор спрайтов.  Он содержит текстуру 
 * со множеством спрайтов, расположенных в виде таблицы. Размеры спрайтов одинкавы. 
 * Это для простоты на данном этапе разработки.
 */
class Tileset
{
    /** @type TextureResource */
    texture = null

    /** @type string Имя набора */
    name = ''

    /** @type int Сколько колонок спрайтов в текстуре */
    cols = 0

    /** @type int Сколько строк спрайтов в текстуре */
    rows = 0

    /** @type int смещение от (0,0)  где начинается таблица спрайтов  */
    offset = 0

    /** @type int граница между спрайтами  */
    border = 0

    /** @type int Ширина тайла */
    tileWidth = 50

    /** @type int Высота тайла */
    tileHeight = 30


    tileOffsetX = 0
    tileOffsetY = 0

    

    /**
     * Возвращает позицию спрайта в виде Rect на текстуре
     * 
     * @param {int} n
     * @returns {Rect}  
     */
    getTileRect(n)
    {
        if (!this.texture || this.cols === 0 || this.rows === 0) {
            return new Rect(0, 0, 0, 0);
        }

        // Вычисляем позицию спрайта в таблице
        const col = n % this.cols;
        const row = Math.floor(n / this.cols);

        // Вычисляем абсолютные координаты на текстуре
        // Используем фиксированные размеры тайлов
        const x = this.offset + col * (this.tileWidth + this.border);
        const y = this.offset + row * (this.tileHeight + this.border);

        return new Rect(x, y, this.tileWidth, this.tileHeight);
    }


    /**
     * Возвращает позицию спрайта в виде UV координат [u1, v1, u2, v2]
     * (u1, v1) - верхний левый угол текстуры, 
     * (u2, v2) - нижний правый угол текстуры, 
     * 
     * n - порядковый номер , нумерация идет по строкам, 
     * например если col=5 row=2  n=7,  то это спрайт в 3 колонке и 2 строке
     * 
     * @param {int} n
     * @returns {UVRect}  
     */
    getTileUVRect(n)
    {
        if (!this.texture || this.cols === 0 || this.rows === 0) {
            return new UVRect(0, 0, 0, 0);
        }

        // Получаем прямоугольник спрайта в пикселях
        const rect = this.getTileRect(n);
        
        // Конвертируем в UV координаты (нормализованные от 0 до 1)
        // Используем размеры текстуры для нормализации
        const u1 = rect.x / this.texture.getWidth();
        const v1 = rect.y / this.texture.getHeight();
        const u2 = (rect.x + this.tileWidth) / this.texture.getWidth();
        const v2 = (rect.y + this.tileHeight) / this.texture.getHeight();

        return new UVRect(u1, v1, u2, v2);
    }


    getTexture()
    {
        return this.texture;
    }
    
}


export {Tileset}