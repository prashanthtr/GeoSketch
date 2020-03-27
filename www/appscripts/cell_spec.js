
//trying to find acombination of rules that leads to active transport ofions
//inside and outisde the membrane

import {on_boundary,within_boundary,find_boundary_el} from "./utils.js"

//input: x,y, max number of cells,
// -1 is length-1 : grid wraps around
// length+1 is 0 : grid wraps around


// description for the cells (ions, boundary cells, ions interior to the cell)
export function create_cell(x, y, type){

    var cell = {}

    cell.state = 0; // on or off (0 or 1)
    //cell.color = "black" //off

    //at any one time, more than 1 cell can be active (assumption) - there will
    //be a competition for action.

    cell.xind = x
    cell.yind = y

    cell.update_rule = type=="boundary"?ca_rule:ion_rule;

    cell.adjacent = []
    cell.adjacent_states = []

    cell.int_env = [];
    cell.ext_env = [];

    cell.rect = { state: 0}

    cell.assign_adj_cell = function(boundary, env, maxX, maxY){

        var x = cell.xind
        var y =  cell.yind
        var adjacent = [ [x-1,y-1], [x-1,y], [x-1, y+1], [x, y-1], [x,y+1], [x+1,y-1], [x+1,y], [x+1,y+1] ]

        adjacent.map(function(a){

            if(on_boundary(a[0],a[1],boundary)){
                // on boundary

                //external cells of the boundary are adjacent to the charges
                var bind = find_boundary_el(a[0],a[1],boundary)
                cell.adjacent.push(boundary[bind]);
                //cell.adjacent_to_boundary.push(boundary[bind].ext_env);
            }
            else if(within_boundary(a[0],a[1])){
                cell.adjacent.push(env[a[0]][a[1]]);
            }
            else{

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
                if( a[0] < 0 ){
                    yind  = maxY - 1
                }
                else if( a[0] == maxY){
                    yind = 0
                }
                else{
                    yind = a[0]
                }

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


        if ( on_boundary( cell.xpos, cell.ypos, boundary ) == 1  ){
            current_neighbours = current_neighbours.concat(cell.adjacent);
            //console.log(current_neighbours);
        }
        else if ( within_boundary( cell.xpos, cell.ypos, 20) == 1 ){

            //computation happesn only when any of the adjacent neighbours are 1

            //current_neighbours = current_neighbours.concat(cell.adjacent);
            //dynamically construct neighbour for ion exchange based on open
            //channel
            for(var i=0; i<cell.adjacent.length;i++){
                if( on_boundary(cell.adjacent[i].xpos, cell.adjacent[i].ypos, boundary ) && cell.adjacent[i].state == 1){
                    //common neighbours
                    var nn = new_neighbours(cell.adjacent, cell.adjacent[i].adjacent);
                    //var adj_adj = cell.adjacent[i].adjacent;
                    //only copy those cells are commonly adjacent
                    // for(var j = 0; j < cell.adjacent.length;j++){
                    //     for(var k=0; k<adj_adj.length; k++){
                    //         if( cell.adjacent[j].xind == adj_adj[k].xind &&
                    //             cell.adjacent[j].yind == adj_adj[k].yind
                    //           ){

                    //         }
                    //     }
                    // }
                    current_neighbours = current_neighbours.concat(nn);
                    //add neighbours adjacent boundary cells that are 1
                }
                else if( within_boundary( cell.adjacent[i].xpos, cell.adjacent[i].ypos, 20  ) == 1 ){
                    current_neighbours.push(cell.adjacent[i]);
                }
            }
        }
        else{

            //proabably neighbour rule for boudnary rule
            current_neighbours = current_neighbours.concat(cell.adjacent);
        }

        //console.log(current_neighbours)
        //need to rule to say interior cell computes only when any of the adjacent boundary elements is on
        //cell.state =
        return cell.update_rule(cell.state, current_neighbours, boundary);
        // ion change rule that determines next state
    }
    return cell;
}

function new_neighbours(adjacent, adj_adjacent){

    var temp = [];
    for( var i=0; i< adj_adjacent.length; i++ ){
        var adj_adj = adj_adjacent[i];
        var bool = 0

        for(var j=0; j<adjacent.length;j++){
            if( adj_adj.xpos == adjacent[j].xpos && adj_adj.ypos == adjacent[j].ypos ){
                bool = 1;
            }
        }
        if(bool == 0){
            temp.push(adj_adj);

        }
    }
    return temp;
}


// Ca rule takes in a bunch of cells adjacent to the boundary cell - and gives
// different weights to adjacent cells on the boundary, and cells outside,
// andinterior to the boundary.

function ca_rule ( state, neighbours, boundary){

    var threshold = 2;
    var w_b = 2, w_ions = 1; // 1 positive cell, and a net positive charge around (inside and outisde

    var sum = w_b*this.state;

    for(var i =0; i<neighbours.length;i++){

        if( on_boundary(neighbours[i].xind, neighbours[i].yind, boundary ) == 1){
            console.log(neighbours[i])
            sum += w_b*neighbours[i].state
        }
        else{
            sum += w_ions*neighbours[i].state
        }
    }

    //console.log(neighbours);
    console.log(sum)
    // if( sum >= threshold){
    //     return 1; //actiuve
    // }
    // else{
    //     return 0;
    // }

    //homeostatic rule

    // If the cell wall is positively charged, and the sum/distribution of the
    // charges inside and outside the cell is greater than a threshold of
    // difference

    // tHe cell wall is actively conducting ions/supoorting ion exchange as long
    // as the net

    // the system stops conducting ions once there is too much of one kind of
    // charge around it in the environment.

    // the system starts conducting from a non conducting state, when there is a
    // gradient of charge distribution around the cell.

    // The difference is greater than 1.5 times the threshold, there is a
    // greater distribution of positive charges on one side of the cell.
    //

    if( this.state == 1 && sum >= 2*threshold){
        return 0; // conducting state leads to a concentrationg of positive
                  //charges beyond threshold - so cell stops conducting
    }
    else if( this.state == 0 && sum <= -2*threshold){
        return 1; //non conducting state leads to a concentrationg of negative
                  //charges so cell starts conducting
    }
    else if( this.state == 1 && sum <= -threshold){
        return 0; //conducting state leads to a concentrationg of negative
                  //charges so cell stops conducting
    }
    else if (this.state == 0 && sum >= threshold  ){
        return 1;  //non-conducting state leads to a concentrationg of negative
                  //charges - so the cell starts conducting
    }
    else{
        return this.state; //cell has not lead to any concentration of charges,
                           //and is maintaining the distribtuion.
    }

}

//
function ion_rule (state, neighbours, boundary ){

    var threshold = 3; // each charged particle has to be sorrounded by a net charge that is 1 unit or more in the opposite direction.
    var w_b = 0, w_ions = 1;

    var sum = w_b*this.state;

    for(var i =0; i<neighbours.length;i++){

        if( on_boundary(neighbours[i].xind, neighbours[i].yind, boundary ) ){
            sum += w_b*neighbours[i].state
        }
        else{
            sum += w_ions*neighbours[i].state
        }
    }


    if( this.state == 1 && sum <= -threshold){
        return -1; //actiuve
    }
    else if (this.state == -1 && sum >= threshold  ){
        return 1
    }
    else{
        return this.state;
    }
}
