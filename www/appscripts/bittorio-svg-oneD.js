//Learning is almost learning to have a frame.

//remember timed perturbation

// Lite version of ion channels with 3 charges, membrane column, and ion
// exchange.

import {js_clock} from "./clocks.js"
import {create_rect_fn, create_quad_fn, create_parallelogram_fn, area} from "./geoShapes.js"
import {golife} from "./gameOfLife.js"


var n = 30;
var side = n+5;

var gridn = 50;

var canvas = document.getElementById( 'svgCanvas' );
var pW = canvas.clientWidth;
var pH = canvas.clientWidth

    //canvas.clientHeight;

var svgXY = document.getElementById( 'svgCanvas' ).getBoundingClientRect()
var svgX = svgXY.left
var svgY = svgXY.top

// max 5 steps for now.
var backward_computation = []; //stores the state of CA, and state of perturbing environment.

var pWidth = pW- pW%gridn
var pHeight = pH - pH%gridn

// pWidth = pWidth>pHeight?pHeight:pWidth; //smaller of the two
//pWidth = pHeight
pHeight = pWidth

var workspace = [];
var area_string = []
var ar_diagram = null;

var t = 0; //as time

console.log(pWidth + "  " + pHeight);

// 40 * 40 grid
var scale_w = Math.floor(pWidth/gridn);
var scale_h = Math.floor(pHeight/gridn);

var side_w = 10; //scale_w;
var side_h = 10; //scale_h;

var moveState = 0;
var perturbOn = 0;

var currentFig = null;

//var createRectShape = create_rectangle(scale_w, scale_h, canvas);
var create_rect = create_rect_fn(scale_w, scale_h, canvas);
var create_parallelogram = create_parallelogram_fn(scale_w, scale_h, canvas);
//var create_path = create_path_fn(scale_w, scale_h, canvas);
var create_quad = create_quad_fn(scale_w, scale_h, canvas);

var imageCoords = [];

var gol = golife( gridn )(scale_w, scale_h, side_w, side_h);

var ca= [];

// // inititalize envrionment cells
// for (var i = 0; i < gridn; i++) {
//     ca[i] = cellularAutomaton( i, side_w, side_h );
// }

// var ca2Perturb = [];
// var perturbRow = null;

// // inititalize envrionment cells
// for (var i = 0; i < n; i++) {

//     ca2Perturb[i] = [];
//     for(var j = 0; j< n; j++){
//         ca2Perturb[i][j] = 0

//     }
// }

var rafId = null;

// create_rect(0,0, pWidth, pHeight, "red");

// var cells = [];

// // inititalize envrionment cells
// for (var i = 0; i < n; i++) {

//     cells[i] = [];
//     for(var j = 0; j< n; j++){

//         cells[i][j] = {}

//         cells[i][j].rect = create_rect(i,j,side, side, "#ffffff");
//         cells[i][j].state = 0;

//         if (  j == n/2){
//             cells[i][j].rect.setAttributeNS(null, "opacity", 0);
//         }
//     }
// }

// for(var col = 0; col< n; col++){

//     cells[col][0].state = 0;
//     setColor(cells[col][0]);
//     starting_config[col] = cells[col][0].state;
// }


// //var ca1 = cellularAutomaton( 1, side );

// var ca2 = cellularAutomaton( n/2, side );
// var starting_config = ca2.getState();

// // ca2.reconfigure(starting_config);
// ca2Perturb = starting_config;

// // for(var col = 0; col< n; col++){
// //     cells[col][0].state = starting_config[col];
// //     setColor(cells[col][0]);
// // }


// // row = gridn + 1;
// // // inititalize envrionment cells
// // for (var i = 0; i < n; i++) {

// //     cells[i] = []
// //     for(var j = gridn+1; j< n; j++){

// //         cells[i][j] = {}

// //         if( boundary[i].state == 1){
// //             cells[i][j].rect = create_rect(i,j,side, side, "#ffffff");
// //             cells[i][j].state = 1;
// //         }
// //         else{
// //             cells[i][j].rect = create_rect(i,j,side, side, "#000000");
// //             cells[i][j].state = 0;
// //         }
// //     }
// // }


// //display after every action
var display = js_clock(50, 1000);
var sense = js_clock(50, 500);
var t = 0;

// //console.log(cells)


// //runs simulation of cellular autonmaton
// var drawLoop = function(){

//     var now = Date.now();

//     sense(now, function(){

//         if( workspace.length > 0){
//             gol.sense(workspace);
//         }

//         // if( perturbOn == 1){
//         //     for (var i = 0; i < gridn; i++) {
//         //         ca[i].sense( currentFig.coords);
//         //     }
//         //     perturbOn = 0;
//         // }

//         // //only for second CA
//         // if( t >= n/2){

//         //     //to know places of perturbation
//         //     //activate the second CA
//         //     let currentFig = []
//         //     for( var col = 0; col < n; col++ ){
//         //         currentFig[col] = cells[col][n/2+1].state; //immediate next state
//         //     }
//         //     ca2.sense(pertOn, currentFig);
//         //     //ca2.sense( pertOn, ca2Perturb);
//         // }
//     })();

//     //displays every 250 ms
//     display(now, function(){

//         // console.log("POll")
//         // // 5. copy current state into last state
//         // console.log("Rule is " + document.getElementById("carulebinary").value);
//         // var ruleString = document.getElementById("carulebinary").value
//         // for (var i = 0; i < gridn; i++) {
//         //     ca[i].change_state( ruleString );
//         // }
//         gol.nextState();

//     })();


// //         //Hold off from saving state yet
// //         // if( backward_computation.length >= 10){
// //         //     backward_computation.shift();
// //         // }
// //         // else{
// //         //     var env = [];
// //         //     row = gridn-1;
// //         //     for(col = 0; col < n; col++){
// //         //         env[col] = cells[col][row].state;
// //         //     }

// //         //     var last_ca = [];
// //         //     row = n-1;
// //         //     for(col = 0; col < n; col++){
// //         //         last_ca[col] = cells[col][row].state;
// //         //     }

// //         //     backward_computation.push({ "ca":  boundary.map(function(f){return f.state}),
// //         //                                 "env": env,
// //         //                                 "last_ca": last_ca
// //         //                               });
// //         // }


// //         // 4. fall off the edge before ca2
// //         // inititalize envrionment cells
// //         for (var i = 0; i < n; i++) {
// //             for(var j = 0; j < n/2; j++){
// //                 cells[i][j].state = cells[i][j+1].state;
// //                 setColor(cells[i][j]);
// //             }
// //         }

// //         // 5. copy current state into last state
// //         var ca2state = ca2.getState();
// //         for (var i = 0; i < n; i++) {
// //             cells[i][n/2-1].state = ca2state[i];
// //             setColor(cells[i][n/2-1]); //start
// //         }


// //         // 2. reconfigure 2nd CA for perturbation and activate next states
// //         if( pertOn == 1){

// //             let currentFig = []
// //             for( var col = 0; col < n; col++ ){
// //                 currentFig[col] = cells[col][n/2+1].state; //immediate next state
// //             }
// //             //ca2.sense(pertOn, currentFig);
// //             ca2.reconfigure(currentFig);
// //         }
// //         else{

// //             //do not reconfigure with perturbation
// //             // i.e, let self-dynamics run
// //             // compenste for perturbation
// //             ca2.change_state(); //move to the next state;

// //         }

// //         // var currentFig = [];
// //         // //original dynamics
// //         // for (var col = 0; col < n; col++) {
// //         //     currentFig[col] = cells[col][n/2-1].state;
// //         // }
// //         // ca2.reconfigure(currentFig);
// //         // no change in state

// //         // var ca2state = ca2.getState();
// //         // // reconfigure the perturbation to the row (no perturbation)
// //         // //no random perturbations between timezones, CA continues with selforiganized dynamics
// //         // for (var col = 0; col < n; col++) {
// //         //     ca2Perturb[col] = ca2state[col];
// //         // }

// //         // 5. recompute and populate n next states
// //         var ca2state = ca2.getState();

// //         //3. fall off the edge before end of line
// //         // inititalize envrionment cells
// //         for (var row = n/2+1; row < n; row++) {
// //             ca2state = ca2.nextState(ca2state); //compute next state for future visualiation
// //             for(var col = 0 ; col < n; col++){
// //                 //console.log(cells[col][row])
// //                 //console.log(ca2state[col])
// //                 cells[col][row].state = ca2state[col];
// //                 setColor(cells[col][row]);
// //             }
// //         }


// //         //3. static state
// //         //3. copy perturbation

// //         //4. next state
// //         // ca1.nextState();
// //         // ca2.nextState();

// //         // 4. copy state to perturbation to nullify perturbation effect
// //         //var ca2state = ca2.getState()


// //         //copy to ensure that there is not perturbation without user interference

// //         t++;

// //         //5. shift existing environment
// //         // var row = gridn-1;
// //         // // inititalize envrionment cells
// //         // for (var i = 0; i < n; i++) {

// //         //     for(var j = row; j> 0; j--){
// //         //         cells[i][j].state = cells[i][j-1].state;
// //         //         setColor(cells[i][j])
// //         //     }
// //         // }

// //         // //6. initaite new environment
// //         // for(var i = 0; i< n; i++){

// //         //     if( Math.random() < percentPerturb){
// //         //         cells[i][0].state = 1;
// //         //     }
// //         //     else{
// //         //         cells[i][0].state = 0;
// //         //     }
// //         //     setColor(cells[i][0])
// //         // }

// //         //continue

// //     })();

//     rafId = requestAnimationFrame(drawLoop);

// }


window.addEventListener("keypress", function(c){

    //need to have a state that prevents too quick key presses/holding

	  //console.log("char code" + c.keyCode + "timestamp" + c.timeStamp)

    if( c.keyCode == 115){
        //drawLoop();
    }
    else if( c.keyCode == 114){
	      cancelAnimationFrame(rafId);
				rafId = null;
    }
    else if( c.keyCode == 74){
        if( currentFig ){
            currentFig.rotate -= 5;
            currentFig.setAttributeNS(null, "transform", 'rotate(' +  currentFig.rotate + ',' + currentFig.centerx + "," + currentFig.centery + ')');
        }
    }
    else if( c.keyCode == 75){
        if( currentFig ){
            currentFig.rotate += 5;
            currentFig.setAttributeNS(null, "transform", 'rotate(' +  currentFig.rotate + "," + currentFig.centerx + "," + currentFig.centery + ')');
        }
    }
});


window.addEventListener("mousemove", function(e){

    if( moveState == 0){

    }
    else{

        if( currentFig){
            var parent = currentFig.parentNode;
            //console.log(parent)
            //console.log(currentFig)
            parent.removeChild(currentFig);
        }

        var x = e.clientX - svgX;
        var y = e.clientY - svgY;
        //x = x-x%scale_w //discretize so that its clear cells within region are affected
        //y = y-y%scale_h

        switch( moveState)
        {

            case "square":  {
                var s1 = parseInt(document.getElementById("side").value)*side_w
                currentFig = create_rect(x, y, s1, s1,  "#ff0fff",  "#000000");
                currentFig.setAttributeNS(null, "transform", 'rotate(' +  currentFig.rotate + ',' + currentFig.centerx + "," + currentFig.centery + ')');
            } break;

            case "rhombus": {
                var s1 = parseInt(document.getElementById("rside").value)*side_w
                currentFig = create_parallelogram(x, y, s1, s1, 60,  "#ff0fff",  "#000000");
                currentFig.setAttributeNS(null, "transform", 'rotate(' +  currentFig.rotate + ',' + currentFig.centerx + "," + currentFig.centery + ')');

            }break;

            case "rectangle": {
                var s1 = parseInt(document.getElementById("length").value)*side_w
                var s2 = parseInt(document.getElementById("breadth").value)*side_h
                currentFig = create_rect(x,y, s1, s2,  "#ff0fff",  "#000000");
                currentFig.setAttributeNS(null, "transform", 'rotate(' +  currentFig.rotate + ',' + currentFig.centerx + "," + currentFig.centery + ')');

            }break;

            case "parallelogram": {
                var s1 = parseInt(document.getElementById("plength").value)*side_w
                var s2 = parseInt(document.getElementById("pbreadth").value)*side_h
                currentFig = create_parallelogram(x,y, s1, s2, 60,  "#ff0fff",  "#000000");
                currentFig.setAttributeNS(null, "transform", 'rotate(' +  currentFig.rotate + ',' + currentFig.centerx + "," + currentFig.centery + ')');

            }break;


            case "quadrilateral": {

            }break;

            case "eQTriangle": {

            }break;

            case "pentagon": {

            }break;


            case "hexagon": {

            }break;

            case "heptagon": {

            }break;

            case "octagon": {

            }break;

            case "area_diagram": {
                if( ar_diagram.default == true){
                    area_string += "M " + x + " " + y;
                    ar_diagram.setAttributeNS(null, "d", area_string)
                }
                else{
                    area_string += "L " + x + " " + y;
                    ar_diagram.setAttributeNS(null, "d", area_string)
                }
            }break;

        }
    }

    // setNewpath( currentFig, e.offsetX, e.offsetY, currentFig.b, currentFig.l)
    // currentFig.x = e.offsetX
    // currentFig.y = e.offsetY
});

window.addEventListener("mousedown", function(e){

    if( moveState == "square" || moveState == "rhombus" || moveState == "rectangle" || moveState == "parallelogram"){
        workspace.push(currentFig);
        moveState = 0;

        //currentFig.x = e.offsetX;
        //currentFig.y = e.offsetY;
        //var x = currentFig.x % scale_w
        //var y = currentFig.y % scale_h
        //currentFig.setNewpath(currentFig, currentFig.x - x, currentFig.y-y);
        // setNewpath( currentFig, currentFig.x - x, currentFig.y-y, currentFig.b, currentFig.l)
        // currentFig.x = currentFig.x - x
        // currentFig.y = currentFig.y-y
        // moveState = 0;
        // perturbOn = 1;
    }
    else if( moveState == "area_diagram" && ar_diagram && ar_diagram.default == true){
        ar_diagram.default = false
    }
    else if( moveState == "area_diagram" && ar_diagram && ar_diagram.default == false ){
        moveState = 0;
        workspace.push(ar_diagram);
    }
});


document.getElementById("square").addEventListener("click", function(e){

    var s1 = parseInt(document.getElementById("side").value)*side_w
    var x = pW/2;
    var y = pH/2;
    currentFig = create_rect(x,y, s1, s1,  "#00ffff",  "#000000");
    moveState = "square";

});

document.getElementById("rhombus").addEventListener("click", function(e){

    var s1 = parseInt(document.getElementById("rside").value)*side_w
    var x = pW/2;
    var y = pH/2;
    currentFig = create_parallelogram(x,y, s1, s1, 60,  "#000fff",  "#000000");
    moveState = "rhombus";

});

document.getElementById("rectangle").addEventListener("click", function(e){

    var s1 = parseInt(document.getElementById("length").value)*side_w
    var s2 = parseInt(document.getElementById("breadth").value)*side_h
    var x = pW/2;
    var y = pH/2;
    currentFig = create_rect(x,y, s1, s2,  "#000fff",  "#000000");
    moveState = "rectangle";
});

document.getElementById("parallelogram").addEventListener("click", function(e){
    var s1 = parseInt(document.getElementById("plength").value)*side_w
    var s2 = parseInt(document.getElementById("pbreadth").value)*side_h
    var x = pW/2;
    var y = pH/2;
    currentFig = create_parallelogram(x,y, s1, s2, 60,  "#000fff",  "#000000");
    moveState = "parallelogram";
});

document.getElementById("area").addEventListener("click", function(e){

    if( workspace.length!=0 && ar_diagram ){
        var parent = ar_diagram.parentNode;
        parent.removeChild(ar_diagram);
    }
    else if ( workspace.length==0 ){
        //already removed
    }

    area_string = "M" + pW/2 + " " + pH/2;
    ar_diagram = area(area_string, canvas)
    moveState = "area_diagram"

});

// document.getElementById("rectangle").addEventListener("click", function(e){

//     var s1 = parseInt(document.getElementById("length").value)
//     var s2 = parseInt(document.getElementById("breadth").value)
//     var row = gridn/2 - s1;
//     var col = gridn/2 - s2;

//     // if( currentFig){
//     //     var parent    = currentFig.parentNode;
//     //     parent.removeChild(currentFig);
//     // }

//     currentFig = create_rect(col, row, s1*side_w, s2*side_h,  "#0000ff");
//     currentFig.x = col*scale_w
//     currentFig.y = row*scale_h
//     currentFig.b = s1*side_w
//     currentFig.l = s2*side_h
//     currentFig.s1 = s1
//     currentFig.s2 = s2
//     moveState = 1;

// });

// document.getElementById("reset").addEventListener("click",function(e){

//     for( var row = 0; row < n; row++){
//         for(var col = 0; col <n; col++){
//             cells[col][row].state = 0;
//             setColor(cells[col][row]);
//         }
//     }
//     ca2.reconfigure(starting_config);


// });

// document.getElementById("stop").addEventListener("click",function(e){

//     cancelAnimationFrame(rafId);
// 		rafId = null;
// });

// document.getElementById("start").addEventListener("click",function(e){
//     drawLoop();
// });

document.getElementById("clear").addEventListener("click",function(e){

    gol.clear();
});

document.getElementById("reset").addEventListener("click",function(e){

    for(var i= 0; i< workspace.length;i++){
        var cf = workspace[i]
        if( cf ){
            var parent = cf.parentNode;
            parent.removeChild(cf);
        }
    }
    workspace = [];

});

// // n perturbation
// document.getElementById("nP").addEventListener("click",function(e){

//     //later control proportion of white and black
//     //ca2.setPerturbed();

//     var numP = document.getElementById("percentPert").value;
//     //with a certain pertangage flip the digits
//     gen_perturbation(parseInt(numP));

// });

// document.getElementById("restart").addEventListener("click",function(e){

//     //later control proportion of white and black
//     //generate new random sequence
//     var currentFig = []
//     for(var i = 0; i< n; i++){

//         if( Math.random() < percentCA){
//             currentFig[i] = 1;
//         }
//         else{
//             currentFig[i] = 0
//         }
//     }
//     ca2.reconfigure(currentFig);
// });


// // document.getElementById("back").addEventListener("click", function(e){

// //     if( backward_computation.length == 0){
// //         //do not pop
// //     }
// //     else{

// //         var last_state = backward_computation.pop();

// //         console.log(last_state);

// //         for(var col = 0 ; col < n; col++){
// //             boundary[col].state = last_state.ca[col];
// //             setColor( boundary[col]);
// //         }

// //         for( row = 0; row < gridn-1; row++){
// //             for(col=0; col < n; col++){
// //                 cells[col][row].state = cells[col][row+1].state
// //                 setColor(cells[col][row]);
// //             }
// //         }

// //         for(var col = 0 ; col < n; col++){
// //             cells[col][gridn-1].state = last_state.env[col];
// //             setColor( cells[col][gridn-1]);
// //         }

// //         for( row = gridn+1; row < n-1; row++){
// //             for(col=0; col < n; col++){
// //                 cells[col][row].state = cells[col][row+1].state
// //                 setColor(cells[col][row]);
// //             }
// //         }

// //         row = n-1;
// //         for(col=0; col < n; col++){
// //             cells[col][row].state = last_state.last_ca[col];
// //             setColor(cells[col][row]);
// //         }


// //         for (var col = 0; col < boundary.length; col++) {

// //             var prev = col -1, next = col + 1;

// //             if( prev < 0 ){
// //                 prev  = n - 1
// //             }

// //             if( next == n ){
// //                 next = 0;
// //             }

// //             cells[col][gridn+1].state = next_state( boundary[prev].state, boundary[col].state, boundary[next].state, document.getElementById("carulebinary").value);
// //             setColor(cells[col][gridn+1]);
// //         }

// //         for (var bcell = 0; bcell < n; bcell++) {

// //             //sense perturbation
// //             if ( boundary[bcell].state != cells[bcell][gridn-1].state){
// //                 //boundary[bcell].rect.setAttributeNS(null,"fill","red")
// //                 boundary[bcell].path.setAttributeNS(null, 'stroke', "#0000ff");
// //                 boundary[bcell].path.setAttributeNS(null, 'stroke-width', 2);
// //             }
// //             else{
// //                 //no change
// //                 boundary[bcell].path.setAttributeNS(null, 'stroke', "#ff0000");
// //                 boundary[bcell].path.setAttributeNS(null, 'stroke-width', 1);

// //             }
// //         }


// //     }


// // });



// document.getElementById("percentCA").addEventListener("change",function(e){
//     percentCA = parseFloat(e.target.value);
// })

// document.getElementById("percentPert").addEventListener("change",function(e){
//     percentPerturb = parseFloat(e.target.value);
// })

// document.getElementById("pertOn").addEventListener("click",function(e){
//     if( pertOn == 1){
//         pertOn = 0
//         e.target.value = "Perturbations are off"
//     }
//     else{
//         pertOn = 1;
//         e.target.value = "Perturbations are on"
//     }
// })


// function gen_perturbation( npos ){

//     console.log(npos)

//     // 1. get current ca next state
//     var ca2Perturb = []
//     for( col = 0; col < n; col++){
//         ca2Perturb[col] = cells[col][n/2+1];
//     }

//     //2. select n distinct positions
//     var pos = []
//     var  i = 0;
//     while ( i < npos){
//         var num = Math.floor( Math.random()*n);
//         if( pos.indexOf(num) == -1){
//             pos.push(num);
//             i++;
//         }
//     }

//     console.log(pos);

//     //3. perturb those positions
//     var row = n/2+1;
//     for(var col = 0; col< pos.length; col++){
//         cells[pos[col]][row].state = (cells[pos[col]][row].state+1)%2;
//         console.log(cells[pos[col]][row])
//     }

//     for( col = 0; col < n; col++){
//         setColor(cells[col][row]);

//     }


// }
