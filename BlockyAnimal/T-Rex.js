class TRex{
    constructor(){
        this.type = 't-rex';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.segments = 10;
    }

    render(){
        var size = this.size;
        size = size / 25;
        let dx = size * 1/18;  // delta
        let dy = size * 1/16;

        // back arm
        this.setColorDrawTriangle([-2*dx, -1.5*dy, 0*dx, -0.5*dy, 2*dx, -1.5*dy],[255.0, 115.0, 20.0, 1.0]);
        this.setColorDrawTriangle([-2*dx, -1.5*dy, -1*dx, -2.5*dy, -1*dx, -1.5*dy],[255.0, 115.0, 20.0, 1.0]);

        // head
        this.setColorDrawTriangle([2*dx, -2*dy, 2*dx, dy*1, dx*-1, dy*1],[255.0, 165.0, 0.0, 1.0]);
        this.setColorDrawTriangle([-1*dx, dy, -1*dx, 4*dy, 2*dx, dy],[255.0, 165.0, 0.0, 1.0]);
        this.setColorDrawTriangle([-2*dx, 2*dy, -1*dx, 4*dy, -3*dx, 4*dy],[255.0, 165.0, 0.0, 1.0]);
        this.setColorDrawTriangle([-1*dx, 1*dy, -1*dx, 4*dy, -2*dx, 2*dy],[255.0, 165.0, 0.0, 1.0]);
        this.setColorDrawTriangle([-5*dx, 2*dy, -3*dx, 4*dy, -2*dx, 2*dy],[255.0, 165.0, 0.0, 1.0]);
        this.setColorDrawTriangle([-6*dx, 2*dy, -2*dx, 2*dy, -2*dx, 0*dy],[255.0, 165.0, 0.0, 1.0]);
        this.setColorDrawTriangle([-6*dx, 2*dy, -6*dx, 0*dy, -2*dx, 0*dy],[255.0, 165.0, 0.0, 1.0]);
        this.setColorDrawTriangle([-2*dx, 0*dy, -2*dx, 2*dy, -1*dx, 1*dy],[255.0, 165.0, 0.0, 1.0]);

        // horn
        this.setColorDrawTriangle([-6*dx, 2*dy, -5*dx, 2*dy, -6*dx, 3*dy],[165.0, 42.0, 42.0, 1.0]);

        // eye
        this.setColorDrawTriangle([-4*dx, 2*dy, -3*dx, 2*dy, -3*dx, 3*dy],[255.0, 255.0, 0.0, 1.0]);
        
        // body
        this.setColorDrawTriangle([2*dx, 1*dy, 2*dx, -2*dy, 3*dx, 0*dy],[255.0, 165.0, 0.0, 1.0]);
        this.setColorDrawTriangle([0*dx, 0*dy, 2*dx, -2*dy, 0*dx, -2*dy],[255.0, 165.0, 0.0, 1.0]);
        this.setColorDrawTriangle([3*dx, 0*dy, 3*dx, -3*dy, 2*dx, -2*dy],[255.0, 165.0, 0.0, 1.0]);
        this.setColorDrawTriangle([0*dx, -2*dy, 2*dx, -2*dy, 2*dx, -4*dy],[255.0, 165.0, 0.0, 1.0]);
        this.setColorDrawTriangle([2*dx, -2*dy, 3*dx, -3*dy, 2*dx, -4*dy],[255.0, 165.0, 0.0, 1.0]);
        this.setColorDrawTriangle([3*dx, -1*dy, 4*dx, -2*dy, 3*dx, -3*dy],[255.0, 165.0, 0.0, 1.0]);

        // front leg + tail
        this.setColorDrawTriangle([2*dx, -4*dy, 4*dx, -2*dy, 4*dx, -4*dy],[255.0, 140.0, 10.0, 1.0]);
        this.setColorDrawTriangle([2*dx, -4*dy, 5*dx, -4*dy, 2*dx, -6*dy],[255.0, 140.0, 10.0, 1.0]);
        this.setColorDrawTriangle([4*dx, -4*dy, 4*dx, -3*dy, 5*dx, -4*dy],[255.0, 140.0, 10.0, 1.0]);
        this.setColorDrawTriangle([1*dx, -6*dy, 2*dx, -5*dy, 2*dx, -6*dy],[255.0, 140.0, 10.0, 1.0]);
        this.setColorDrawTriangle([2*dx, -6*dy, 5*dx, -4*dy, 8*dx, -6*dy],[255.0, 140.0, 10.0, 1.0]);

        // back leg
        this.setColorDrawTriangle([0*dx, -4*dy, 1*dx, -3*dy, 2*dx, -4*dy],[255.0, 115.0, 20.0, 1.0]);
        this.setColorDrawTriangle([0*dx, -4*dy, 2*dx, -4*dy, 2*dx, -5*dy],[255.0, 115.0, 20.0, 1.0]);
        this.setColorDrawTriangle([0*dx, -4*dy, 2*dx, -5*dy, 0*dx, -5*dy],[255.0, 115.0, 20.0, 1.0]);
        this.setColorDrawTriangle([-1*dx, -6*dy, 0*dx, -5*dy, 1*dx, -6*dy],[255.0, 115.0, 20.0, 1.0]);
        this.setColorDrawTriangle([0*dx, -5*dy, 2*dx, -5*dy, 1*dx, -6*dy],[255.0, 115.0, 20.0, 1.0]);

        // front arm
        this.setColorDrawTriangle([-2*dx, -2*dy, 0*dx, -1*dy, 2*dx, -2*dy],[255.0, 140.0, 10.0, 1.0]);
        this.setColorDrawTriangle([-2*dx, -2*dy, -1*dx, -3*dy, -1*dx, -2*dy],[255.0, 140.0, 10.0, 1.0]);
    }

    setColorDrawTriangle(vertices, originalColor) {
        var rgba = this.color;
        var xy = vertices
        var p = this.position;

        let r, g, b;
        if (originalColor[0] - ((1 - rgba[0]) * 255) < 0) {
            r = 0
        } else {
            r = (originalColor[0] - ((1 - rgba[0]) * 255)) / 255;
        }

        if (originalColor[1] - ((1 - rgba[1]) * 255) < 0) {
            g = 0
        } else {
            g = (originalColor[1] - ((1 - rgba[1]) * 255)) / 255;
        }

        if (originalColor[2] - ((1 - rgba[2]) * 255) < 0) {
            b = 0
        } else {
            b = (originalColor[2] - ((1 - rgba[2]) * 255)) / 255;
        }

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, r, g, b, rgba[3]);
        // gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0);
        
        // Draw
        drawTriangle( [p[0] + xy[0], p[1] + xy[1], p[0] + xy[2], p[1] + xy[3], p[0] + xy[4], p[1] + xy[5]] );
    }
}