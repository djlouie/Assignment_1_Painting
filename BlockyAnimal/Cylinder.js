class Cylinder{
    constructor(){
        this.type = 'cylinder';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.segments = 10;
    }

    render(){
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;
        
        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Calculate and draw the triangles that make up the circle
        let angleStep = 360/this.segments;
        var d = 1;
        for (var angle = 0; angle < 360; angle = angle + angleStep) {
            let centerPt = [0, 0];
            let angle1 = angle;
            let angle2 = angle + angleStep;
            let vec1 = [Math.cos(angle1*Math.PI/180)*d, Math.sin(angle1*Math.PI/180)*d];
            let vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
            let pt1 = [centerPt[0]+vec1[0], centerPt[1]+vec1[1]];
            let pt2 = [centerPt[0]+vec2[0], centerPt[1]+vec2[1]];

            // Pass the color of a point to u_FragColor variable
            gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

            // sides
            drawTriangle3D( [pt1[0], 0, pt1[1], pt2[0], 0, pt2[1], pt1[0], 1, pt1[1]]);
            drawTriangle3D( [pt2[0], 1, pt2[1], pt1[0], 1, pt1[1], pt2[0], 0, pt2[1]]);

            gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

            // top face
            drawTriangle3D( [0, 1, 0, pt1[0], 1, pt1[1], pt2[0], 1, pt2[1]]);

            // bottom face
            drawTriangle3D( [0, 0, 0, pt1[0], 0, pt1[1], pt2[0], 0, pt2[1]]);
            
        }


        // // Front of Cube
        // drawTriangle3D( [0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0] );
        // drawTriangle3D( [0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0] );

        // // Pass the color of a point to u_FragColor uniform variable
        // gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3])

        // // Top of Cube
        // drawTriangle3D( [0.0, 1.0, 0.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0] );
        // drawTriangle3D( [0.0, 1.0, 0.0,  1.0, 1.0, 1.0,  1.0, 1.0, 0.0] );

        // // Pass the color of a point to u_FragColor uniform variable
        // gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3])

        // // Right of Cube
        // drawTriangle3D( [1.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 1.0] );
        // drawTriangle3D( [1.0, 0.0, 0.0,  1.0, 1.0, 1.0,  1.0, 0.0, 1.0] );

    }
}