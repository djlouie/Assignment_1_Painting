// ColoredPoint.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform float u_Size;
    void main() {
        gl_Position = a_Position;
        // gl_PointSize = 10.0;
        gl_PointSize = u_Size;
    }`;

// Fragment shader program
var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
        gl_FragColor = u_FragColor;
    }`;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size

// Setup GL context
function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas);
    // Added flag to tell webgl which buffer to preserve
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
}

// Get attributes from the GPU
function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    // Get the storage location of u_Size
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// // Globals related to UI elements
// let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedXSize = 18;
let g_selectedYSize = 16;
// let g_selectedType = POINT;
// let g_selectedSegments = 10;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI(){

    // Draw Button
    document.getElementById('draw').onclick = function() {g_shapesList = []; defineDrawing(); renderAllShapes(); };

    // Size + Segments Slider Events
    document.getElementById('sizeXSlide').addEventListener('mouseup', function() { g_selectedXSize = this.value; g_shapesList = []; defineDrawing(); renderAllShapes(); })
    document.getElementById('sizeYSlide').addEventListener('mouseup', function() { g_selectedYSize = this.value; g_shapesList = []; defineDrawing(); renderAllShapes(); })
}

function main() {

    // Set up canvas and gl variables
    setupWebGL();
    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    // Set up actions for the HTML UI elements
    addActionsForHtmlUI();

    // // Register function (event handler) to be called on a mouse press
    // canvas.onmousedown = click;
    // canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev) } };

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

}

var g_shapesList = [];

function defineDrawing() {

    dx = 1/g_selectedXSize;  // delta
    dy = 1/g_selectedYSize;

    // back arm
    g_shapesList.push(new Triangle([-2*dx, -1.5*dy, 0*dx, -0.5*dy, 2*dx, -1.5*dy],[255.0, 115.0, 20.0, 1.0]));
    g_shapesList.push(new Triangle([-2*dx, -1.5*dy, -1*dx, -2.5*dy, -1*dx, -1.5*dy],[255.0, 115.0, 20.0, 1.0]));

    // head
    g_shapesList.push(new Triangle([2*dx, -2*dy, 2*dx, dy*1, dx*-1, dy*1],[255.0, 165.0, 0.0, 1.0]));
    g_shapesList.push(new Triangle([-1*dx, dy, -1*dx, 4*dy, 2*dx, dy],[255.0, 165.0, 0.0, 1.0]));
    g_shapesList.push(new Triangle([-2*dx, 2*dy, -1*dx, 4*dy, -3*dx, 4*dy],[255.0, 165.0, 0.0, 1.0]));
    g_shapesList.push(new Triangle([-1*dx, 1*dy, -1*dx, 4*dy, -2*dx, 2*dy],[255.0, 165.0, 0.0, 1.0]));
    g_shapesList.push(new Triangle([-5*dx, 2*dy, -3*dx, 4*dy, -2*dx, 2*dy],[255.0, 165.0, 0.0, 1.0]));
    g_shapesList.push(new Triangle([-6*dx, 2*dy, -2*dx, 2*dy, -2*dx, 0*dy],[255.0, 165.0, 0.0, 1.0]));
    g_shapesList.push(new Triangle([-6*dx, 2*dy, -6*dx, 0*dy, -2*dx, 0*dy],[255.0, 165.0, 0.0, 1.0]));
    g_shapesList.push(new Triangle([-2*dx, 0*dy, -2*dx, 2*dy, -1*dx, 1*dy],[255.0, 165.0, 0.0, 1.0]));

    // horn
    g_shapesList.push(new Triangle([-6*dx, 2*dy, -5*dx, 2*dy, -6*dx, 3*dy],[165.0, 42.0, 42.0, 1.0]));

    // eye
    g_shapesList.push(new Triangle([-4*dx, 2*dy, -3*dx, 2*dy, -3*dx, 3*dy],[255.0, 255.0, 0.0, 1.0]));
    
    // body
    g_shapesList.push(new Triangle([2*dx, 1*dy, 2*dx, -2*dy, 3*dx, 0*dy],[255.0, 165.0, 0.0, 1.0]));
    g_shapesList.push(new Triangle([0*dx, 0*dy, 2*dx, -2*dy, 0*dx, -2*dy],[255.0, 165.0, 0.0, 1.0]));
    g_shapesList.push(new Triangle([3*dx, 0*dy, 3*dx, -3*dy, 2*dx, -2*dy],[255.0, 165.0, 0.0, 1.0]));
    g_shapesList.push(new Triangle([0*dx, -2*dy, 2*dx, -2*dy, 2*dx, -4*dy],[255.0, 165.0, 0.0, 1.0]));
    g_shapesList.push(new Triangle([2*dx, -2*dy, 3*dx, -3*dy, 2*dx, -4*dy],[255.0, 165.0, 0.0, 1.0]));
    g_shapesList.push(new Triangle([3*dx, -1*dy, 4*dx, -2*dy, 3*dx, -3*dy],[255.0, 165.0, 0.0, 1.0]));

    // front leg + tail
    g_shapesList.push(new Triangle([2*dx, -4*dy, 4*dx, -2*dy, 4*dx, -4*dy],[255.0, 140.0, 10.0, 1.0]));
    g_shapesList.push(new Triangle([2*dx, -4*dy, 5*dx, -4*dy, 2*dx, -6*dy],[255.0, 140.0, 10.0, 1.0]));
    g_shapesList.push(new Triangle([4*dx, -4*dy, 4*dx, -3*dy, 5*dx, -4*dy],[255.0, 140.0, 10.0, 1.0]));
    g_shapesList.push(new Triangle([1*dx, -6*dy, 2*dx, -5*dy, 2*dx, -6*dy],[255.0, 140.0, 10.0, 1.0]));
    g_shapesList.push(new Triangle([2*dx, -6*dy, 5*dx, -4*dy, 8*dx, -6*dy],[255.0, 140.0, 10.0, 1.0]));

    // back leg
    g_shapesList.push(new Triangle([0*dx, -4*dy, 1*dx, -3*dy, 2*dx, -4*dy],[255.0, 115.0, 20.0, 1.0]));
    g_shapesList.push(new Triangle([0*dx, -4*dy, 2*dx, -4*dy, 2*dx, -5*dy],[255.0, 115.0, 20.0, 1.0]));
    g_shapesList.push(new Triangle([0*dx, -4*dy, 2*dx, -5*dy, 0*dx, -5*dy],[255.0, 115.0, 20.0, 1.0]));
    g_shapesList.push(new Triangle([-1*dx, -6*dy, 0*dx, -5*dy, 1*dx, -6*dy],[255.0, 115.0, 20.0, 1.0]));
    g_shapesList.push(new Triangle([0*dx, -5*dy, 2*dx, -5*dy, 1*dx, -6*dy],[255.0, 115.0, 20.0, 1.0]));

    // front arm
    g_shapesList.push(new Triangle([-2*dx, -2*dy, 0*dx, -1*dy, 2*dx, -2*dy],[255.0, 140.0, 10.0, 1.0]));
    g_shapesList.push(new Triangle([-2*dx, -2*dy, -1*dx, -3*dy, -1*dx, -2*dy],[255.0, 140.0, 10.0, 1.0]));
}

// Extract the event click and change it to webGL coordinates
function convertCoordinateEventsToGL(ev){
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    return ([x, y]);
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes(){
    // Check the time at the start of this function

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw each shape in the list
    var len = g_shapesList.length;
    for(var i = 0; i < len; i++) {
        g_shapesList[i].render();
    }
}

// Set the text of an HTML element
function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if (!htmlElm) {
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}

// var g_points = [];    // The array for the position of a mouse press
// var g_colors = [];    // The array to store the color of a point
// var g_sizes = [];   // The array to store the size of the point

// function click(ev) {

//     let [x, y] = convertCoordinateEventsToGL(ev);

//     // Create and store the new point
//     let point;
//     if (g_selectedType == POINT){
//         point = new Point();
//     } else if (g_selectedType == TRIANGLE) {
//         point = new Triangle();
//     } else {
//         point = new Circle()
//     }
//     point.position = [x, y];
//     point.color = g_selectedColor.slice();
//     point.size = g_selectedSize;

//     if (g_selectedType == CIRCLE){
//         point.segments = g_selectedSegments;
//     }

//     g_shapesList.push(point);

//     // // Store the coordinates to g_points array
//     // g_points.push([x, y]);
    
//     // // Store the selected color to the g_colors array
//     // g_colors.push(g_selectedColor.slice());

//     // // Store the size of the point
//     // g_sizes.push(g_selectedSize);
    
//     // // Store the coordinates to g_points array
//     // if (x >= 0.0 && y >= 0.0) {            // First quadrant
//     //     g_colors.push([1.0, 0.0, 0.0, 1.0]);    // Red
//     // } else if (x < 0.0 && y < 0.0) { // Third quadrant
//     //     g_colors.push([0.0, 1.0, 0.0, 1.0]);    // Green
//     // } else {                                                 // Others
//     //     g_colors.push([1.0, 1.0, 1.0, 1.0]);    // White
//     // }

//     renderAllShapes();
// }
