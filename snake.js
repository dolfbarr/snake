const createCanvas = (config, snake) => {
  const canvas = document.createElement('canvas')
  canvas.className = 'gamefield'
  canvas.width = config.cellsX * config.cellSize
  canvas.height = config.cellsY * config.cellSize
  const ctx = canvas.getContext('2d')
  document.body.appendChild(canvas)

  draw(ctx, config, snake)

  return [ctx, canvas]
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

const updateSnake = (snake, { cellSize, cellsX, cellsY }, nextActions) => {
  const UP = ['ArrowUp', 'KeyW']
  const DOWN = ['ArrowDown', 'KeyS']
  const LEFT = ['ArrowLeft', 'KeyA']
  const RIGHT = ['ArrowRight', 'KeyD']

  let updatedSnake = snake
  const nextAction = nextActions[nextActions.length - 1]

  updatedSnake.shift()

  switch (true) {
    case RIGHT.includes(nextAction):
      updatedSnake.push([updatedSnake[updatedSnake.length - 1][0] + cellSize, updatedSnake[updatedSnake.length - 1][1]])
      break
    case LEFT.includes(nextAction):
      updatedSnake.push([updatedSnake[updatedSnake.length - 1][0] - cellSize, updatedSnake[updatedSnake.length - 1][1]])
      break
    case UP.includes(nextAction):
      updatedSnake.push([updatedSnake[updatedSnake.length - 1][0], updatedSnake[updatedSnake.length - 1][1] - cellSize])
      break
    case DOWN.includes(nextAction):
      updatedSnake.push([updatedSnake[updatedSnake.length - 1][0], updatedSnake[updatedSnake.length - 1][1] + cellSize])
      break
  }


  if (updatedSnake[updatedSnake.length - 1][0] >= cellsX * cellSize ) {
    return
  }
  if (updatedSnake[updatedSnake.length - 1][1] >= cellsY * cellSize) {
    return
  }
  if (updatedSnake[updatedSnake.length - 1][0] < 0 ) {
    return
  }
  if (updatedSnake[updatedSnake.length - 1][1] < 0) {
    return
  }

  if ([...new Set(updatedSnake.map(s => s[0].toString() + s[1].toString()))].length != updatedSnake.map(s => s[0].toString() + s[1].toString()).length) {
    return
  }

  return updatedSnake
}

const setKeybindings = (nextActions) =>  {
  document.addEventListener('keydown', (e) => changeDirection(e, nextActions))
}

const changeDirection = (e, nextActions) => {
  nextActions.push(e.code)
}


const stopGame =  (canvas, intervalId) => {
  canvas.style.borderColor = 'red'
  clearInterval(intervalId)
  intervalId = null
}

const initGame = ({cellSize, initialSnake}) =>  {
  const snake = new Array(initialSnake).fill(null).map((_, i) => ([0 + i * cellSize, 0]))
  const nextActions = ['ArrowRight']

  return [snake, nextActions]
}

const init = (config) => {
  let [snake, nextActions] = initGame(config)
  const [ctx, canvas] = createCanvas(config, snake)

  setKeybindings(nextActions)

  let score = config.initialSnake
  let intervalId = setInterval(function () {
    snake = updateSnake(snake, config, nextActions)
    if (snake) {
      draw(ctx, config, snake)
    } else {
      stopGame(canvas, intervalId)
    }
  }, config.updateTime)
}


const config = {
  cellsX: 60,
  cellsY: 40,
  cellSize: 10,
  initialSnake: 5,
  updateTime: 100
}


init(config)