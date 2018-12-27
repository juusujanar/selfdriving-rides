var app = new PIXI.Application(800, 600, {backgroundColor : 0xbbbcbf});
document.body.appendChild(app.view);

// creates the road network
const rec_len = 120;
const road_len = 40;

let y = -rec_len / 2;
let rectangle = new PIXI.Graphics();
for (let i = 0; i < 5; i++) {
    let x = -rec_len / 2;
    for (let j = 0; j < 6; j++) {
        rectangle.beginFill(0xffffff);
        rectangle.drawRect(x, y, rec_len, rec_len);
        rectangle.endFill();
        x = x + road_len + rec_len;
        app.stage.addChild(rectangle);
    }
    y = y + road_len + rec_len;
    console.log(y)
}


// create a new Sprite from an image path
var car = PIXI.Sprite.from("./car.png");


// center the sprite's anchor point
car.anchor.set(0.5);

// move the sprite to the center of the screen
car.x = app.screen.width / 2;
car.y = app.screen.height / 2;

app.stage.addChild(car);

// Listen for animate update
app.ticker.add(function(delta) {
    // just for fun, let's rotate the vroom machine a little
    // delta is 1 if running at 100% performance
    // creates frame-independent transformation
    car.rotation += 0.1 * delta;
});


