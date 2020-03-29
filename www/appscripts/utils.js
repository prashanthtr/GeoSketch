

var svgns = "http://www.w3.org/2000/svg";
var canvas = document.getElementById( 'svgCanvas' );

//mapping from position to screen coordinates
//needs the svg context for height and width

export function create_rectangle(x,y,width,height,fill){
        // Grid is 100 by 100

        var rect = document.createElementNS(svgns, 'rect');
        rect.setAttributeNS(null, 'x', x);
        rect.setAttributeNS(null, 'y', y);
        rect.setAttributeNS(null, 'height', height);
        rect.setAttributeNS(null, 'width', width);
        rect.setAttributeNS(null, 'fill', fill);
        rect.state = 0;
        canvas.appendChild(rect);
        return rect;
}

export function create_path_fn(scale_x, scale_y, canvas){

    return function(x,y,width , height, fill){
            // Grid is 100 by 100

        var xpos = x*scale_x
        var ypos = y*scale_y;
        //rectangle border
        var pathstring = "M" + xpos + " " + ypos + " L" + (xpos+width) + " " + ypos + " L" + (xpos+width) + " " + (ypos+height) + " L" + xpos + " " + (ypos+height) + " L" + xpos + " " + ypos ;
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

//checks if cell within boundary
export function within_boundary(  xind, yind, n ){

    var min = n/2-2;
    var max = n/2+2;

    if( xind > min  && xind < max &&  yind > min && yind < max  ){
        return 1;
    }
    else{
        return 0;
    }
}

export function on_boundary( x, y , boundary ){

    var on_boundary = 0;
    for(var i = 0; i <boundary.length; i++){
        var bx = boundary[i].xind
        var by = boundary[i].yind

        if( Math.abs( x - bx ) == 0 && Math.abs( y - by ) == 0 ){
            on_boundary = 1;
        }
    }
    return on_boundary;
}


export function find_boundary_el(x,y, boundary){

    var pos = -1;
    for(var i = 0; i <boundary.length; i++){
        if( x == boundary[i].xind && y == boundary[i].yind){
            pos = i;
            break;
        }
    }
    return pos;
}


export function setColor( cell, args ){

    if( args!= null){
        cell.rect.setAttributeNS(null,"fill",args)
    }
    else if(cell.state == 0){
        cell.rect.setAttributeNS(null,"fill","#ffffff")
    }
    else{
        cell.rect.setAttributeNS(null,"fill","#00a7be")
        cell.rect.setAttributeNS(null,"fill-opacity",0.5)
    }
}
