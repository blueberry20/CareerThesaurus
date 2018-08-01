function showwidgetattributesie8(attributes) {
    
    $('#widgetattributes').html('');

    var pival = 3.1415926;
    var pistep = pival / 7;
    var pistart = pival + pistep * 4 + pistep * 1;

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

        $('#widgetattributes').append('<div id="attr' + i + '" class="resultdim" style="color: #000000; background-color: #ffffdd; padding: 2px; top: 0px; left: 0px; display: none; font-size: ' + parseFloat(17 * attributes[i].percent) + 'pt"><nobr>' + attributes[i].name + '</nobr></div>');
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

    
}