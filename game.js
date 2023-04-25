const imageUrls = {
  "happy": {
    "left": "https://i.imgur.com/FA8wikG.png",
    "right": "https://i.imgur.com/dLSTGjT.png",
    "none": "https://i.imgur.com/IcBVE0A.png",
    "both": "https://i.imgur.com/BZ0ocb3.png",
  },
  "sad": {
    "left": "https://i.imgur.com/nw6IikX.png",
    "right": "https://i.imgur.com/Lcqci8G.png",
    "none": "https://i.imgur.com/Zt5ye7h.png",
    "both": "https://i.imgur.com/UvolQr0.png",
  },
}

const images = {};
const sounds = {};
const canvas = document.getElementById("cvs");
const ctx = canvas.getContext("2d");

const keyBools = {
  left: false,
  right: false,
  both: false,
}

const catStates = {
  "NONE": 0,
  "LEFT": 1,
  "RIGHT": 2,
  "BOTH": 3,
}

const noteTypes = {
  "LEFT": 1,
  "RIGHT": 2,
  "BOTH": 3,
}

let notes = [];

let score = 0;
let bestScore = localStorage.getItem("score");
if(bestScore === null) {
  localStorage.setItem("score", "0");
  bestScore = 0;
}

let sadFrames = 0;

class Note {
  constructor(noteType) {
    this.x = 900;
    this.expired = false;
    this.noteType = noteType;
  }
  draw(context) {
    if(this.noteType === noteTypes.LEFT || this.noteType === noteTypes.BOTH) {
      context.fillStyle = "#0000FF";
      context.fillRect(this.x, 120, 20, 20);
    }
    if(this.noteType === noteTypes.RIGHT || this.noteType === noteTypes.BOTH) {
      context.fillStyle = "#FF0000";
      context.fillRect(this.x, 80, 20, 20);
    }
  }
  inScoreZone() {
    return (this.x <= 120 && this.x > 100);
  }
}


let prevCatState = catStates.NONE;
let currCatState = catStates.NONE;

loadImage = (url) => {
  return new Promise((resolve) => {
    const imageLoaded = (e) => {
      resolve(img);
    };
    const img = new Image();
    img.onload = imageLoaded;
    img.src = url;
  });
};

loadSound = (url) => {
  return new Promise((resolve) => {
    const soundLoaded = (e) => {
      resolve(sound);
    };
    const sound = new Audio(url);
    resolve(sound);
  });
};

initImages = async () => {
  images.happy = {};
  images.happy.left = await loadImage(imageUrls.happy.left);
  images.happy.right = await loadImage(imageUrls.happy.right);
  images.happy.both = await loadImage(imageUrls.happy.both);
  images.happy.none = await loadImage(imageUrls.happy.none);

  images.sad = {};
  images.sad.left = await loadImage(imageUrls.sad.left);
  images.sad.right = await loadImage(imageUrls.sad.right);
  images.sad.both = await loadImage(imageUrls.sad.both);
  images.sad.none = await loadImage(imageUrls.sad.none);
}

initSounds = async () => {
  // sounds.left = await loadSound("http://stephane.brechet.free.fr/Sons/Wave/BONGO_LO.WAV");
  // sounds.right = await loadSound("http://tipiwiki.free.fr/snd/Percussions3.wav");
  sounds.left = await loadSound("sounds/left.wav");
  sounds.right = await loadSound("sounds/right.wav");
}

init = async () => {
  await initImages();
  await initSounds();

  ctx.font = "50px serif";
  
  document.addEventListener("keydown", handleKeydown);
  document.addEventListener("keyup", handleKeyup);

  createNote();

  requestAnimationFrame(mainLoop);
};

const createNote = () => {
  const noteTypesNames = [noteTypes.LEFT, noteTypes.RIGHT, noteTypes.BOTH];
  const noteChoice = Math.floor(Math.random() * 3);
  notes.push(new Note(noteTypesNames[noteChoice]));
  const delay = Math.floor(Math.random() * 8) * 150 + 150;
  setTimeout(createNote, delay);
}

const updateCatImage = () => {
  if(currCatState === catStates.LEFT) {
    if(sadFrames > 0) {return images.sad.left;}
    return images.happy.left;
  }
  if(currCatState === catStates.RIGHT) {
    if(sadFrames > 0) {return images.sad.right;}
    return images.happy.right;
  }
  if(currCatState === catStates.BOTH) {
    if(sadFrames > 0) {return images.sad.both;}
    return images.happy.both;
  }
  else {
    if(sadFrames > 0) {return images.sad.none;}
    return images.happy.none;
  }
};

const getCatState = () => {
  if(keyBools.left) {
    return catStates.LEFT;
  }
  else if(keyBools.right) {
    return catStates.RIGHT;
  }
  else if(keyBools.both) {
    return catStates.BOTH;
  }
  else {
    return catStates.NONE;
  }
}

const playSound = (state) => {
  switch(state) {
    case catStates.LEFT:
      sounds.left.currentTime = 0;
      sounds.left.play();
      break;
    case catStates.RIGHT:
      sounds.right.currentTime = 0;
      sounds.right.play();
      break;
    case catStates.BOTH:
      sounds.left.currentTime = 0;
      sounds.left.play();
      sounds.right.currentTime = 0;
      sounds.right.play();
      break;
    default:
      break;
  }
}

const handleKeydown = (e) => {
  Object.keys(keyBools).forEach(v => keyBools[v] = false);
  if(e.key === "ArrowLeft" || e.key === "ArrowDown") {
    keyBools.left = true;
  }
  else if(e.key === "ArrowRight" || e.key === "ArrowUp") {
    keyBools.right = true;
  }
  else if(e.key === " ") {
    keyBools.both = true;
  }
};

const handleKeyup = (e) => {
  if(e.key === "ArrowLeft" || e.key === "ArrowDown") {
    keyBools.left = false;
  }
  else if(e.key === "ArrowRight" || e.key === "ArrowUp") {
    keyBools.right = false;
  }
  else if(e.key === " ") {
    keyBools.both = false;
  }
};

const drawLines = () => {
  ctx.beginPath();
  ctx.moveTo(0,90);
  ctx.lineTo(canvas.width, 90);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0,130);
  ctx.lineTo(canvas.width, 130);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(120,50);
  ctx.lineTo(120, 170);
  ctx.stroke();
}

const drawText = () => {
  ctx.fillStyle = "#000000";
  ctx.fillText(`Score: ${score}`, 50, 500);
  ctx.fillText(`Best: ${bestScore}`, 50, 570);
};

const onDrum = (noteType) => {
  const scoringNote = notes.filter(v => v.inScoreZone());
  if(scoringNote.length === 0) {
    resetScore();
  }
  else {
    if(scoringNote[0].noteType === noteType && scoringNote[0].expired === false) {
      incrementScore();
      scoringNote[0].expired = true;
    }
    else {
      resetScore();
    }
  }
};

const resetScore = () => {
  score = 0;
  sadFrames = 60;
}

const incrementScore = () => {
  sadFrames = 0;
  score++;
  if(score > bestScore) {
    bestScore = score;
    localStorage.setItem("score", score);
  }
}

mainLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawLines();

  currCatState = getCatState();

  if(sadFrames > 0) {
    sadFrames--;
  }
  const image = updateCatImage();
  ctx.drawImage(image, 0, 0, 800, 800);

  drawText();
  
  if(prevCatState !== currCatState) {
    playSound(currCatState);
    if(currCatState !== catStates.NONE){
      onDrum(currCatState);
    }
  }

  for(note of notes) {
    note.x-=2.5;
    note.draw(ctx);
    if(note.x <= -10) {
      note.kill = true;
    }
  }

  for(note of notes) {
    if(note.x <= 100 && note.expired === false) {
      note.expired = true;
      resetScore();
    }
  }


  notes = notes.filter(v => v.kill !== true);

  prevCatState = currCatState;
  requestAnimationFrame(mainLoop);
};

window.onload = init();