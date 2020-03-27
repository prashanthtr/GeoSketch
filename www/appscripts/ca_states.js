
var cells = [];
var startState = process.argv[2].split("").map(function(r){ return parseInt(r);});
var k = 2; //2 states on or off
var r = 1; //1 neighbour to right and left
var temp = [];


// inititalize cells
for (var i = 0; i < startState.length; i++) {
    cells[i] = startState[i];
    temp[i] = 0;
}

setInterval(function(){

    console.log("State => " + cells.join("-"));
    for (var i = 0; i < cells.length; i++) {

        if( i == 0){
            prev = cells[cells.length-1]
            next = 1;

        }
        else if( i == cells.length-1){
            next = 0
            prev = cells.length-2
        }
        else {
            next = i + 1
            prev = i - 1
        }
        temp[i] = ca_rule(cells[prev], cells[i], cells[next], process.argv[3]);
    }

    for(var i = 0; i<cells.length;i++){
          cells[i] = temp[i];
    }

},250);

// the cellular automaton rules that each object uses to compute
// their states.
function ca_rule (prev, cur, next, ruleString){

    rule = ruleString.split("");
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
