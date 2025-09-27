import { Rect } from "./Rect.js"

/**
 * Математические функции для поддержки изометрии
 * мир рисуется изометрически тайлами, ромбовидными.  Система координат
 * Z ― это “высота” (вверх).
 * X и Y ― это плоскость, повернутая так, что оси не ортогональны (обычно под углом 120° друг к другу).
 * То, что ты описал:
 * Z ↑ (вверх),
 * X ↙ (по диагонали влево-вниз),
 * Y ↘ (по диагонали вправо-вниз).
 */
class Isometria
{
    /**
     * Возвращает экранные координаты спрайта по координатам тайла в изометрии.
     * @param {number} tileX - координата тайла по X
     * @param {number} tileY - координата тайла по Y
     * @param {number} tileWidth - ширина тайла (спрайта)
     * @param {number} tileHeight - высота тайла (спрайта)
     * @returns {Rect} - экранные координаты спрайта
     */
    static getSpriteRect(tileX, tileY, tileWidth, tileHeight)
    {
        let x = (tileX - tileY) * (tileWidth / 2) - tileWidth / 2
        let y = (tileX + tileY) * (tileHeight / 2)
        return new Rect(x, y, tileWidth, tileHeight)
    }

    /**
     * Преобразует экранные координаты в мировые координаты тайла
     * @param {number} screenX
     * @param {number} screenY
     * @param {number} tileWidth
     * @param {number} tileHeight
     * @param {Object} offset
     * @returns {{tileX:number, tileY:number}}
     */
    static screenToTile(screenX, screenY, tileWidth, tileHeight, offset) {
        // добавляем обратно смещение камеры
        const worldX = screenX + offset.x
        const worldY = screenY + offset.y

        // обратные формулы для изометрии:
        const tileX = Math.floor((worldX / (tileWidth / 2) + worldY / (tileHeight / 2)) / 2)
        const tileY = Math.floor((worldY / (tileHeight / 2) - worldX / (tileWidth / 2)) / 2)

        return { tileX, tileY }
    }



    /**
     * Преобразует мировую точку в экранную
     * @param {number} worldX
     * @param {number} worldY
     * @param {number} worldZ
     * @param {number} tileWidth
     * @param {number} tileHeight
     * @param {number} offset_x
     * @param {number} offset_y
     * @returns {{x:number, y:number}}
     */
    static worldToScreenPoint(worldX, worldY, worldZ, tileWidth, tileHeight, offset_x = 0, offset_y = 0) {
        const screenX = (worldX - worldY) * (tileWidth / 2) - offset_x
        const screenY = (worldX + worldY) * (tileHeight / 2) - worldZ * tileHeight - offset_y
        return { x: screenX, y: screenY }
    }

    /**
     * Преобразует экранную точку обратно в мировые координаты (Z опускаем).
     *
     * @param {number} screenX
     * @param {number} screenY
     * @param {number} tileWidth
     * @param {number} tileHeight
     * @param {number} offset_x
     * @param {number} offset_y
     * @returns {{worldX:number, worldY:number}}
     */
    static screenToWorldPoint(screenX, screenY, tileWidth, tileHeight, offset_x = 0, offset_y = 0) {
        const worldX = ( (screenX + offset_x) / (tileWidth / 2) + (screenY + offset_y) / (tileHeight / 2) ) / 2
        const worldY = ( (screenY + offset_y) / (tileHeight / 2) - (screenX + offset_x) / (tileWidth / 2) ) / 2
        return { worldX, worldY }
    }
}

export {Isometria}