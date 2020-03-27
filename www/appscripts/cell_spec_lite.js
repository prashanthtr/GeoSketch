
// Cell specs with only 4 adjacent neighbours

//input: x,y, max number of cells,
// -1 is length-1 : grid wraps around
// length+1 is 0 : grid wraps around

var sodium = 1.5;
var potassium = 1;
var chloride = -1;
var neutral = 0;

var yellow = "#ffffa1"
var green = "#98ee90"
var purple = "#e3daff"
var red = "#ff0000"; //active
var black = "#000000" //inactive

var side = 16;

// description for the cells (ions, boundary cells, ions interior to the cell)
export function create_cell(x, y, type){

    var cell = {}

    cell.state = 0; // on or off (0 or 1)
    //cell.color = "black" //off

    //at any one time, more than 1 cell can be active (assumption) - there will
    //be a competition for action.

    //index positions
    cell.xind = x
    cell.yind = y
    cell.type = type;

    cell.update_rule = type=="boundary"?ca_rule:ion_rule;

    cell.adjacent = []
    cell.adjacent_states = []

    cell.int_env = [];
    cell.ext_env = [];

    cell.rect = { state: 0}

    cell.assign_adj_cell = function(boundary, env, maxX, maxY){

        var x = cell.xind
        var y =  cell.yind
        var adjacent = [ [x-1,y] , [x, y-1], [x,y+1], [x+1,y] ]; // four adjacent neighbours

        adjacent.map(function(a){

            var xind = -1
            if( a[0] < 0 ){
                xind  = maxX - 1
            }
            else if( a[0] == maxX){
                xind = 0
            }
            else{
                xind = a[0]
            }

            var yind = -1
            if( a[1] < 0 ){
                yind  = maxY/2 - 1
            }
            else if( a[1] == maxY){
                yind = maxY/2 + 1
            }
            else{
                yind = a[1]
            }

            if( on_boundary(xind, yind ,boundary, boundary.length)){
                // on boundary

                //external cells of the boundary are adjacent to the charges
                var bind = find_boundary_el(xind, yind,boundary)
                cell.adjacent.push(boundary[bind]);
                //cell.adjacent_to_boundary.push(boundary[bind].ext_env);
            }
            else if(within_boundary(xind, yind, maxX)){
                //console.log(xind + " , " + yind)
                cell.adjacent.push(env[xind][yind]);
            }
            else{
                cell.adjacent.push(env[xind][yind])  //sensors for adjacent boundary
            }
        });
    };

    cell.get_adjacent_states = function(){

        // cell.next_cell_state = this.sense_next_cell(); // cell.next_cell.state
        // cell.prev_cell_state = this.sense_prev_cell() ; //cell.prev_cell.state
        //cell.next2_next_cell_state = cell.next2_next_cell.state;
        //cell.prev2_prev_cell_state = cell.prev2_prev_cell.state;
        cell.adjacent_states = cell.adjacent.map((b) => {return b.state });
    };

    cell.act = function(boundary ){

        cell.get_adjacent_states();
        cell.state = cell.rect.state;
        var current_neighbours = []


        if ( on_boundary( cell.xind, cell.yind, boundary, boundary.length ) == 1  ){
            current_neighbours = current_neighbours.concat(cell.adjacent);
            //console.log(current_neighbours);
        }
        else{

            //( within_boundary( cell.xpos, cell.ypos, 20) == 1 )

            //computation happesn only when any of the adjacent neighbours are 1

            //current_neighbours = current_neighbours.concat(cell.adjacent);
            //dynamically construct neighbour for ion exchange based on open
            //channel


            for(var i=0; i<cell.adjacent.length;i++){

                if( on_boundary(cell.adjacent[i].xind, cell.adjacent[i].yind, boundary, boundary.length ) && cell.adjacent[i].state == 1 ){

                    console.log("boundary cell is on ");
                    //common neighbours
                    //var nn = new_neighbours(cell.adjacent, cell.adjacent[i].adjacent);

                    var celladj = cell.adjacent[i];
                    var adj_adj = celladj.adjacent;
                    //only copy those cells are commonly adjacent
                    for(var j = 0; j < adj_adj.length;j++){

                        if( within_boundary( cell.xind, cell.yind, boundary.length) == 1 ){

                            //find the adjacent cell outside hte boundary
                            if( !within_boundary(adj_adj[j].xind , adj_adj[j].yind, boundary.length ) &&
                                !on_boundary(adj_adj[j].xind , adj_adj[j].yind, boundary, boundary.length)
                            ){
                                current_neighbours.push(adj_adj[j]);
                            }
                        }
                        else {
                            //find the adjacent cell within the boundary
                            if( within_boundary(adj_adj[j].xind , adj_adj[j].yind, boundary.length ) &&
                                !on_boundary(adj_adj[j].xind , adj_adj[j].yind, boundary, boundary.length)
                              ){
                                current_neighbours.push(adj_adj[j]);
                            }

                        }
                    }
                    console.log("added new neighbuurs to " + cell.xind + "," + cell.yind);
                    //console.log(current_neighbours)
                    //current_neighbours = current_neighbours.concat(nn);
                    //add neighbours adjacent boundary cells that are 1
                }
                else{
                    //within or outside the boundary
                    //within_boundary( cell.adjacent[i].xpos, cell.adjacent[i].ypos, 20  ) == 1 ){
                    current_neighbours.push(cell.adjacent[i]);
                }
            }
        }

        // else{
        //     //proabably neighbour rule for boudnary rule
        //     current_neighbours = current_neighbours.concat(cell.adjacent);
        // }

        //console.log(current_neighbours)
        //need to rule to say interior cell computes only when any of the adjacent boundary elements is on
        //cell.state =

        cell.update_rule(this, current_neighbours, boundary);
        // ion change rule that determines next state

        cell.rect.state = cell.state

        if( cell.state == sodium ){
            cell.rect.setAttributeNS(null,"fill",green)
            cell.rect.setAttributeNS(null,"height",side)
            cell.rect.setAttributeNS(null,"width",side)
        }
        else if( cell.state == potassium ){
            cell.rect.setAttributeNS(null,"fill",purple)
            cell.rect.setAttributeNS(null,"height",side+8)
            cell.rect.setAttributeNS(null,"width",side+8)
        }
        else if(cell.state == chloride){
            cell.rect.setAttributeNS(null,"fill",yellow)
            cell.rect.setAttributeNS(null,"height",side+4)
            cell.rect.setAttributeNS(null,"width",side+4)
        }
        else{
            //no change
        }

        //update swap
        var adj = cell.adjacent
        for(var ad = 0; ad < adj.length; ad++){

            if( !on_boundary(adj[ad].xind , adj[ad].yind, boundary, boundary.length) ){

                adj[ad].rect.state = adj[ad].state

                if( adj[ad].state == sodium ){
                    adj[ad].rect.setAttributeNS(null,"fill",green)
                    adj[ad].rect.setAttributeNS(null,"height",side)
                    adj[ad].rect.setAttributeNS(null,"width",side)
                }
                else if( adj[ad].state == potassium ){
                    adj[ad].rect.setAttributeNS(null,"fill",purple)
                    adj[ad].rect.setAttributeNS(null,"height",side+8)
                    adj[ad].rect.setAttributeNS(null,"width",side+8)
                }
                else if(adj[ad].state == chloride){
                    adj[ad].rect.setAttributeNS(null,"fill",yellow)
                    adj[ad].rect.setAttributeNS(null,"height",side+4)
                    adj[ad].rect.setAttributeNS(null,"width",side+4)
                }
                else{
                    //no change
                }
            }

        }

    }

    return cell;
}


//checks if cell within boundary
function within_boundary(  xind, yind, n ){

    var min = n/2;
    var max = n;

    if( yind > min && yind <= max  ){
        return 1;
    }
    else{
        return 0;
    }
}


export function on_boundary( x, y , boundary, n ){

    // var on_bound = 0;
    // for(var i = 0; i <boundary.length; i++){
    //     var bx = boundary[i].xind
    //     var by = boundary[i].yind

    //     if( Math.abs( x - bx ) == 0 && Math.abs( y - by ) == 0 ){
    //         on_bound = 1;
    //     }
    // }
    // return on_bound;

    if( y == n/2 ){
        return 1
    }
    else{
        return 0;
    }
}


function find_boundary_el(x,y, boundary){

    var pos = -1;
    for(var i = 0; i <boundary.length; i++){
        if( x == boundary[i].xind && y == boundary[i].yind){
            pos = i;
            break;
        }
    }
    return pos;
}


//no change

function ca_rule ( cell, neighbours, boundary){

    //no change
    //return state;

    var prev = 0, next = 0;

    for (var bcell = 0; bcell < neighbours.length; bcell++) {

        if( on_boundary(neighbours[bcell].xind, neighbours[bcell].yind, boundary, boundary.length ) == 1){
            if( neighbours[bcell].xind < cell.xind ){
                prev = neighbours[bcell].state
            }
            else{
                next = neighbours[bcell].state
            }
        }

    }

    var ruleString = document.getElementById("carulebinary").value;

    cell.state = next_state(prev, cell.state, next, ruleString );

}


function next_state (prev, cur, next, ruleString){

    var rule = ruleString.split("");
    rule = rule.map(function(r){ return parseInt(r);});

    //console.log("carule is" + rule);

    var castate = prev + "" +  cur + ""+ next;
    console.log(castate);
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

    console.log("CA state" )
    console.log("next state is " + ret);

    return ret;
}


// moves the ion
function ion_rule (cell, neighbours, boundary ){

    var conflict = 0;
    for( var n = 0; n< neighbours.length; n++  ){

        //both anions and cations can move in concentration gradient
        if( cell.state > 0 && cell.state == neighbours[n].state && !on_boundary( neighbours[n].xind, neighbours[n].yind, boundary, boundary.length  )){ //equal charge
            conflict = 1;
        }
    }

    if( conflict == 1){

        var less_charge =[];

        for( var n = 0; n < neighbours.length; n++  ){

            if( cell.state > neighbours[n].state && !on_boundary( neighbours[n].xind, neighbours[n].yind, boundary, boundary.length ) ){ //equal charge
                less_charge.push(neighbours[n])
            }
            // else if ( cell.state < 0 && cell.state < neighbours[n].state ){
            //     less_charge.push(neighbours[n])
            // }
        }

        if( less_charge.length == 0){
            //no change
        }
        else{

            console.log(cell.xind + " , " + cell.yind + "," + cell.state);
            console.log("found new position to move");
            console.log(less_charge);
            var swap = less_charge[Math.floor(less_charge.length*Math.random())];
            var temp = cell.state;
            cell.state = swap.state
            swap.state = temp

        }

    }

}
