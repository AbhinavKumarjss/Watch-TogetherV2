enum Color{
    RED = 'red',
    BLUE = 'blue',
    GREEN = 'green',
    YELLOW = 'yellow',
    ORANGE = 'orange',
    PURPLE = 'purple',
    PINK = 'pink',
}

function pickRandomColor(): Color{
    const colors = Object.values(Color);
    return colors[Math.floor(Math.random() * colors.length)];
}
export {Color, pickRandomColor};