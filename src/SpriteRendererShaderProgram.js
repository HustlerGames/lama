class SpriteRendererShaderProgram {
    constructor(context) {
        this.context = context;   // храним WebGLRenderingContext
        this.program = null;
        this.attribLocations = {};
        this.uniformLocations = {};
    }

    getVertexShaderSource() {
        return `
            attribute vec2 aPos;
            attribute vec2 aTexCoord;
            uniform vec2 uResolution;
            varying vec2 vTexCoord;
            void main(void) {
                // Преобразуем пиксельные координаты в NDC
                vec2 clipSpace = ((aPos / uResolution) * 2.0) - 1.0;
                gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
                vTexCoord = aTexCoord;
            }
        `;
    }

    getFragmentShaderSource() {
        return `
            precision mediump float;
            varying vec2 vTexCoord;
            uniform sampler2D uSampler;
            void main(void) {
                gl_FragColor = texture2D(uSampler, vTexCoord);
            }
        `;
    }

    compile() {
        const gl = this.context;

        // создаём шейдеры
        const vertexShader   = this._createShader(gl.VERTEX_SHADER, this.getVertexShaderSource());
        const fragmentShader = this._createShader(gl.FRAGMENT_SHADER, this.getFragmentShaderSource());

        // создаём программу
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Ошибка линковки:", gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }

        this.program = program;
        return program;
    }

    use() {
        this.context.useProgram(this.program);
    }

    getAttribLocation(name) {
        if (!(name in this.attribLocations)) {
            this.attribLocations[name] = this.context.getAttribLocation(this.program, name);
        }
        return this.attribLocations[name];
    }

    getUniformLocation(name) {
        if (!(name in this.uniformLocations)) {
            this.uniformLocations[name] = this.context.getUniformLocation(this.program, name);
        }
        return this.uniformLocations[name];
    }
    
    setResolution(width, height) {
        const gl = this.context;
        const resolutionLocation = this.getUniformLocation('uResolution');
        gl.uniform2f(resolutionLocation, width, height);
    }

    _createShader(type, source) {
        const gl = this.context;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Ошибка компиляции шейдера:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
}


export {SpriteRendererShaderProgram}