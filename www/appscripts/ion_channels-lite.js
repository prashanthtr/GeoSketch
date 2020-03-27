

// Lite version of ion channels with 3 charges, membrane column, and ion
// exchange.

import {js_clock} from "./clocks.js"
import {create_rect_fn} from "./utils.js"
import {create_cell, on_boundary} from "./cell_spec_lite.js"


var n = 14;
var side = 16;

var sodium = 1.5;
var potassium = 1;
var chloride = -1;
var neutral = 0;
var active = 1;
var inactive = 0;


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

//var rect = create_rect(0,0,pWidth,pHeight,"#add8e6");
// var rect2 = create_rect(0, pHeight/(2*scale_w), pWidth, pHeight/2, "#fadadd");


var rafId = null;

var yellow = "#ffffa1"
var green = "#98ee90"
var purple = "#e3daff"
var red = "#ff0000"; //active
var black = "#000000" //inactive

var scale = 0.9*Math.min(pWidth, pHeight);
var pi = Math.PI;

// var rect = create_rect(0,0,pWidth,pHeight/2,"#add8e6");
// var rect2 = create_rect(0, pHeight/(2*scale_w), pWidth, pHeight/2, "#fadadd");

var store_src = [];


var cells = [];

// inititalize envrionment cells
for (var i = 0; i < n; i++) {

    cells[i] = []

    for(var j = 0; j< n; j++){

        if ( j == n/2){

            cells[i][j] = create_cell(i,j,"env");
            cells[i][j].rect = create_rect(i, j, side, side, black);
            cells[i][j].state = neutral; //negative charge
            cells[i][j].rect.state = potassium
        }
        else if( j < n/2){
            //less potassium, more sodium and chroline

            var renv = Math.random()

            if( renv <= 0.1){
                cells[i][j] = create_cell(i,j,"env");
                cells[i][j].rect = create_rect(i, j, side+8, side+8, purple);
                cells[i][j].state = potassium; //negative charge
                cells[i][j].rect.state = potassium
            }
            else if(renv > 0.1 && renv <= 0.55){
                cells[i][j] = create_cell(i,j,"env");
                cells[i][j].rect = create_rect(i, j, side+4, side+4, yellow);
                cells[i][j].state = chloride; //negative charge
                cells[i][j].rect.state = chloride
            }
            else {
                cells[i][j] = create_cell(i,j);
                cells[i][j].rect = create_rect(i,j,side, side, green);
                cells[i][j].state = sodium;
                cells[i][j].rect.state = sodium
            }

        }
        else if( j > n/2){
            //more potassium

            var renv = Math.random()

            if( renv <= 0.7){
                cells[i][j] = create_cell(i,j,"env");
                cells[i][j].rect = create_rect(i, j, side+8, side+8, purple);
                cells[i][j].state = potassium; //negative charge
                cells[i][j].rect.state = potassium
            }
            else if(renv > 0.7 && renv <= 0.85){
                cells[i][j] = create_cell(i,j,"env");
                cells[i][j].rect = create_rect(i, j, side+4, side+4, yellow);
                cells[i][j].state = chloride; //negative charge
                cells[i][j].rect.state = chloride
            }
            else {
                cells[i][j] = create_cell(i,j);
                cells[i][j].rect = create_rect(i,j,side, side, green);
                cells[i][j].state = sodium;
                cells[i][j].rect.state = sodium
            }


        }

        cells[i][j].xpos = i*scale_w
        cells[i][j].ypos = j*scale_h

    }

    // cells[i].vx = -7 + Math.floor(Math.random()*15)
    // cells[i].vy = -7 + Math.floor(Math.random()*15)
}



//initialize boundary row

var boundary = [];

var row = n/2;

for (var col = 0; col < n; col++) {

    boundary[col] = create_cell(col,row,"boundary");
    boundary[col].rect = create_rect(col, row, side, side, black);
    boundary[col].state = inactive; //negative charge
    boundary[col].rect.state = inactive

    boundary[col].rect.addEventListener("mouseover", function(e){

        this.state = this.state == 1?0:1;
        if( this.state == 1){
            this.setAttributeNS(null,"fill","white")
        }
        else{
            this.setAttributeNS(null,"fill","black")
        }
    });


}


var grid = [];

// inititalize envrionment cells
for (var i = 0; i < n; i++) {
    grid[i] = []
    for(var j = 0; j< n; j++){
        cells[i][j].assign_adj_cell(boundary, cells, n, n);
        grid[i][j] = 0;
    }
}

for (var col = 0; col < n; col++) {
    boundary[col].assign_adj_cell(boundary, cells, n, n)
}

//display after every action
var display = js_clock(20, 250);

//loop that runs faster
var sense = js_clock(10, 125);


//runs simulation of cellular autonmaton
var drawLoop = function(){

    var now = Date.now();

    sense(now, function(){
        // need to have a different rate for sensing and state change
        //voltaget senseing
        for (var bcell = 0; bcell < boundary.length; bcell++) {

            var prev =0 , next = 0;
            var adj = boundary[bcell].adjacent;
            var sense = 0;
            for(var ac = 0; ac < adj.length; ac++){

                if( !on_boundary(adj[ac].xind, adj[ac].yind, boundary, boundary.length )){
                    if( boundary[bcell].yind < adj[ac].yind ){
                        next = adj[ac].state;
                    }
                    else{
                        prev = adj[ac].state;
                    }
                }
            }

            console.log("Diofference " + next + ", " + prev + "," + (next-prev))
            var sense_val = next - prev; // difference in threshold, gradient from inside cell to ousdie

            //sense is difference bertewewen in and out
            if( sense_val  < -1 || sense_val > 1) {
                //channel for both sodium and potassium ions flow
                //console.log("non equilibrium potential")
                boundary[bcell].state = active;
                boundary[bcell].rect.state = active;
                boundary[bcell].rect.setAttributeNS(null,"fill","white")
                //perturbed state
            }
            //cllosing is due to internal dynamics
            // else{
            //     boundary[bcell].state = inactive;
            //     boundary[bcell].rect.state = inactive;
            //     boundary[bcell].rect.setAttributeNS(null,"fill","black")
            // }
        }

        console.log("CA threshold => " + boundary.map(function(f){return f.state}).join("-"));

    })();


    //displays every 250 ms
    display(now, function(){


        // for (var i = 0; i < boundary.length; i++) {

        //     if ( boundary[i].state != boundary[i].rect.state ){
        //         //console.log("updating boundary state");
        //         boundary[i].state = boundary[i].rect.state
        //     }

        //     //console.log(boundary.map(function(b){ return b.state }).join("-"));

        //     //like a perturbation
        //     // if( boundary[i].state == ){
        //     //     boundary[i].rect.setAttributeNS(null,"fill","red")
        //     // }
        //     // else{
        //     //     boundary[i].rect.setAttributeNS(null,"fill","black")
        //     // }
        // }

        //boundary
        for (var bcell = 0; bcell < boundary.length; bcell++) {

            //channel for both sodium and potassium ions flow
            boundary[bcell].act(boundary);

            boundary[bcell].rect.state = boundary[bcell].state;
            if( boundary[bcell].state == active){
                boundary[bcell].rect.setAttributeNS(null,"fill","white")
            }
            else{
                boundary[bcell].rect.setAttributeNS(null,"fill","black")
            }

        }

        console.log("CA dynamics => " + boundary.map(function(f){return f.state}).join("-"));
        //console.log(boundary);

        for(i = 0; i< cells.length;i++){
            for( j=0; j< cells[i].length; j++){

                if( !on_boundary( cells[i][j].xind, cells[i][j].yind, boundary, boundary.length )){
                    //happens one by one, byt consistent

                    cells[i][j].act(boundary);

                    // cells[i][j].rect.state = cells[i][j].state

                    // if( cells[i][j].state == sodium ){
                    //     cells[i][j].rect.setAttributeNS(null,"fill",green)
                    //     cells[i][j].rect.setAttributeNS(null,"height",side)
                    //     cells[i][j].rect.setAttributeNS(null,"width",side)
                    // }
                    // else if( cells[i][j].state == potassium ){
                    //     cells[i][j].rect.setAttributeNS(null,"fill",purple)
                    //     cells[i][j].rect.setAttributeNS(null,"height",side+10)
                    //     cells[i][j].rect.setAttributeNS(null,"width",side+10)
                    // }
                    // else if(cells[i][j].state == chloride){
                    //     cells[i][j].rect.setAttributeNS(null,"fill",yellow)
                    //     cells[i][j].rect.setAttributeNS(null,"height",side+7)
                    //     cells[i][j].rect.setAttributeNS(null,"width",side+7)
                    // }
                    // else{
                    //     //no change
                    // }

                    // //update swap
                    // var adj = cells[i][j].adjacent
                    // for(var ad = 0; ad < adj.length; ad++){

                    //     adj[ad].rect.state = adj[ad].state

                    //     if( adj[ad].state == sodium ){
                    //         adj[ad].rect.setAttributeNS(null,"fill",green)
                    //         adj[ad].rect.setAttributeNS(null,"height",side)
                    //         adj[ad].rect.setAttributeNS(null,"width",side)
                    //     }
                    //     else if( adj[ad].state == potassium ){
                    //         adj[ad].rect.setAttributeNS(null,"fill",purple)
                    //         adj[ad].rect.setAttributeNS(null,"height",side+10)
                    //         adj[ad].rect.setAttributeNS(null,"width",side+10)
                    //     }
                    //     else if(adj[ad].state == chloride){
                    //         adj[ad].rect.setAttributeNS(null,"fill",yellow)
                    //         adj[ad].rect.setAttributeNS(null,"height",side+7)
                    //         adj[ad].rect.setAttributeNS(null,"width",side+7)
                    //     }
                    //     else{
                    //         //no change
                    //     }


                    //}

                }

            }
        }


        // for(i = 0; i< cells.length;i++){
        //     for( j=0; j< cells[i].length; j++){

        //         // cells[i][j].state = grid[i][j]

        //         cells[i][j].rect.state = cells[i][j].state

        //         if( cells[i][j].state == sodium ){
        //             cells[i][j].rect.setAttributeNS(null,"fill",green)
        //             cells[i][j].rect.setAttributeNS(null,"height",side)
        //             cells[i][j].rect.setAttributeNS(null,"width",side)
        //         }
        //         else if( cells[i][j].state == potassium ){
        //             cells[i][j].rect.setAttributeNS(null,"fill",purple)
        //             cells[i][j].rect.setAttributeNS(null,"height",side+8)
        //             cells[i][j].rect.setAttributeNS(null,"width",side+8)
        //         }
        //         else if(cells[i][j].state == chloride){
        //             cells[i][j].rect.setAttributeNS(null,"fill",yellow)
        //             cells[i][j].rect.setAttributeNS(null,"height",side+4)
        //             cells[i][j].rect.setAttributeNS(null,"width",side+4)
        //         }
        //         else{
        //             //no change
        //         }
        //     }
        // }

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
