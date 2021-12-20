const createCanvas = (config, snake) => {
  const canvas = document.createElement('canvas')
  canvas.className = 'gamefield'
  canvas.width = config.cellsX * config.cellSize
  canvas.height = config.cellsY * config.cellSize
  const ctx = canvas.getContext('2d')
  document.body.appendChild(canvas)

  draw(ctx, config, snake)

  return [ctx]
}

const drawLines = (ctx, config) => {
  const width = config.cellsX * config.cellSize
  const height = config.cellsY * config.cellSize
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = 'gray'
  for (let i = 0; i < width; i += config.cellSize) {
    ctx.fillRect(i, 0, 1, height)
  }

  for (let i = 0; i < height; i += config.cellSize) {
    ctx.fillRect(0, i, width, 1)
  }
}

const drawSnake = (ctx, config, snake) => {
  ctx.fillStyle = 'black'
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i][0] + 2, snake[i][1] + 2, config.cellSize - 3,  config.cellSize - 3)
  }
}

const draw = (ctx, config, snake) => {
  drawLines(ctx, config)
  drawSnake(ctx, config, snake)
}

const updateSnake = (snake, {cellSize}) => {
  return [...snake.map(s => ([s[0] + cellSize, s[1]]))]
}

const initGame = ({cellSize, initialSnake}) =>  {
  const snake = new Array(initialSnake).fill(null).map((_, i) => ([0 + i * cellSize, 0]))

  return [snake]
}

const init = (config) => {
  let [snake] = initGame(config)
  const [ctx] = createCanvas(config, snake)

  let score = config.initialSnake
  intervalId = setInterval(() => {
    snake = updateSnake(snake, config)
    draw(ctx, config, snake)
  }, config.updateTime)
}


const config = {
  cellsX: 60,
  cellsY: 40,
  cellSize: 10,
  initialSnake: 5,
  updateTime: 1000
}

let intervalId

init(config, intervalId)