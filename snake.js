const createCanvas = (config, snake) => {
  const canvas = document.createElement('canvas')
  canvas.className = 'gamefield'
  canvas.width = config.cellsX * config.cellSize
  canvas.height = config.cellsY * config.cellSize
  const ctx = canvas.getContext('2d')
  document.body.appendChild(canvas)

  draw(ctx, config, snake, [-Infinity, -Infinity])

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

const drawSnake = (ctx, {cellSize}, snake) => {
  ctx.fillStyle = 'black'
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i][0] + 2, snake[i][1] + 2, cellSize - 3,  cellSize - 3)
  }
}

const drawFood = (ctx, {cellSize}, food) => {
  ctx.fillStyle = 'green'
  ctx.fillRect(food[0] + 2, food[1] + 2, cellSize - 3,  cellSize - 3)
}

const draw = (ctx, config, snake, food) => {
  drawLines(ctx, config)
  drawSnake(ctx, config, snake)
  drawFood(ctx, config, food)
}

const updateSnake = (snake, { cellSize, cellsX, cellsY }, nextActions, food) => {
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

  if (updatedSnake.map(s => s[0].toString() + s[1].toString()).includes(food[0].toString() + food[1].toString())) {
    updatedSnake.unshift(food)
  }

  return updatedSnake
}

const setKeybindings = (nextActions) =>  {
  document.addEventListener('keydown', (e) => changeDirection(e, nextActions))
}

const changeDirection = (e, nextActions) => {
  nextActions.push(e.code)
}

const spawnFood = (ctx, config, snake) => {
  const FOOD_X = Math.floor(Math.random() * (config.cellsX))
  const FOOD_Y = Math.floor(Math.random() * (config.cellsY))
  const food = [FOOD_X * config.cellSize, FOOD_Y * config.cellSize]
  drawFood(ctx, config, food)

  return [food]
}

const stopGame =  (canvas, intervalId, snake, config) => {
  canvas.style.borderColor = snake.length - 1 === config.cellsX * config.cellsY ? 'green' : 'red'
  clearInterval(intervalId)
  intervalId = null
  console.info('Snake length: ' + snake.length)
}

const initGame = ({cellSize, initialSnake}) =>  {
  const snake = new Array(initialSnake).fill(null).map((_, i) => ([0 + i * cellSize, 0]))
  const nextActions = ['ArrowRight']

  return [snake, nextActions]
}

const init = (config) => {
  let [snake, nextActions] = initGame(config)
  const [ctx, canvas] = createCanvas(config, snake)

  let [food] = spawnFood(ctx, config, snake)

  setKeybindings(nextActions)

  let score = config.initialSnake
  let intervalId = setInterval(function () {
    let oldSnakeLength = snake.length
    const newSnake = updateSnake(snake, config, nextActions, food)
    if (newSnake) {
      draw(ctx, config, newSnake, food)

      if (newSnake.length != oldSnakeLength) {
        let [newFood] = spawnFood(ctx, config, newSnake)
        food = newFood
        snake = newSnake
        score++
      }
    } else {
      stopGame(canvas, intervalId, snake, config)
    }
  }, config.updateTime)
}


const config = {
  cellsX: 30,
  cellsY: 20,
  cellSize: 30,
  initialSnake: 4,
  updateTime: 300
}


init(config)