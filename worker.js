function idx(x, y, width) {
  return y * (width * 4) + x * 4;
}
onmessage = e => {
    var pixels = e.data.pixels;
    var width = e.data.width;
    var height = e.data.height;
    var digits = e.data.digits;
    var digitWidth = e.data.digitWidth;
    var digitHeight = e.data.digitHeight;
    var gridWidth = 12;
    var gridHeight = 14;
    var offsetX = digitWidth > 12 ? 4 : 2;
    var offsetY = digitHeight > 14 ? 4 : 2;
    var digitsFound = [];
    var results = [];
    for (var y = offsetY; y < height - digitHeight; y = y + gridHeight) {
        for (var x = offsetX; x < width - digitWidth; x = x + gridWidth) {
            for (var i = 0; i < digits.length; i++) {
                var digitpx = digits[i];
                var found = true;
                var foundInv = true;
                compare:
                for (var xx = 0; xx < digitWidth; xx++) {
                    for (var yy = 0; yy < digitHeight; yy++) {
                        found = found && pixels[idx(x + xx, y + yy, width)] == digitpx[idx(xx, yy, digitWidth)];
                        foundInv = foundInv && pixels[idx(x + xx, y + yy, width)] == 255 - digitpx[idx(xx, yy, digitWidth)];
                        if (!found && !foundInv)
                            break compare;
                    }
                }
                if (found || foundInv) {
                    digitsFound.push({x, y, i});
                    break;
                }
            }
        }
    }
    for (var i = 0; i < digitsFound.length - 2; i++) {
        if (digitsFound[i].x == digitsFound[i + 1].x - digitWidth * 4 / 3
         && digitsFound[i].x == digitsFound[i + 2].x - digitWidth * 8 / 3
         && digitsFound[i].y == digitsFound[i + 1].y
         && digitsFound[i].y == digitsFound[i + 2].y)
            results.push({
                x: digitsFound[i].x,
                y: digitsFound[i].y,
                w: digitWidth * 3 + 9,
                h: digitHeight,
                n: digitsFound[i].i * 100 + digitsFound[i + 1].i * 10 + digitsFound[i + 2].i
            });
    }
    postMessage(results);
};
