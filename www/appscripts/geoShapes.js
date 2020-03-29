

var svgns = "http://www.w3.org/2000/svg";
var canvas = document.getElementById( 'svgCanvas' );

export function create_rect_fn(scale_x, scale_y, canvas){

    return function(x,y, l  , b, stroke, fill){

        //console.log(x + " " + y)
        if( x > 0 && y >0){

            var rect = {}
            rect = document.createElementNS(svgns, 'path');
            var pathstring = "M" + x + " " + y + " L" + (x+l) + " " + y + " L" + (x+l) + " " + (y+b) + " L" + x + " " + (y+b) + " L" + x + " " + y ;
            rect.setAttributeNS(null,"d", pathstring);
            rect.setAttributeNS(null, 'stroke', stroke);
            rect.setAttributeNS(null, 'fill', fill);
            rect.setAttributeNS(null, 'fill-opacity', 0);
            rect.coords = [
                x,
                y,
                x+l,
                y+b
            ]
            canvas.appendChild(rect);
            return rect;
        }
    }
}

export function create_parallelogram_fn(scale_x, scale_y, canvas){

    return function(x,y, l  , b, angle, stroke, fill){

        //console.log(x + " " + y)
        if( x > 0 && y >0){

            var rect = {}
            rect = document.createElementNS(svgns, 'path');

            var p3x = Math.abs(l*Math.cos(2*Math.PI/3)) //60
            var p3y = Math.abs(b*Math.sin(2*Math.PI/3))
            var pathstring = "M" + x + " " + y + " L" + (x+l) + " " + y + " L" + (x+p3x) + " " + (y+p3y) + " L" + (x-p3x) + " " + (y+p3y) + " L" + x + " " + y ;
            rect.setAttributeNS(null,"d", pathstring);
            rect.setAttributeNS(null, 'stroke', stroke);
            rect.setAttributeNS(null, 'fill', fill);
            rect.setAttributeNS(null, 'fill-opacity', 0);

            rect.coords = [
                x-p3x,
                y,
                x+l,
                y+p3y
            ];
            canvas.appendChild(rect);
            return rect;
        }
    }

}

// export function create_rect_fn(scale_x, scale_y, canvas){

//     //returns an object
//     return function(x,y, w  , h, fill){
//         // Grid is 100 by 100

//         var rect = {}
//         rect.xpos = x*scale_x
//         rect.ypos = y*scale_y;
//         rect.width = w*scale_x
//         rect.height = h*scale_y

//         rect.createPathString = function(x,y,l,b){

//             var pathstring = "M" + x + " " + y + " L" + (x+l) + " " + y + " L" + (x+l) + " " + (y+b) + " L" + x + " " + (y+b) + " L" + x + " " + y ;
//             return pathstring
//         }

//         // THis is absolute cooridnate on teh screen
//         rect.updateCoordinates = function(x,y){
//             this.xpos = x;
//             this.ypos = y;
//         }

//         rect.updatePathString = function(){
//             var path = rect.createPathString();
//             rect.path.setAttributeNS(null,"d", path);
//         }

//         rect.path = document.createElementNS(svgns, 'path');
//         rect.path.setAttributeNS(null, 'stroke', fill);
//         rect.path.setAttributeNS(null, 'fill', "none");
//         rect.updatePathString();
//         canvas.appendChild(rect.path);
//         return rect;
//     }
// }

// export function create_rect_fn(scale_x, scale_y, canvas){

//     return function(x,y, w  , h, fill){
//             // Grid is 100 by 100

//         var path = {};
//         var xpos = x*scale_x
//         var ypos = y*scale_y;
//         var width = w*scale_x
//         var height = h*scale_y

//         //rectangle border
//         var path = document.createElementNS(svgns, 'path');

//         path.x = xpos
//         path.y = ypos
//         path.l = width
//         path.b = height

//         var pathstring = rect_path(xpos, ypos, width, height)
//         path.setAttributeNS(null,"d", pathstring);
//         path.setAttributeNS(null, 'stroke', fill);
//         path.setAttributeNS(null, 'fill', "none");
//         canvas.appendChild(path);
//         return path;
//     }
// }


// export function create_rhombus_fn(scale_x, scale_y, canvas){

//     return function( x, y, width , height, angle, fill){
//             // Grid is 100 by 100

//         var xpos = x*scale_x
//         var ypos = y*scale_y;

//         var p3x = Math.abs(width*Math.cos(2*Math.PI/3))
//         var p3y = Math.abs(height*Math.sin(2*Math.PI/3))

//         //rectangle border
//         var pathstring = "M" + xpos + " " + ypos + " L" + (xpos+width) + " " + ypos + " L" + (xpos+p3x) + " " + (ypos+p3y) + " L" + (xpos-p3x) + " " + (ypos+p3y) + " L" + xpos + " " + ypos ;
//         var path = document.createElementNS(svgns, 'path');
//         path.setAttributeNS(null,"d", pathstring);
//         path.setAttributeNS(null, 'stroke', fill);
//         path.setAttributeNS(null, 'fill', "none");
//         canvas.appendChild(path);
//         return path;
//     }
// }


export function create_quad_fn(scale_x, scale_y, canvas){

    return function( x, y, width , height, angle, fill){
            // Grid is 100 by 100

        var xpos = x*scale_x
        var ypos = y*scale_y;

        var p3x = Math.abs(width*Math.cos(2*Math.PI/3))
        var p3y = Math.abs(height*Math.sin(2*Math.PI/3))

        //rectangle border
        var pathstring = "M" + xpos + " " + ypos + " L" + (xpos+width) + " " + ypos + " L" + (xpos+p3x) + " " + (ypos+p3y) + " L" + (xpos-p3x) + " " + (ypos+p3y) + " L" + xpos + " " + ypos ;
        var path = document.createElementNS(svgns, 'path');
        path.setAttributeNS(null,"d", pathstring);
        path.setAttributeNS(null, 'stroke', fill);
        path.setAttributeNS(null, 'fill', "none");
        canvas.appendChild(path);
        return path;
    }
}


export function setNewpath ( path, xpos, ypos, width, height ){

    var pathstring = "M" + xpos + " " + ypos + " L" + (xpos+width) + " " + ypos + " L" + (xpos+width) + " " + (ypos+height) + " L" + xpos + " " + (ypos+height) + " L" + xpos + " " + ypos ;
    path.setAttributeNS(null,"d", pathstring);

}
