class View {

    options
    canvas

    constructor(options) {
        this.options = options

        // создаём canvas фиксированного размера
        this.canvas = document.createElement("canvas")
        this.canvas.width = this.options.width
        this.canvas.height = this.options.height
        this.canvas.style.display = 'block';
        this.canvas.style.margin = '0 auto';
        // можно добавить стили, чтобы сразу видеть
        this.canvas.style.border = "1px solid #ccc"

        // вставляем в документ
        document.body.appendChild(this.canvas)
    }

    getContext2D() {
        if (!this.canvas) return null
        return this.canvas.getContext("2d")
    }

    getContext3D() {
        if (!this.canvas) return null
        return this.canvas.getContext("webgl2")
    }

}

export { View }
