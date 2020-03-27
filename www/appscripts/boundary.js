
// bittorio cells that lies at a certain position in the grid

import {setColor} from "./utils.js"

export function bittorio ( create_rect, create_path, n ){

    return function(row, side_w, side_h ){


        var ca = {}; //cells of cellular automaton

        ca.cells = [];
        ca.perturbed = 0;
        ca.perturbCount = 0;


        for (var col = 0; col < n; col++) {

            ca.cells[col] = {}
            ca.cells[col].rect = create_rect(col, row, side_w, side_h, "#000000");
            ca.cells[col].path = create_path(col, row, side_w, side_h,  "#000000");
            //ca.cells[col].path.setAttributeNS(null,"stroke-width",0);
            ca.cells[col].row = row
            ca.cells[col].col = col

            if( Math.random() < 0.2){
                ca.cells[col].state = 1
            }
            else{
                ca.cells[col].state = 0;
            }
            setColor(ca.cells[col]);
        }


        // perturbation is a deviation from the next state of the CA.

        // Ca expects to go to a certain state based on self-organization, and
        // perturbation is a change from that state.

        // CA adjusts to that change from expected configuration - by adjusting
        // its current configuration based on self-organized dynamics.

        ca.sense = function( x,y, l, b ){

            var perturbed = 0;

            //1. get the next state
            //var nextState = ca.nextState(ca.cells.map(function(c){return c.state}));
            //console.log(nextState);

            ca.cells.map(function(ns, ind){

                if( ns.row >= x && ns.row < x+ l && ns.col >= y && ns.col < y + b){
                    //inside perturb region
                    ns.state = 0;
                    ns.rect.setAttributeNS(null, "fill", "#000000");
                    // if( ns.state == 1 ){
                    //     ns.state = 0;
                    //     ns.rect.setAttributeNS(null, "fill", "#000000");
                    // }
                    // else{
                    //     ns.state = 1;
                    //     ns.rect.setAttributeNS(null, "fill", "#ffffff");
                    // }
                }

                // if( pertOn == 1){

                //     //1. sense and indicate perturbation - before acting
                //     if ( ns != perturbRow[ind]){
                //         //console.log("perturbation")
                //         //cell.state = cells[bcell][gridn-1].state
                //         //cell.rect.setAttributeNS(null,"fill","red")
                //         ca.cells[ind].path.setAttributeNS(null, 'stroke', "#000000");
                //         ca.cells[ind].path.setAttributeNS(null, 'stroke-width', 0);
                //     }
                //     else{
                //         //no change
                //         ca.cells[ind].path.setAttributeNS(null, 'stroke', "#ff0000");
                //         ca.cells[ind].path.setAttributeNS(null, 'stroke-width', 1);
                //     }
                // }
            });
        };

        ca.nextState = function( arr , rule){

            //copy prev row
            // if( pertOn == 1){

            // }

            var new_state = [];

            //4. compute next state;
            for (var col = 0; col < n; col++) {

                var prev = col -1, next = col + 1;

                if( prev < 0 ){
                    prev  = n - 1
                }

                if( next == n ){
                    next = 0;
                }

                new_state[col] = next_state( arr[prev], arr[col], arr[next], rule );
                //setColor(ca.cells[col]);
            }

            return new_state;
        }


        ca.change_state = function( rule  ){

            var ns = ca.nextState( ca.cells.map(function(c){return c.state}), rule );
            ca.reconfigure(ns);
        }


        ca.getState = function(){
            return ca.cells.map(function(c){return c.state});
        }

        ca.reconfigure = function(perturbRow){
            for (var col = 0; col < n; col++) {
                ca.cells[col].state = perturbRow[col]
                setColor(ca.cells[col]);
            }
        }

        ca.clear = function(){
            for (var col = 0; col < n; col++) {
                ca.cells[col].path.setAttributeNS(null, 'stroke', "#ff0000");
                ca.cells[col].path.setAttributeNS(null, 'stroke-width', 1);
            }
        }

        return ca;

    }

}


function next_state (prev, cur, next, ruleString){

    //console.log(ruleString)
    var rule = ruleString.split("");
    rule = rule.map(function(r){ return parseInt(r);});

    //console.log("carule is" + rule);

    var castate = prev + "" +  cur + ""+ next;
    // console.log(castate);
    //ca rule

    var ret = -1;
    switch(castate){
    case "000": ret = rule[7]; break;
    case "001": ret = rule[6];  break;
    case "010": ret = rule[5];  break;
    case "011": ret = rule[4];  break;
    case "100": ret = rule[3]; break;
    case "101": ret = rule[2];  break;
    case "110": ret = rule[1];  break;
    case "111": ret = rule[0];  break;
    default: ret = -1; break;
    };

    // console.log("CA state" )
    // console.log("next state is " + ret);

    return ret;
}
