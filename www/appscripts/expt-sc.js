
// There are experiments with extending the structural coupling aspect of
// bittorio. The claim is that certain changes in cognitive structure can be
// explained through changes in dynamics of structural coupling.

//Given that bittorio has a style/class of structural patterns - i.e.,
//specification of rules through cellular automata, the question - how should
//the structure change so that the system maintains the same coupling relation
//with the environment.

// For this, structural coupling is described in three arrays - an array for the
// boundary, and an array for the environments (inside and outside the boundary)
// )other than the boundary.

// The range of permissible structures possible through perturbations are the
// 256 rules of the cellular automaton. At every step, the Ca simulates the new
// structural configurations, that maintain the correltation between the
// different sides of the boundary. A structure is stable when it persists for a
// more than a single time step.


var cells = [];
var startState = process.argv[2].split("").map(function(r){ return parseInt(r);});
var k = 2; //2 states on or off
var r = 1; //1 neighbour to right and left
var temp = "";

var inner = "00000000";
var outer = "11111111";
var iL = 0, iU = 1;
var oL = -1, oU = 0;

// inititalize cells
for (var i = 0; i < startState.length; i++) {
    cells[i] = startState[i];
}

var viable = [];

setInterval(function(){

    console.log("State => " + cells.join("-"));
    var prev = -1, next = -1;

    viable = [];
    temp = [];

    for(let num =0; num<256; num++){

        let binNum = num2Binary(num, 8);

        // computing the next states
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
            temp += ca_rule(cells[prev], cells[i], cells[next], binNum);
        }

        //satisfying solutions
        if(   bounds( temp, inner, iL, iU  ) && bounds( temp, outer, oL, oU)  ){
            viable.push({rule: binNum, config: temp });
        }

        temp = ""

    }

    if( viable.length > 0){
        var soln = viable[Math.floor(viable.length*Math.random())];
        temp = soln.config
        for(var i = 0; i< temp.length;i++){
            cells[i] = temp[i];
        }
    }
    else{
        var soln =  {rule: null, config: temp};
        console.log("no solution");
        // do not update the CA state
    }

    console.log("Rule: " + soln.rule + " Config: " + cells.join("-"))

},250);


// the cellular automaton rules that each object uses to compute
// their states.
function ca_rule (prev, cur, next, ruleString){

    var rule = ruleString.split("");
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
    case "100": ret = rule[4];  break;
    case "101": ret = rule[5];  break;
    case "110": ret = rule[6];  break;
    case "111": ret = rule[7];  break;
    default: ret = -1; break;
    };
    return ret;
}

function bounds( str1, str2, lower, upper ){


    var arr1 = str1.split("").map(function(v){return parseInt(v)});
    var arr2 = str2.split("").map(function(v){return parseInt(v)});

    var corr = dissimilarity( arr1, arr2);
    //console.log(corr)

    if( corr >= lower && corr < upper){
        return 1;
    }
    else{
        return 0;
    }

}


function num2Binary ( num , length ){

    var binary_str = (num).toString(2)
    var bstr = gen_ones(length-binary_str.length, "0") + binary_str;
    //console.log(bstr.slice(0,4) + "-" + bstr.slice(4,bstr.length));
    return bstr;
}

// fill remaining string with with 0s given a lenght
function gen_ones( n, fill ){

    var i = 0
    var str = ""
    while(i < n){
        str+= fill;
        i++;
    }
    return str;
}

function dissimilarity( arr1, arr2 ){

    var d = 0;
    for(var i=0; i<arr1.length; i++){
        d += Math.abs(arr1[i] - arr2[i]);
    }
    return d/arr1.length;
}
