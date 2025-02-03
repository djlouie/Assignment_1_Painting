// ColoredPoint.js (c) 2012 matsuda

// Vertex shader program
var VSHADER_SOURCE = `
    attribute vec4 a_Position;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    void main() {
        gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
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
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

// Setup GL context
function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    // gl = getWebGLContext(canvas);
    // Added flag to tell webgl which buffer to preserve
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true, premultipliedAlpha: false });
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    // Enable Depth Buffer to Keep Track of What is In Front of Sopmething else
    gl.enable(gl.DEPTH_TEST);
    
    // Enable Blending So That The Alpha Works Correctly (Learned this from ChatGPT)
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

}

// Get attributes from the GPU
function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
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

    // // Get the storage location of u_Size
    // u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    // if (!u_Size) {
    //     console.log('Failed to get the storage location of u_Size');
    //     return;
    // }

    // Get the storage location of u_ModelMatrix
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }
    // Get the storage location of u_GlobalRotateMatrix
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
    if (!u_GlobalRotateMatrix) {
        console.log('Failed to get the storage location of u_GlobalRotateMatrix');
        return;
    }

    // Set an initial value for this matrix to identity
    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

// Constants
const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;
const TREX = 3;

// Globals related to UI elements (Make sure they are the same as the slider initials)
let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10;
let g_globalAngleX = 5;
let g_globalAngleY = 5;
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation = false;
let g_magentaAnimation = false;

// Set up actions for the HTML UI elements
function addActionsForHtmlUI(){
    
    // // Mouse Rotate
    // document.getElementById('webgl').onclick = function(event) {

    //     convertCoordinateEventsToGL(event)
    // }

    // Button Events
    document.getElementById('animationYellowOffButton').onclick = function() {g_yellowAnimation=false;};
    document.getElementById('animationYellowOnButton').onclick = function() {g_yellowAnimation=true;};
    document.getElementById('animationMagentaOffButton').onclick = function() {g_magentaAnimation=false;};
    document.getElementById('animationMagentaOnButton').onclick = function() {g_magentaAnimation=true;};

    // Magenta Slider Events
    document.getElementById('magentaSlide').addEventListener('mousemove', function() { g_magentaAngle = this.value; renderAllShapes();})

    // Yellow Slider Events
    document.getElementById('yellowSlide').addEventListener('mousemove', function() { g_yellowAngle = this.value; renderAllShapes();})

    // Angle Slider Events
    // document.getElementById('angleSlide').addEventListener('mouseup', function() { g_globalAngle = this.value; } );
    document.getElementById('angleSlideX').addEventListener('mousemove', function() { g_globalAngleX = this.value; renderAllShapes(); mouseReset(); } );
    document.getElementById('angleSlideY').addEventListener('mousemove', function() { g_globalAngleY = this.value; renderAllShapes(); mouseReset(); } );

    // // Size + Segments Slider Events
    // document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; })
    // document.getElementById('alphaSlide').addEventListener('mouseup', function() { g_selectedColor[3] = this.value; })
    // document.getElementById('segmentsSlide').addEventListener('mouseup', function() { g_selectedSegments = this.value; })
}

function main() {

    // Set up canvas and gl variables
    setupWebGL();
    // Set up GLSL shader programs and connect GLSL variables
    connectVariablesToGLSL();

    // Set up actions for the HTML UI elements
    addActionsForHtmlUI();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = click;
    canvas.onmousemove = function(ev) { if (ev.buttons == 1) { click(ev) } };
    canvas.onmouseup = mouseReset;

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    // gl.clear(gl.COLOR_BUFFER_BIT);
    // renderAllShapes();
    requestAnimationFrame(tick);
}

var g_startTime = performance.now() / 1000.0;
var g_seconds = performance.now() / 1000.0 - g_startTime;

// Called by the browser repeatedly whenever its time
function tick() {

    // Print some debug information so we know we are running
    g_seconds = performance.now() / 1000.0 - g_startTime;
    // console.log(performance.now());

    // Update Animation Angles
    updateAnimationAngles();

    // Draw Everything
    renderAllShapes();

    // Tell the browser to update again when it has the time
    requestAnimationFrame(tick);
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

// Update the angles of everything if currently animated
function updateAnimationAngles() {
    if (g_yellowAnimation) {
        g_yellowAngle = (45*Math.sin(g_seconds));
    }

    if (g_magentaAnimation) {
        g_magentaAngle = (45*Math.sin(3 *g_seconds));
    }
}

// Draw every shape that is supposed to be in the canvas
function renderAllShapes(){
    // Check the time at the start of this function
    var startTime = performance.now()

    // Pass the matrix to u_ModelMatrix attribute
    var globalRotMat = new Matrix4().rotate(g_globalAngleY, 1, 0, 0);
    globalRotMat = globalRotMat.rotate(g_globalAngleX, 0, 1, 0);

    // console.log(globalRotMat.elements)
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
    
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // // Draw Cylinder 
    // var test = new Cylinder();
    // test.segments = 20;
    // test.color = [0.5, 1.0, 1.0, 1.0];
    // test.matrix.scale(0.5, 0.5, 0.5);
    // test.render();

    // Draw the body Cube
    var body = new Cube();
    body.color = [1.0, 0.0, 0.0, 1.0];
    body.matrix.translate(-.25, -.75, 0.0);
    body.matrix.rotate(-5, 1, 0, 0)
    body.matrix.scale(0.5, .3, .5);
    body.render();

    // Draw Yellow
    var yellow = new Cube();
    yellow.color = [1, 1, 0, 1];
    yellow.matrix.setTranslate(0, -.5, 0.0);
    yellow.matrix.rotate(-5, 1, 0, 0);

    yellow.matrix.rotate(-g_yellowAngle, 0, 0, 1);

    // if (g_yellowAnimation){
    //     yellow.matrix.rotate(45 * Math.sin(g_seconds), 0, 0, 1);
    // } else {
    //     yellow.matrix.rotate(-g_yellowAngle, 0, 0, 1);
    // }
    
    var yellowCoordinatesMat = new Matrix4(yellow.matrix);
    yellow.matrix.scale(0.25, .7, .5);
    yellow.matrix.translate(-.5, 0, 0);
    yellow.render();

    // Test Magenta
    var magenta = new Cube();
    magenta.color = [1, 0, 1, 1];
    magenta.matrix = yellowCoordinatesMat;
    magenta.matrix.translate(0, 0.65, 0);
    magenta.matrix.rotate(g_magentaAngle, 0, 0, 1);
    magenta.matrix.rotate(0, 1, 0, 0);
    magenta.matrix.scale(.3, .3, .3);
    // preventing z fighting due to floating point precision errors with a very small displacement
    magenta.matrix.translate(-.5, 0, -0.001);
    magenta.render();


    // Check the time at the end of the function, and show on webpage
    var duration = performance.now() - startTime;
    sendTextToHTML(" ms: " + Math.floor(duration) + " fps " + Math.floor(10000/duration)/10, "numdot")
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

// var g_shapesList = [];

// // var g_points = [];    // The array for the position of a mouse press
// // var g_colors = [];    // The array to store the color of a point
// // var g_sizes = [];   // The array to store the size of the point

g_initialAngleX = null;
g_initialAngleY = null;
g_initialMouseX = null;
g_initialMouseY = null;
function rotate(x, y){

    if (g_initialAngleX === null){
        g_initialAngleX = parseFloat(g_globalAngleX);
    }
    if (g_initialAngleY === null){
        g_initialAngleY = parseFloat(g_globalAngleY);
    }
    if (g_initialMouseX === null){
        g_initialMouseX = x;
    }
    if (g_initialMouseY === null){
        g_initialMouseY = y;
    }

    // Rotate
    console.log("ROTATE")
    console.log(g_initialAngleX)
    console.log(g_initialAngleY)
    console.log(g_initialMouseX)
    console.log(g_initialMouseY)
    console.log(g_globalAngleX)
    console.log(g_globalAngleY)

    g_globalAngleX = (g_initialAngleX + (x - g_initialMouseX)*360) % 360;
    g_globalAngleY = (g_initialAngleY + (y - g_initialMouseY)*360) % 360;
}

function mouseReset() {
    g_initialAngleX = null;
    g_initialAngleY = null;
    g_initialMouseX = null;
    g_initialMouseY = null;
}

function click(ev) {

    console.log("On CLICK")
    console.log(g_initialAngleX)
    console.log(g_initialAngleY)
    console.log(g_initialMouseX)
    console.log(g_initialMouseY)
    console.log(g_globalAngleX)
    console.log(g_globalAngleY)

    let [x, y] = convertCoordinateEventsToGL(ev);

    rotate(x, y);

    // // Create and store the new point
    // let point;
    // if (g_selectedType == POINT){
    //     point = new Point();
    // } else if (g_selectedType == TRIANGLE) {
    //     point = new Triangle();
    // } else if (g_selectedType == CIRCLE){
    //     point = new Circle();
    // } else {
    //     point = new TRex();
    // }
    // point.position = [x, y];
    // point.color = g_selectedColor.slice();
    // point.size = g_selectedSize;

    // if (g_selectedType == CIRCLE){
    //     point.segments = g_selectedSegments;
    // }

    // g_shapesList.push(point);

    // // // Store the coordinates to g_points array
    // // g_points.push([x, y]);
    
    // // // Store the selected color to the g_colors array
    // // g_colors.push(g_selectedColor.slice());

    // // // Store the size of the point
    // // g_sizes.push(g_selectedSize);
    
    // // // Store the coordinates to g_points array
    // // if (x >= 0.0 && y >= 0.0) {            // First quadrant
    // //     g_colors.push([1.0, 0.0, 0.0, 1.0]);    // Red
    // // } else if (x < 0.0 && y < 0.0) { // Third quadrant
    // //     g_colors.push([0.0, 1.0, 0.0, 1.0]);    // Green
    // // } else {                                                 // Others
    // //     g_colors.push([1.0, 1.0, 1.0, 1.0]);    // White
    // // }

    // renderAllShapes();
}
