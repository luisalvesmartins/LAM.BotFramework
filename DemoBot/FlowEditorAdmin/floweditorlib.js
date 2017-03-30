var GeoMath = {
    cross: function (linex1, liney1, linex2, liney2, rx1, ry1, rx2, ry2) {
        //vertical
        //console.log(linex1 + " " + liney1 + " " + linex2 + " " + liney2)
        //console.log(rx1 + " " + ry1  + " " + rx2 + " " + ry2)
        var a1;
        var a2;
        if (linex1 == linex2) {
            a1 = GeoMath.checkLineIntersection(linex1, liney1, linex2, liney2, rx1, ry1, rx2, ry1);
            a2 = GeoMath.checkLineIntersection(linex1, liney1, linex2, liney2, rx1, ry2, rx2, ry2);
            //console.log (a1.onLine1 + " " + a1.onLine2 + " " + a2.onLine1 +" " + a2.onLine2);
        }
        //horizontal
        if (liney1 == liney2) {
            a1 = GeoMath.checkLineIntersection(linex1, liney1, linex2, liney2, rx1, ry1, rx1, ry2);
            a2 = GeoMath.checkLineIntersection(linex1, liney1, linex2, liney2, rx2, ry1, rx2, ry2);
            //console.log (a1.onLine1 + " " + a1.onLine2 + " " + a2.onLine1 +" " + a2.onLine2);
        }
        var r = new Array();
        if (a1.onLine1 || a1.onLine2)
            r[r.length] = [a1.x, a1.y];
        if (a2.onLine1 || a2.onLine2)
            r[r.length] = [a2.x, a2.y];
        return r;
    },
    checkLineIntersection: function (line1StartX, line1StartY, line1EndX, line1EndY, line2StartX, line2StartY, line2EndX, line2EndY) {
        // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether line segment 1 or line segment 2 contain the point
        var denominator, a, b, numerator1, numerator2, result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };
        denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));
        if (denominator == 0) {
            return result;
        }
        a = line1StartY - line2StartY;
        b = line1StartX - line2StartX;
        numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
        numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        // if we cast these lines infinitely in both directions, they intersect here:
        result.x = line1StartX + (a * (line1EndX - line1StartX));
        result.y = line1StartY + (a * (line1EndY - line1StartY));
        /*
                // it is worth noting that this should be the same as:
                x = line2StartX + (b * (line2EndX - line2StartX));
                y = line2StartX + (b * (line2EndY - line2StartY));
                */
        // if line1 is a segment and line2 is infinite, they intersect if:
        if (a > 0 && a < 1) {
            result.onLine1 = true;
        }
        // if line2 is a segment and line1 is infinite, they intersect if:
        if (b > 0 && b < 1) {
            result.onLine2 = true;
        }
        // if line1 and line2 are segments, they intersect if both of the above are true
        return result;
    },
    checkRectangleIntersection: function (ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
        return ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
    },
    checkRectangleIntersectionObj: function (a, b) {
        //console.log (a.x + "<" + (b.x+b.width) + " " + (a.x+a.width) + ">" + b.x)
        //console.log (a.y + "<" + (b.y+b.height) + " " + (a.y+a.height) + ">" +  b.y);
        return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
    },
    /**
     * Calculates the intersection rectangle of two rectangles.
     * Rectangles have to intersect to work!
     *
     * @param {Object} a
     * @param {Object} b
     * @returns {Object}
     */
    rectangleIntersection: function (ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {

        return {
            'x1': Math.max(ax1, bx1),
            'y1': Math.max(ay1, by1),
            'x2': Math.min(ax2, bx2),
            'y2': Math.min(ay2, by2)
        };
    },
    /**
     * Normalizes a rectangle to ensure x1 < x2 and y1 < y2
     *
     * @param {Object} a
     * @returns {Object}
     */
    normalize: function (x1, y1, x2, y2) {
        return {
            'x1': Math.min(x1, x2),
            'y1': Math.min(y1, y2),
            'x2': Math.max(x1, x2),
            'y2': Math.max(y1, y2)
        };
    },
    rectangleLineIntersection: function (x1, y1, x2, y2, minX, minY, maxX, maxY) {
        // Completely outside.
        if ((x1 <= minX && x2 <= minX) || (y1 <= minY && y2 <= minY) || (x1 >= maxX && x2 >= maxX) || (y1 >= maxY && y2 >= maxY))
            return false;

        m = (y2 - y1) / (x2 - x1);

        y = m * (minX - x1) + y1;
        if (y > minY && y < maxY) return true;

        y = m * (maxX - x1) + y1;
        if (y > minY && y < maxY) return true;

        x = (minY - y1) / m + x1;
        if (x > minX && x < maxX) return true;

        x = (maxY - y1) / m + x1;
        if (x > minX && x < maxX) return true;

        return false;
    }
}

var CanvasHelper = {
    Text: function (ctx, x, y, w, h, text, align, lineHeight) {
        var yp = y + 14;
        switch (align) {
            case "left":
                ctx.fillText(text, x, yp);
                break;
            case "center":
                ctx.fillText(text, x + w / 2 - ctx.measureText(text).width / 2, yp);
                break;
            case "right":
                ctx.fillText(text, x + w - ctx.measureText(text).width, yp);
                break;
            case "wrap":
                CanvasHelper.wrapText(ctx, text, x + 2, yp, w - 4, h, lineHeight);
                break;
        }
    },
    wrapText: function (context, text, x, y, maxWidth, h, lineHeight) {
        var words = text.split(' ');
        var line = '';
        var maxHeight = y + h;

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                //context.fillText(line, x, y);
                context.fillText(line, (x + maxWidth) / 2 - context.measureText(line).width / 2, y);
                line = words[n] + ' ';
                y += lineHeight;
                if (y > maxHeight)
                    break;
            }
            else {
                line = testLine;
            }
        }
        context.fillText(line, (x + maxWidth) / 2 - context.measureText(line).width / 2, y);
        //context.fillText(line, x, y);
    },
    wrapTextGetHeight: function (context, text, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';
        var count = 0;

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                line = words[n] + ' ';
                count += lineHeight;
            }
            else {
                line = testLine;
            }
        }
        if (line > ' ') {
            count += lineHeight;
        }
        return count;
    },
    rect: function (context, x1, y1, x2, y2, color1, color2) {
        context.strokeStyle = color1;
        context.beginPath();
        context.moveTo(x1, y2);
        context.lineTo(x1, y1);
        context.lineTo(x2, y1);
        context.stroke();

        context.beginPath();
        context.strokeStyle = color2;
        context.moveTo(x2, y1);
        context.lineTo(x2, y2);
        context.lineTo(x1, y2);
        context.stroke();

    },
    drawArrow: function (ctx, fromx, fromy, tox, toy, color) {
        //variables to be used when creating the arrow
        var headlen = 10;

        var angle = Math.atan2(toy - fromy, tox - fromx);

        //starting path of the arrow from the start square to the end square and drawing the stroke
        ctx.beginPath();
        ctx.moveTo(fromx, fromy);
        ctx.lineTo(tox, toy);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();

        //starting a new path from the head of the arrow to one of the sides of the point
        ctx.beginPath();
        ctx.moveTo(tox, toy);
        ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

        //path from the side point of the arrow, to the other side point
        ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 7), toy - headlen * Math.sin(angle + Math.PI / 7));

        //path from the side point back to the tip of the arrow, and then again to the opposite side point
        ctx.lineTo(tox, toy);
        ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 7), toy - headlen * Math.sin(angle - Math.PI / 7));

        //draws the paths created above
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fill();
    }
}