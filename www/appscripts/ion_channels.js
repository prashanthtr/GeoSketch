
// how is the mind embodied in biology -

// how is a construct of the mind such as a number embodied in biology - and is
// there is robust implementation that serves to show this.

// The goal has shifted a bit from modeling the mechanism of ion transfer to
// building a computational environment - a microworld - that allows us to
// explore the dynamics of ion-channel transfer.

// From the chat with Lakshmi, it seemed that I have to account for two kinds of
// phenonmenon - namely, the dynamics of firing of an individual neuron. There
// are two patterns of firing - regular, and irregular. The dynamics of a group
// of neuron are characterized through synchronous, and asynchronous behaviors.

// The cellular environment needs to be rich enough to simulate the dynamics of
// variety of neural behviors found in regular, and irregular firing for an
// individual, and synchronous, and asynchronous firing for a group of neurons.

// Furthermore, the goal is to find out whether there are determinsitic
// interaction rules between the grid components of the differnet cells in the
// world, that simulate such behavior.

// Eventually, this could become a learing enviroment for students/professors/
// who tinkering with neural networks, and build networks to solve specific
// computational problems.



// in order to mdoel the cellular homeostasis, the rules of the should
// incorporate the distribution of the charges of the neighbouring cells. This
// is a difference from original bittorio.

// A CA-rule then is a combination of charges/values of the adjacent cells,
// charges of the adjacent ions, much like the rule of a cell in the game of
// life. The interpretation though is matter of Ionic channel - that is, red
// cells mean, open chanels, and black cells mean closed channels.

// The representation of the CA rule in terms of charges/charge values is
// important so it is possible to describe the homeostatic behavior of the cell
// in terms of the conservation of ion charge inside the cell. - maintaining a
// membrane potential.

// Another way is to consider the cells as perturbartions - green cells as
// perturbations, and yellow as non-perturbations. Again, this feels a little
// bit arbitrary (and a desgigner choice).

// This allows us to observe one important aspect of this system (have to name
// it) - the ability to alter the envrionment thorugh action coupling. This is
// an ability that is observed in the game of life simulations but also often
// resulted in the destruction of the glider/other entities. Here, it is an
// example, in which the cell maintains operational closure, but affects
// envrionment through interaction based on changes in alterations in membrane
// potential. This is far more accurate model of the cell.

//// Now we can explore whether different cells will be able to form mutually
//// influencing perturbations in a same environment.

// computational science -

import {js_clock} from "./clocks.js"
import {create_rect_fn, on_boundary} from "./utils.js"
import {create_cell} from "./cell_spec.js"

//in onfig file

var n = 20;
var side = 16;

var positive = 1;
var negative = -1;
var b_charge = +1;
var neutral = 0;


var canvas = document.getElementById( 'svgCanvas' );
var pW = canvas.clientWidth;
var pH = canvas.clientHeight;

var pWidth = pW - pW%n
var pHeight = pH - pH%n

console.log(pWidth + "  " + pHeight);

// 40 * 40 grid
var scale_w = Math.floor(pWidth/n);
var scale_h = Math.floor(pHeight/n);

var create_rect = create_rect_fn(scale_w, scale_h, canvas);
var rafId = null;

var yellow = "#ffffa1"
var green = "#98ee90"

var scale = 0.9*Math.min(pWidth, pHeight);
var pi = Math.PI;

var store_src = [];

var rect = create_rect(0,0,pWidth,pHeight,"white");
var cells = [];

// inititalize envrionment cells
for (var i = 0; i < n; i++) {

    cells[i] = []

    for(var j = 0; j< n; j++){

        var renv = Math.random()
        if(renv > 0.4){
            cells[i][j] = create_cell(i,j,"env");
            cells[i][j].rect = create_rect(i, j, side, side, yellow);
            cells[i][j].state = negative; //negative charge
            cells[i][j].rect.state = negative
        }
        else {
            cells[i][j] = create_cell(i,j);
            cells[i][j].rect = create_rect(i,j,side, side, green);
            cells[i][j].state = positive;
            cells[i][j].rect.state = positive
        }

        cells[i][j].rect.addEventListener("mouseover", function(e){
            this.state = this.state==negative?positive:negative;
            if( this.state == positive) this.setAttributeNS(null,"fill",green)
            else this.setAttributeNS(null,"fill",yellow);
        });

        cells[i][j].xpos = x
        cells[i][j].ypos = y

    }

    // cells[i].vx = -7 + Math.floor(Math.random()*15)
    // cells[i].vy = -7 + Math.floor(Math.random()*15)
}

var inner_boundary = [];
var temp = []


// r = 60;
// for (var i = 0; i < 12; i++) {

//     var angle = i*Math.PI/6;

//     var x = pWidth/2 + Math.floor( r*Math.cos(angle) ); // to get it in units
//     var y = pHeight/2 + Math.floor( r*Math.sin(angle));

//     var rect = create_rect(x,y, 'white');
//     rect.addEventListener("mousedown", function(e){
//         this.state = 1;
//         this.setAttributeNS(null,"fill","red")
//     });

//     rect.xpos = x
//     rect.ypos = y
//     ext_temp.push(0);
//     outer_boundary.push(rect);
// }





var r = 1.3;

for (var i = 0; i < 10; i++) {

    var angle = i*2*Math.PI/10;

    var x = n/2 + Math.floor( r*Math.cos(angle) ); // scale_w*(n/2 + Math.floor( r*Math.cos(angle) )); // to get it in units
    var y = n/2 + Math.floor( r*Math.sin(angle) ); //scale_h*(n/2 + Math.floor( r*Math.sin(angle) ));

    if( inner_boundary.length > 0){
        if( on_boundary( x,y, inner_boundary ) == 0){
            var bcell = create_cell(x,y,"boundary");
            bcell.rect = create_rect(x,y, side, side, 'black');
            bcell.rect.addEventListener("mouseover", function(e){
                this.state = this.state == 1?0:1;
                if( this.state == 1){
                    this.setAttributeNS(null,"fill","red")
                }
                else{
                    this.setAttributeNS(null,"fill","black")
                }
                this.setAttributeNS(null,"fill-opacity",1); //back up
            });

            inner_boundary.push(bcell);
            temp.push(0);
        }
        else{
            //do not push
        }
    }
    else{
            //push once
            var bcell = create_cell(x,y,"boundary");
            bcell.rect = create_rect(x,y, side, side, 'black');
            bcell.rect.addEventListener("mouseover", function(e){

                this.state = this.state == 1?0:1;
                if( this.state == 1){
                    this.setAttributeNS(null,"fill","red")
                }
                else{
                    this.setAttributeNS(null,"fill","black")
                }
                this.setAttributeNS(null,"fill-opacity",1); //back up
            });
        inner_boundary.push(bcell);
            temp.push(0);
        }


    //pHeight/2 + Math.floor( r*Math.sin(angle));


}

inner_boundary.map(function(ib){
    ib.assign_adj_cell(inner_boundary, cells, cells.length, cells[0].length);
    //maximum number of cel;ls in length and width of the grid
});

inner_boundary.map(function(ib){
    console.log(ib)
});


var grid = [];

// inititalize envrionment cells
for (var i = 0; i < n; i++) {
    grid[i] = []
    for(var j = 0; j< n; j++){
        cells[i][j].assign_adj_cell(inner_boundary, cells, n, n);
        grid[i][j] = 0;
    }
}

// // inititalize envrionment cells
// for (var i = 0; i < n; i++) {
//     grid[i] = []
//     for(var j = 0; j< n; j++){
//         console.log(cells[i][j].adjacent);
//     }
// }




//display after every action
var display = js_clock(10, 500);

//runs simulation of cellular autonmaton
var drawLoop = function(){

    var now = Date.now();

    //displays every 125,ms
    display(now, function(){

        for (var i = 0; i < inner_boundary.length; i++) {
            temp[i] = inner_boundary[i].act(inner_boundary);
        }

        for (var i = 0; i < inner_boundary.length; i++) {

            inner_boundary[i].state = temp[i];
            inner_boundary[i].rect.state = temp[i]
            if( inner_boundary[i].state == b_charge){
                inner_boundary[i].rect.setAttributeNS(null,"fill","red")
            }
            else{
                inner_boundary[i].rect.setAttributeNS(null,"fill","black")
            }

        }


        // console.log("CA => " + boundary.map(function(f){return f.state}).join("-"));

        for(i = 0; i< cells.length;i++){
            for( j=0; j< cells[i].length; j++){
                if( !on_boundary( cells[i][j].xind, cells[i][j].yind, inner_boundary )){
                    grid[i][j] = cells[i][j].act(cells[i][j].state, cells[i][j].adjacent, inner_boundary)
                }

            }
        }

        for(i = 0; i< cells.length;i++){
            for( j=0; j< cells[i].length; j++){
                cells[i][j].state = grid[i][j]
                cells[i][j].rect.state = grid[i][j]
                if( cells[i][j].state == positive ){
                          cells[i][j].rect.setAttributeNS(null,"fill",green)
                }
                else{
                    cells[i][j].rect.setAttributeNS(null,"fill",yellow)
                }
            }
        }

        console.log("will diosplauy")
    })();

    rafId = requestAnimationFrame(drawLoop);
};


window.addEventListener("keypress", function(c){

    //need to have a state that prevents too quick key presses/holding

	  //console.log("char code" + c.keyCode + "timestamp" + c.timeStamp)

    if( c.keyCode == 115){
        drawLoop();
    }
    else if( c.keyCode == 114){
	      cancelAnimationFrame(rafId);
				rafId = null;
    }
});


// function within_boundary(  cell ){

//     var min = n/2-3;
//     var max = n/2+3;

//     if( cell.xpos > min*scale_w  && cell.xpos < max*scale_w &&  cell.ypos > min*scale_h && cell.ypos < max*scale_h  ){
//         //console.log("within")
//         return 1;

//     }
//     else{
//         return 0;
//     }

// }

// function onboundary(  cell, boundary ){

//     var near_boundary = 0;
//     for(var i = 0; i <boundary.length; i++){
//         var cx = cell.xpos/scale_w
//         var cy = cell.ypos/scale_h
//         var bx = boundary[i].xpos/scale_w
//         var by = boundary[i].ypos/scale_h

//         if( (Math.abs( cx - bx ) <= 1 && Math.abs( cx - bx ) != 0) ||  (Math.abs( cy - by ) <= 1 && Math.abs( cy - by ) != 0) ){
//             near_boundary = 1;
//         }
//     }
//     return near_boundary;
// }

function neighbours_sum ( cell, boundary ){

    var n_arr = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,0],[0,1],[1,-1],[1,0],[1,1]];
    var sum = 0;
    var pos = -1;

    for(var i =0; i<n_arr.length; i++){
        var bool_check = 0;
        for(var j=0; j<boundary.length; j++){

            var cx = cell.xpos/scale_w
            var cy = cell.ypos/scale_h
            var bx = boundary[j].xpos/scale_w
            var by = boundary[j].ypos/scale_h

            if( cx + n_arr[i][0] == bx && cy + n_arr[i][1] == by){
                bool_check = 1
                pos = j
                console.log("found nearest boundary for cell " + cx + "," + cy + " at " + bx + "," + by);
            }
        }
        if(bool_check == 1){
            sum += 2*boundary[pos].state; //twice the charge
        }
    }
    return sum;

}

// Ca rule takes in a bunch of cells adjacent to the boundary cell - and gives
// different weights to adjacent cells on the boundary, and cells outside,
// andinterior to the boundary.

// the cellular automaton rules that each object uses to compute
// their states.
function ca_rule (prev, cur, next){

    var rule = document.getElementById('carulebinary').value;
    rule = rule.split("");
    rule = rule.map(function(r){ return parseInt(r);});

    //console.log("carule is" + rule);

    var castate = prev + "" +  cur + ""+ next;
    //console.log(castate);
    //ca rule

    var ret = -1;
    switch(castate){
    case "000": ret = rule[0]; break;
    case "001": ret = rule[1];  break;
    case "010": ret = rule[2];  break;
    case "011": ret = rule[3];  break;
    case "100": ret = rule[4]; break;
    case "101": ret = rule[5];  break;
    case "110": ret = rule[6];  break;
    case "111": ret = rule[7];  break;
    default: ret = -1; break;
    };
    return ret;
}
