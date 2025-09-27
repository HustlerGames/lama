class Camera
{
    /**
     * 2D Camera class.
     * The camera is the size of the canvas and can move freely in the world, including outside its bounds.
     */
    constructor(x = 0, y = 0, width = 800, height = 600) {
        /**
         * @type {number} X position of the camera in world coordinates (top-left corner)
         */
        this.x = x;
        /**
         * @type {number} Y position of the camera in world coordinates (top-left corner)
         */
        this.y = y;
        /**
         * @type {number} Width of the camera (usually equals canvas width)
         */
        this.width = width;
        /**
         * @type {number} Height of the camera (usually equals canvas height)
         */
        this.height = height;
    }

    /**
     * Move the camera to a specific position in world coordinates.
     * @param {number} x
     * @param {number} y
     */
    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Move the camera by a delta.
     * @param {number} dx
     * @param {number} dy
     */
    moveBy(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    /**
     * Set the camera size (for example, when the canvas is resized).
     * @param {number} width
     * @param {number} height
     */
    setSize(width, height) {
        this.width = width;
        this.height = height;
    }

    /**
     * Get the rectangle representing the camera's viewport in world coordinates.
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    getRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Checks if a world rectangle is at least partially visible in the camera's viewport.
     * @param {number} x
     * @param {number} y
     * @param {number} width
     * @param {number} height
     * @returns {boolean}
     */
    isVisible(x, y, width, height) {
        const spriteRight = x + width;
        const spriteBottom = y + height;
        const viewRight = this.x + this.width;
        const viewBottom = this.y + this.height;

        return (
            spriteRight > this.x && // спрайт заходит правой стороной влево
            x < viewRight &&        // спрайт заходит левой стороной вправо
            spriteBottom > this.y &&// низ заходит вверх
            y < viewBottom          // верх заходит вниз
        );
    }

}

export {Camera}