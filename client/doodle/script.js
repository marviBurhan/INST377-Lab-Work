/* eslint-disable no-plusplus */
document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid');
  const doodler = document.createElement('div');
  let doodlerLeftSpace = 50;
  let startPoint = 150;
  let doodlerBottomSpace = startPoint;
  let isGameOver = false;
  const platformCount = 5;
  const platforms = [];
  let upTimerID;
  let downTimerID;
  let isJumping = true;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerID;
  let rightTimerID;
  let score = 0;

  class Platform {
    constructor(newPlatBottom) {
      this.bottom = newPlatBottom;
      this.left = Math.random() * 315;
      this.visual = document.createElement('div');

      const {visual} = this;
      visual.classList.add('platform');
      visual.style.left = `${this.left}px`;
      visual.style.bottom = `${this.bottom}px`;
      grid.appendChild(visual);
    }
  }

  function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
      const platGap = 600 / platformCount;
      const newPlatBottom = 100 + i * platGap;
      const newPlatform = new Platform(newPlatBottom);
      platforms.push(newPlatform);
      console.log(platforms);
    }
  }

  function movePlatforms() {
    if (doodlerBottomSpace > 200) {
      platforms.forEach((platform) => {
        // eslint-disable-next-line no-param-reassign
        platform.bottom -= 4;
        const {visual} = platform;
        visual.style.bottom = `${platform.bottom}px`;

        if (platform.bottom < 10) {
          const firstPlatform = platforms[0].visual;
          firstPlatform.classList.remove('platform');
          platforms.shift();
          score++;
          console.log(platforms);
          const newPlatform = new Platform(600);
          platforms.push(newPlatform);
        }
      });
    }
  }

  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    doodlerLeftSpace = platforms[0].left;
    doodler.style.left = `${doodlerLeftSpace}px`;
    doodler.style.bottom = `${doodlerBottomSpace}px`;
  }

  function fall() {
    isJumping = false;
    clearInterval(upTimerID);
    downTimerID = setInterval(() => {
      doodlerBottomSpace -= 5;
      doodler.style.bottom = `${doodlerBottomSpace}px`;
      if (doodlerBottomSpace <= 0) {
        // eslint-disable-next-line no-use-before-define
        gameOver();
      }
      platforms.forEach((platform) => {
        // eslint-disable-next-line max-len
        if ((doodlerBottomSpace >= platform.bottom) && (doodlerBottomSpace <= platform.bottom + 15) && ((doodlerLeftSpace + 60) >= platform.left) && (doodlerLeftSpace <= (platform.left + 85)) && !isJumping) {
          console.log('landed');
          startPoint = doodlerBottomSpace;
          // eslint-disable-next-line no-use-before-define
          jump();
        }
      });
    }, 30);
  }

  function jump() {
    clearInterval(downTimerID);
    isJumping = true;
    upTimerID = setInterval(() => {
      doodlerBottomSpace += 20;
      doodler.style.bottom = `${doodlerBottomSpace}px`;
      if ((doodlerBottomSpace > startPoint + 200) || (doodlerBottomSpace > 610)) {
        fall();
      }
    }, 30);
  }

  function moveLeft() {
    if (isGoingRight) {
      clearInterval(rightTimerID);
      isGoingRight = false;
    }

    isGoingLeft = true;
    leftTimerID = setInterval(() => {
      if (doodlerLeftSpace >= 0) {
        doodlerLeftSpace -= 5;
        doodler.style.left = `${doodlerLeftSpace}px`;
      // eslint-disable-next-line no-use-before-define
      } else moveRight();
    }, 20);
  }

  function moveRight() {
    if (isGoingLeft) {
      clearInterval(leftTimerID);
      isGoingLeft = false;
    }

    isGoingRight = true;
    rightTimerID = setInterval(() => {
      if (doodlerLeftSpace <= 313) {
        doodlerLeftSpace += 5;
        doodler.style.left = `${doodlerLeftSpace}px`;
      } else moveLeft();
    }, 20);
  }

  function moveStraight() {
    isGoingRight = false;
    isGoingLeft = false;
    clearInterval(rightTimerID);
    clearInterval(leftTimerID);
  }

  function control(e) {
    if (e.key === 'ArrowLeft') {
      moveLeft();
    } else if (e.key === 'ArrowRight') {
      moveRight();
    } else if (e.key === 'ArrowUp') {
      moveStraight();
    }
  }

  function gameOver() {
    console.log('Game over');
    isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }
    grid.innerHTML = score;
    clearInterval(upTimerID);
    clearInterval(downTimerID);
    clearInterval(leftTimerID);
    clearInterval(rightTimerID);
  }

  function start() {
    if (!isGameOver) {
      createPlatforms();
      createDoodler();
      setInterval(movePlatforms, 30);
      jump(startPoint);
      document.addEventListener('keyup', control);
    }
  }
  start();
});