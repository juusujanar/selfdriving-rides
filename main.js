var app = new PIXI.Application(800, 600, {backgroundColor : 0x1099bb});
document.body.appendChild(app.view);

// create a new Sprite from an image path
var car = PIXI.Sprite.from("./car.png")

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
