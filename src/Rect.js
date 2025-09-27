class Rect {

    constructor(x = 0, y = 0, width = 0, height = 0, offset_x = 0, offset_y = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.offset_x = offset_x;
        this.offset_y = offset_y;
    }
}

export { Rect }