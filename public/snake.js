// Methods
const adjust = n => f => xs => mapi(x => i => i == n ? f(x) : x)(xs)
const dropFirst = xs => xs.slice(1)
const dropLast = xs => xs.slice(0, xs.length - 1)
const id = x => x
const k = x => y => x
const map = f => xs => xs.map(f)
const mapi = f => xs => xs.map((x, i) => f(x)(i))
const merge = o1 => o2 => Object.assign({}, o1, o2)
const mod = x => y => ((y % x) + x) % x
const objOf = k => v => ({ [k]: v })
const pipe = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)
const prop = k => o => o[k]
const range = n => m => Array.apply(null, Array(m - n)).map((_, i) => n + i)
const rep = c => n => map(k(c))(range(0)(n))
const rnd = min => max => Math.floor(Math.random() * max) + min
const spec = o => x => Object.keys(o)
  .map(k => objOf(k)(o[k](x)))
  .reduce((acc, o) => Object.assign(acc, o))

// Constants
const canvas = document.getElementById('gamecanvas')
const ctx = canvas.getContext('2d')
const UP = { x: 0, y: -1 }
const DOWN = { x: 0, y: 1 }
const RIGHT = { x: 1, y: 0 }
const LEFT = { x: -1, y: 0 }
resize();
var notChrashed = true;
var snakeLength = 0;
var gameStarted = false;

//SnakeGameMain
function snakeMain() {
  // Point operations
  const pointEq = p1 => p2 => p1.x == p2.x && p1.y == p2.y

  // Booleans
  const willEat = state => {
    if(pointEq(nextHead(state))(state.apple)){
      snakeLength++; console.info("Snake Length: " + snakeLength);}
      return pointEq(nextHead(state))(state.apple);}
  const willCrash = state => {
    if (state.snake.find(pointEq(nextHead(state))) || nextHead(state).x >= state.cols - 1 || nextHead(state).x < 1 || nextHead(state).y >= state.rows - 1 || nextHead(state).y < 1) {
      document.querySelector('.background').style.display = "flex"; notChrashed = false; console.info("willCrash"); submitScore();return true;
    }
    console.info("willNotCrash"); return false;
  }
  const validMove = move => state =>
    state.moves[0].x + move.x != 0 || state.moves[0].y + move.y != 0

  // Next values based on state
  const nextMoves = state => state.moves.length > 1 ? dropFirst(state.moves) : state.moves
  const nextApple = state => willEat(state) ? rndPos(state) : state.apple
  const nextHead = state => state.snake.length == 0
    ? { x: 10, y: 10 }
    : {
      x: mod(state.cols)(state.snake[0].x + state.moves[0].x),
      y: mod(state.rows)(state.snake[0].y + state.moves[0].y)
    }
  const nextSnake = state => willCrash(state)
    ? []
    : (willEat(state)
      ? [nextHead(state)].concat(state.snake)
      : [nextHead(state)].concat(dropLast(state.snake)))

  // Randomness
  const rndPos = table => ({
    x: rnd(1)(table.cols - 2),
    y: rnd(1)(table.rows - 2)
  })

  // Initial state
  const initialState = () => ({
    cols: 30,
    rows: 20,
    moves: [RIGHT],
    snake: [],
    apple: { x: 16, y: 2 },
  })

  const next = spec({
    rows: prop('rows'),
    cols: prop('cols'),
    moves: nextMoves,
    snake: nextSnake,
    apple: nextApple
  })

  const enqueue = (state, move) => validMove(move)(state)
    ? merge(state)({ moves: state.moves.concat([move]) })
    : state

  // Mutable state
  let state = initialState()

  // Position helpers
  const x = c => Math.round(c * canvas.width / state.cols)
  const y = r => Math.round(r * canvas.height / state.rows)

  // Game loop draw
  const draw = () => {
    // clear
    ctx.fillStyle = '#232323'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // draw snake
    ctx.fillStyle = 'rgb(150,0,255)'
    state.snake.map(p => ctx.fillRect(x(p.x), y(p.y), x(1), y(1)))

    // draw apples
    ctx.fillStyle = 'rgb(0,255,0)'
    ctx.fillRect(x(state.apple.x), y(state.apple.y), x(1), y(1))

    // add crash
    if (state.snake.length == 0) {
      ctx.fillStyle = 'rgb(255,0,0)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    //draw borders
    ctx.fillStyle = 'rgb(128,128,128)'
    ctx.fillRect(0, 0, x(1), canvas.height)
    ctx.fillRect(0, 0, canvas.width, x(1))
    ctx.fillRect(canvas.width - x(1), 0, canvas.width, canvas.height)
    ctx.fillRect(0, canvas.height - x(1), canvas.width, canvas.height)
  }

  // Game loop update
  const step = t1 => t2 => {
    if ((t2 - t1 > 125) && notChrashed) {
      state = next(state)
      document.getElementById("gamepoints").innerHTML = "Points: " + (snakeLength/2);
      draw()
      window.requestAnimationFrame(step(t2))
    }else{
      window.requestAnimationFrame(step(t1))
    }
  }

  // Key events
  window.addEventListener('keydown', e => {
    switch (e.key) {
      case 'w': case 'ArrowUp': state = enqueue(state, UP); break;
      case 'a': case 'ArrowLeft': state = enqueue(state, LEFT); break;
      case 's': case 'ArrowDown': state = enqueue(state, DOWN); break;
      case 'd': case 'ArrowRight': state = enqueue(state, RIGHT); break;
    }
  })

  draw();
  window.requestAnimationFrame(step(0))
}

// Run Main
ctx.fillStyle = 'rgb(128,128,128)'
ctx.fillRect(0, 0, canvas.width, canvas.height)
document.getElementById("gamestart").addEventListener("click", function () {
  console.info("ButtonPressed")
  if(!gameStarted){
    snakeMain();
    gameStarted = true;
  }
});


// Submit Score to Server
function submitScore () {
  const xhttp = new XMLHttpRequest();
  document.getElementById("highscoreButton").addEventListener("click", function () {
    console.info("Score=" + snakeLength/2);
    xhttp.open("POST", "saveScore", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
    xhttp.send("Score=" + (snakeLength/2) + "&uname=" + document.getElementById("NICE").innerHTML);
  });
}

// resize the gamecanvas
function resize() {

  var canvas = document.getElementById('gamecanvas');
  var canvasRatio = canvas.height / canvas.width;
  var windowRatio = window.innerHeight / window.innerWidth;
  var width;
  var height;

  if(window.innerWidth > 750 && window.innerHeight > 500){
      height = 500;
      width = 750;
  } else if (windowRatio < canvasRatio) {
      height = 0.8 * window.innerHeight;
      width = 3/2 * height;
  } else {
      width = window.innerWidth;
      height = 2/3 * width ;
  }

  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
};

window.addEventListener('resize', resize, false);
