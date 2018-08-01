var canvas = $('#puzzlewidgetcanvas');
var context = null; 

var cx = 160; cy = 134;

function showwidgetattributes(attributes) {

    

    if (isie8) {
        showwidgetattributesie8(attributes);
        return;
    }

    
    context = canvas.get(0).getContext('2d');
    context.clearRect(0, 0, 307, 307);
    $('#widgetattributes').html('');

    var pival = 3.1415926;
    var pistep = pival / 7;
    var pistart = pival + pistep * 5 + pistep * 1;

    var outerradius = 60;
    var innerradius = 20;

    var pi = pistart;

    for (var i = 0; i < attributes.length; i++) {

        var ord = getord(pi);

        var x1 = Math.sin(pi) * (outerradius + ord) + cx;
        var y1 = Math.cos(pi) * (outerradius + ord) + cy;

        var x2 = Math.sin(pi) * (((outerradius + ord) - innerradius) / 2 + innerradius) + cx;
        var y2 = Math.cos(pi) * (((outerradius + ord) - innerradius) / 2 + innerradius) + cy - 10;

        var x3 = Math.sin(pi) * innerradius + cx;
        var y3 = Math.cos(pi) * innerradius + cy;

        drawarrow(x1, y1, x2, y2, x3, y3);

        //attributes[i].name 
        $('#widgetattributes').append('<div id="attr' + i + '" class="resultdim" style="color: #ff5500; top: 0px; left: 0px; display: none; font-size: ' + parseFloat(18 * attributes[i].percent) + 'pt"><nobr>' + attributes[i].name + '</nobr></div>');
        var label = $('#attr' + i);

        var temph = label.height();
        var tempw = label.width();

        pi -= pistep;
    }


    setTimeout(function () {
        
        pi = pistart;
        for (var i = 0; i < attributes.length; i++) {

            var ord = getord(pi);
            var align = getalign(pi);

            var x1 = Math.sin(pi) * (outerradius + ord) + cx;
            var y1 = Math.cos(pi) * (outerradius + ord) + cy;

            var x2 = Math.sin(pi) * (((outerradius + ord) - innerradius) / 2 + innerradius) + cx;
            var y2 = Math.cos(pi) * (((outerradius + ord) - innerradius) / 2 + innerradius) + cy - 10;

            var x3 = Math.sin(pi) * innerradius + cx;
            var y3 = Math.cos(pi) * innerradius + cy;

            var label = $('#attr' + i);

            var labelx;
            var labely = y1 - parseFloat(label.height()) / 2;
            var labelxoffset = 0;


            if (align == 0) {
                labelx = x1 - parseFloat(label.width());
                if (labelx < 5) {
                    labelxoffset = 5 - labelx;
                }
            }
            else if (align == 1) {
                labelx = x1 - parseFloat(label.width()) / 2;
                labely = y1 - parseFloat(label.height());
            }
            else if (align == 2) {
                labelx = x1;
                if (label > (307 - 5) - parseFloat(label.width())) {
                    labelxoffset = ((307 - 5) - parseFloat(label.width())) - labelx;
                }
            }

            

            label.css('left', labelx + labelxoffset);
            label.css('top', labely);

            label.show();

            pi -= pistep;
        }
    }, 500);

    //canvas.css('height', 153.5);
}

function getord(pi) {
    var ord = 0;

    if (pi < 4.4 && pi > 2.2) {
        ord = 10;
    }
    if (pi < 4 && pi > 2.6) {
        ord = 20;
    }
    if (pi < 3.5 && pi > 3) {
        ord = 30;
    }
    if (pi > 5.5) {
        ord = 15;
    }
    

    return ord;
}

function getalign(pi) {
    var align = 0;
    if (pi < 3.5 && pi > 3) {
        ord = 40;
        align = 1;
    }
    if (pi < 3) {
        align = 2;
    }
    return align;
}

function widgetattributename(d, v) {

    switch (d + '_' + v) {
        case 'Attitude_Extravert':
            return v;
        case 'Attitude_Introvert':
            return v;
        case 'Information_Imagination':
            return 'Imaginative';
        case 'Information_Facts':
            return 'Fact seeker';
        case 'Evidence_Uncertainty':
            return 'Abstract thinker';
        case 'Evidence_Facts':
            return 'Fact verifier';
        case 'Process or Result_Process':
            return 'Process driven';
        case 'Process or Result_Result':
            return 'Result driven';
        default:
            return v;
    }
}

function drawarrow(x1, y1, x2, y2, x3, y3) {

    
    context.beginPath();
    context.moveTo(x1, y1);
    context.quadraticCurveTo(x2, y2, x3, y3);
    context.lineWidth = 0.5;
    context.lineCap = 'round';
    // line color
    context.strokeStyle = 'rgba(0,0,0, 0.2)';
    context.stroke();

}