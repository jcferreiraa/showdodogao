const question = document.querySelector(".question");
const answers = document.querySelector(".answers");
const spnQtd = document.querySelector(".spnQtd");
const textFinish = document.querySelector("#textFinish");
const content = document.querySelector(".content");
const contentFinish = document.querySelector(".finish");
const btnRestart = document.querySelector("#btn1");

import questions from "./questions.js";

// Criar o canvas para fogos de artifício e confetes
const fireworksCanvas = document.createElement("canvas");
fireworksCanvas.id = "fireworksCanvas";
document.body.appendChild(fireworksCanvas);
const ctx = fireworksCanvas.getContext("2d");

// Variáveis para os fogos e confetes
let particles = [];
let confetti = [];
let animationFrame;

// Função para gerar fogos de artifício e confetes
function createFireworkAndConfetti(x, y) {
  // Criar fogos de artifício
  for (let i = 0; i < 50; i++) {
    particles.push({
      x: x,
      y: y,
      vx: Math.random() * 10 - 5,
      vy: Math.random() * 10 - 5,
      alpha: 1,
      size: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`
    });
  }
  
  // Criar confetes
  for (let i = 0; i < 100; i++) {
    confetti.push({
      x: Math.random() * window.innerWidth,
      y: -Math.random() * 100,
      vx: Math.random() * 2 - 1,
      vy: Math.random() * 5 + 2,
      size: Math.random() * 5 + 5,
      color: `hsl(${Math.random() * 360}, 100%, 50%)`,
      rotation: Math.random() * 360
    });
  }
}

// Função para desenhar fogos de artifício e confetes
function drawFireworksAndConfetti() {
  ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

  // Desenhar fogos de artifício
  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.alpha -= 0.02;
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    }
    ctx.fillStyle = `${particle.color}`;
    ctx.globalAlpha = particle.alpha;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Desenhar confetes
  confetti.forEach((piece, index) => {
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.rotation += 5;
    if (piece.y > window.innerHeight) {
      confetti.splice(index, 1);
    }
    ctx.fillStyle = `${piece.color}`;
    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation * Math.PI / 180);
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
    ctx.restore();
  });

  ctx.globalAlpha = 1; // Reset global alpha

  if (particles.length > 0 || confetti.length > 0) {
    animationFrame = requestAnimationFrame(drawFireworksAndConfetti);
  } else {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;  // Parar a animação quando não houver mais partículas
  }
}

// Função para disparar fogos e confetes
function triggerFireworksAndConfetti() {
  const x = window.innerWidth / 2;
  const y = window.innerHeight / 3;
  createFireworkAndConfetti(x, y);
  if (!animationFrame) {
    animationFrame = requestAnimationFrame(drawFireworksAndConfetti);
  }
}

// Ajustar o tamanho do canvas
function resizeCanvas() {
  fireworksCanvas.width = window.innerWidth;
  fireworksCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let shuffledQuestions = [];
let currentIndex = 0;
let questionsCorrect = 0;

btnRestart.onclick = () => {
  content.style.display = "flex";
  contentFinish.style.display = "none";

  currentIndex = 0;
  questionsCorrect = 0;
  shuffleQuestions();  // Reembaralhar perguntas ao reiniciar
  loadQuestion();
};

// Função para embaralhar as perguntas e combiná-las em uma única lista
function shuffleQuestions() {
  const easyQuestions = questions.filter(q => q.level === "easy");
  const mediumQuestions = questions.filter(q => q.level === "medium");
  const hardQuestions = questions.filter(q => q.level === "hard");

  const shuffledEasy = shuffleArray(easyQuestions);  // Pegar todas as fáceis
  const shuffledMedium = shuffleArray(mediumQuestions); // Pegar todas as médias
  const shuffledHard = shuffleArray(hardQuestions);    // Pegar todas as difíceis

  shuffledQuestions = [...shuffledEasy, ...shuffledMedium, ...shuffledHard];
}

// Função para embaralhar um array usando Fisher-Yates
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function checkAnswer(e) {
  const selectedOption = e.target;
  const correctOption = answers.querySelector("[data-correct='true']");

  question.classList.remove("correct", "incorrect");

  if (selectedOption.getAttribute("data-correct") === "true") {
    questionsCorrect++;
    selectedOption.classList.add("correct");
    question.classList.add("correct");
    triggerFireworksAndConfetti();  // Efeito de fogos quando acerta
  } else {
    selectedOption.classList.add("incorrect");
    correctOption.classList.add("correct");
    question.classList.add("incorrect");
  }

  setTimeout(() => {
    nextQuestion();
  }, 2000);
}

function nextQuestion() {
  if (currentIndex < shuffledQuestions.length - 1) {
    currentIndex++;
    loadQuestion();
  } else {
    finish();
  }
}

function finish() {
  textFinish.innerHTML = `Você acertou ${questionsCorrect} de ${shuffledQuestions.length}`;
  content.style.display = "none";
  contentFinish.style.display = "flex";
}

function loadQuestion() {
  spnQtd.innerHTML = `${currentIndex + 1}/${shuffledQuestions.length}`;
  const item = shuffledQuestions[currentIndex];

  answers.innerHTML = "";
  question.innerHTML = item.question;

  item.answers.forEach((answer) => {
    const div = document.createElement("div");

    div.innerHTML = `
    <button class="answer" data-correct="${answer.correct}">
      ${answer.option}
    </button>
    `;

    answers.appendChild(div);
  });

  document.querySelectorAll(".answer").forEach((item) => {
    item.addEventListener("click", checkAnswer);
  });

  question.classList.remove("correct", "incorrect");
}

shuffleQuestions();
loadQuestion();
