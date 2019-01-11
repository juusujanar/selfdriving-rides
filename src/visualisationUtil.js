import * as PIXI from "pixi.js";

function calcRectSize(canvasWidthOrHeight, columnOrRowCount, roadSize) {
    const unused = canvasWidthOrHeight - columnOrRowCount * roadSize;
    return unused / columnOrRowCount;
}


function drawVerticalLines(x, y, rectWidth, rectHeight, roadWidth,
                           lineWidth, lineLength, missingLineLength) {
    const xLine = x + rectWidth + roadWidth / 2 - lineWidth / 2;
    const linesCount = Math.floor(rectHeight / (lineLength + missingLineLength));
    const linesLength = linesCount * lineLength + (linesCount - 1) * missingLineLength;
    const linesEdgeFromCrossing = (rectHeight - linesLength) / 2;

    // drawing lines and increasing its y position
    let currentY = y + linesEdgeFromCrossing;
    const rectangle = new PIXI.Graphics();
    for (let i = 0; i < linesCount; i++) {
        rectangle.beginFill(lineColorOnRoad);
        rectangle.drawRect(xLine, currentY, lineWidth, lineLength);
        rectangle.endFill();
        app.stage.addChild(rectangle);
        currentY += lineLength + missingLineLength;
    }
}

function drawHorizontalLines(x, y, rectWidth, rectHeight, roadHeight,
                             lineWidth, lineLength, missingLineLength) {
    const yLine = y + rectHeight + roadHeight / 2 - lineWidth / 2;
    const linesCount = Math.floor(rectWidth / (lineLength + missingLineLength));
    const linesLength = linesCount * lineLength + (linesCount - 1) * missingLineLength;
    const linesEdgeFromCrossing = (rectWidth - linesLength) / 2;

    // drawing lines and increasing its y position
    let currentX = x + linesEdgeFromCrossing;
    const rectangle = new PIXI.Graphics();
    for (let i = 0; i < linesCount; i++) {
        rectangle.beginFill(lineColorOnRoad);
        rectangle.drawRect(currentX, yLine, lineLength, lineWidth);
        rectangle.endFill();
        app.stage.addChild(rectangle);
        currentX += lineLength + missingLineLength;
    }
}


export function drawRoads(app, RESOLUTION_X, RESOLUTION_Y, rowCount, columnCount, maxColumnCount, maxRowCount) {
    console.log("here");
    // if you want to play with road/rectangle sizes then just adjust roadWidth and roadHeight
    const roadWidth = 60 + 5 * (maxColumnCount - columnCount - 1);
    const roadHeight = 60 + 5 * (maxRowCount - rowCount - 1);
    // making the roadHeight and roadWidth equal to the smaller value of them
    const roadSize = Math.min(roadWidth, roadHeight);

    const rectWidth = calcRectSize(RESOLUTION_X, columnCount, roadSize);
    const rectHeight = calcRectSize(RESOLUTION_Y, rowCount, roadSize);

    let y = -rectHeight / 2;
    const rectangle = new PIXI.Graphics();

    // drawing rows
    for (let i = 0; i < rowCount + 1; i++) {
        let x = -rectWidth / 2;
        // drawing columns
        for (let j = 0; j < columnCount + 1; j++) {
            rectangle.beginFill(rectangleColor);
            rectangle.drawRect(x, y, rectWidth, rectHeight);
            rectangle.endFill();
            app.stage.addChild(rectangle);
            // drawing road lines between two rectangles. (it prolly is faster outside of loop)
            drawVerticalLines(x, y, rectWidth, rectHeight, roadSize, 2, 10, 10);
            drawHorizontalLines(x, y, rectWidth, rectHeight, roadSize, 2, 10, 10);
            // changing x ready for another rectangle
            x = x + roadSize + rectWidth;
        }
        y = y + roadSize + rectHeight;
    }
}