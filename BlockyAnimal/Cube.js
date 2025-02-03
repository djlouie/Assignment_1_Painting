class Cube{
    constructor(){
        this.type = 'cube';
        // this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        // this.size = 5.0;
        // this.segments = 10;
        this.matrix = new Matrix4();

        // buffer
        this.buffer1 = null;
        this.buffer2 = null;
        this.buffer3 = null;
        this.buffer4 = null;
        this.buffer5 = null;
        this.buffer6 = null;

        // vertices
        this.vertices1 = new Float32Array([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  1.0, 1.0, 0.0,  0.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 0.0, 0.0]);
        this.vertices2 = new Float32Array([0.0, 1.0, 0.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0,  0.0, 1.0, 0.0,  1.0, 1.0, 1.0,  1.0, 1.0, 0.0]);
        this.vertices3 = new Float32Array([1.0, 0.0, 0.0,  1.0, 1.0, 0.0,  1.0, 1.0, 1.0,  1.0, 0.0, 0.0,  1.0, 1.0, 1.0,  1.0, 0.0, 1.0]);
        this.vertices4 = new Float32Array([0.0, 0.0, 0.0,  0.0, 1.0, 0.0,  0.0, 1.0, 1.0,  0.0, 0.0, 0.0,  0.0, 1.0, 1.0,  0.0, 0.0, 1.0]);
        this.vertices5 = new Float32Array([0.0, 0.0, 0.0,  0.0, 0.0, 1.0,  1.0, 0.0, 1.0,  0.0, 0.0, 0.0,  1.0, 0.0, 1.0,  1.0, 0.0, 0.0]);
        this.vertices6 = new Float32Array([0.0, 0.0, 1.0,  0.0, 1.0, 1.0,  1.0, 1.0, 1.0,  0.0, 0.0, 1.0,  1.0, 1.0, 1.0,  1.0, 0.0, 1.0]);
    }

    render(){
        // var xy = this.position;
        var rgba = this.color;
        // var size = this.size;

        // Pass the color of a point to u_FragColor variable
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        
        // Pass the matrix to u_ModelMatrix attribute
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


        /*
        Front Of Cube
        */

        // Create a buffer object (only if it isn't made already)
        if (this.buffer1 === null) {
            this.buffer1 = gl.createBuffer();
            if (!this.buffer1) {
            console.log("Failed to create the buffer object");
            return -1;
            }
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer1);
    
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices1, gl.DYNAMIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
    
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices1.length / 3);

        /*
        Top Of Cube
        */

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3])

        // Create a buffer object (only if it isn't made already)
        if (this.buffer2 === null) {
            this.buffer2 = gl.createBuffer();
            if (!this.buffer2) {
            console.log("Failed to create the buffer object");
            return -1;
            }
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer2);
    
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices2, gl.DYNAMIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
    
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices2.length / 3);

        /*
        Right Of Cube
        */

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3])

        // Create a buffer object (only if it isn't made already)
        if (this.buffer3 === null) {
            this.buffer3 = gl.createBuffer();
            if (!this.buffer3) {
            console.log("Failed to create the buffer object");
            return -1;
            }
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer3);
    
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices3, gl.DYNAMIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
    
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices3.length / 3);


        /*
        Left Of Cube
        */

        // Create a buffer object (only if it isn't made already)
        if (this.buffer4 === null) {
            this.buffer4 = gl.createBuffer();
            if (!this.buffer4) {
            console.log("Failed to create the buffer object");
            return -1;
            }
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer4);
    
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices4, gl.DYNAMIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
    
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices4.length / 3);

        /*
        Bottom Of Cube
        */

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3])

        // Create a buffer object (only if it isn't made already)
        if (this.buffer5 === null) {
            this.buffer5 = gl.createBuffer();
            if (!this.buffer5) {
            console.log("Failed to create the buffer object");
            return -1;
            }
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer5);
    
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices5, gl.DYNAMIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
    
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices5.length / 3);

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);

        /*
        Back Of Cube
        */

        // Create a buffer object (only if it isn't made already)
        if (this.buffer6 === null) {
            this.buffer6 = gl.createBuffer();
            if (!this.buffer6) {
            console.log("Failed to create the buffer object");
            return -1;
            }
        }

        // Bind the buffer object to target
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer6);
    
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices6, gl.DYNAMIC_DRAW);

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
    
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices6.length / 3);

        // Pass the color of a point to u_FragColor uniform variable
        gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);

    }
}