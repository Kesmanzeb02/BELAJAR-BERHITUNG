// ==========================================
// RUANGBELAJAR 3T
// Generator soal Matematika SD tanpa batas
// ==========================================

const STORAGE_KEY = "ruangbelajar-3t-v2";

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      saved &&
      Number.isFinite(saved.score) &&
      Number.isFinite(saved.totalAnswered)
    ) {
      return {
        score: Math.max(0, saved.score),
        totalAnswered: Math.max(0, saved.totalAnswered)
      };
    }
  } catch (error) {
    console.warn("Progres belum dapat dibaca.", error);
  }

  return { score: 0, totalAnswered: 0 };
}

let state = loadProgress();
let questionNumber = 0;
let currentQuestion = null;
let answeredCurrent = false;

// Membuat angka acak antara min dan max.
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Menghasilkan soal dengan operasi yang berbeda-beda.
function generateQuestion() {
  const type = randomInt(1, 4);
  let a, b, answer, symbol, explanation;

  if (type === 1) {
    // Penjumlahan
    a = randomInt(1, 100);
    b = randomInt(1, 100);
    answer = a + b;
    symbol = "+";
    explanation = `${a} + ${b} = ${answer}.`;
  } else if (type === 2) {
    // Pengurangan, hasil tidak negatif
    a = randomInt(10, 150);
    b = randomInt(1, a);
    answer = a - b;
    symbol = "−";
    explanation = `${a} − ${b} = ${answer}.`;
  } else if (type === 3) {
    // Perkalian
    a = randomInt(2, 12);
    b = randomInt(2, 12);
    answer = a * b;
    symbol = "×";
    explanation = `${a} × ${b} = ${answer}.`;
  } else {
    // Pembagian dengan hasil bilangan bulat
    b = randomInt(2, 12);
    answer = randomInt(2, 12);
    a = b * answer;
    symbol = "÷";
    explanation = `${a} ÷ ${b} = ${answer}.`;
  }

  // Membuat tiga pilihan salah yang berbeda.
  const choices = new Set([answer]);

  while (choices.size < 4) {
    let wrong;

    const offset = randomInt(1, 10);
    wrong = Math.random() < 0.5
      ? answer + offset
      : answer - offset;

    // Hindari angka negatif dan pilihan duplikat.
    if (wrong >= 0 && wrong !== answer) {
      choices.add(wrong);
    }
  }

  // Acak urutan pilihan jawaban.
  const options = [...choices].sort(() => Math.random() - 0.5);

  return {
    a,
    b,
    symbol,
    answer,
    explanation,
    options,
    correctIndex: options.indexOf(answer)
  };
}

// Menampilkan soal baru.
function renderQuestion(forceNew = false) {
  if (!currentQuestion || forceNew) {
    currentQuestion = generateQuestion();
    questionNumber++;
    answeredCurrent = false;
  }

  const q = currentQuestion;

  document.getElementById("questionCount").textContent =
    `Soal ke-${questionNumber} · Latihan tanpa batas`;

  document.getElementById("question").textContent =
    `Berapakah hasil dari ${q.a} ${q.symbol} ${q.b}?`;

  document.getElementById("feedback").textContent = "";
  document.getElementById("nextQuestion").classList.add("hidden");

  const answers = document.getElementById("answers");
  answers.replaceChildren();

  q.options.forEach((value, index) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.textContent = value;
    button.addEventListener("click", () => checkAnswer(index));
    answers.appendChild(button);
  });
}

// Memeriksa jawaban siswa.
function checkAnswer(index) {
  if (answeredCurrent) return;
  answeredCurrent = true;

  const q = currentQuestion;
  const buttons = document.querySelectorAll(".answer");
  const feedback = document.getElementById("feedback");

  buttons.forEach(button => {
    button.disabled = true;
  });

  if (index === q.correctIndex) {
    state.score++;
    buttons[index].classList.add("correct");

    feedback.textContent =
      `Hebat! Jawabanmu benar 🎉 ${q.explanation}`;

    feedback.style.color = "#23774e";
  } else {
    buttons[index].classList.add("wrong");
    buttons[q.correctIndex].classList.add("correct");

    feedback.textContent =
      `Belum tepat. Yuk, pelajari: ${q.explanation}`;

    feedback.style.color = "#a13f3f";
  }

  state.totalAnswered++;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("Progres tidak dapat disimpan.", error);
  }

  updateProgress();
  renderResults();

  const next = document.getElementById("nextQuestion");
  next.textContent = "Kerjakan soal baru →";
  next.classList.remove("hidden");
}

// Tombol berikutnya selalu menghasilkan soal baru.
document.getElementById("nextQuestion")
  .addEventListener("click", () => {
    renderQuestion(true);
  });

// Progres tidak berhenti di lima soal.
// Indikator menunjukkan kemajuan menuju setiap 10 soal.
function updateProgress() {
  const total = state.totalAnswered;
  const percent = total > 0 && total % 10 === 0
    ? 100
    : total % 10 * 10;

  document.getElementById("progressPercent")
    .textContent = `${total} soal`;

  document.getElementById("progressBar")
    .style.width = `${percent}%`;

  document.getElementById("progressText")
    .textContent =
      `${state.score} jawaban benar dari ${total} soal yang dikerjakan.`;
}

// Hasil belajar.
function renderResults() {
  document.getElementById("totalScore").textContent = state.score;

  const accuracy = state.totalAnswered
    ? Math.round(state.score / state.totalAnswered * 100)
    : 0;

  document.getElementById("resultDetail").textContent =
    `Total soal dijawab: ${state.totalAnswered}. ` +
    `Ketepatan jawaban: ${accuracy}%.`;
}

// Navigasi halaman.
function showView(view) {
  document.querySelectorAll(".panel").forEach(panel => {
    panel.classList.add("hidden");
  });

  if (view !== "home") {
    const target = document.getElementById(view);
    if (target) target.classList.remove("hidden");
  }

  if (view === "quiz") {
    if (!currentQuestion || answeredCurrent) {
      renderQuestion(true);
    } else {
      renderQuestion(false);
    }
  }

  if (view === "result") renderResults();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-view]").forEach(button => {
  button.addEventListener("click", () => {
    showView(button.dataset.view);
  });
});

// Tutor berbasis materi yang tersedia secara lokal.
// Ini bukan AI generatif.
const tutorTopics = [
  {
    keys: ["pecahan", "setengah", "seperempat"],
    answer:
      "Pecahan menunjukkan bagian dari keseluruhan. " +
      "Contohnya, 1/2 berarti satu dari dua bagian sama besar."
  },
  {
    keys: ["tambah", "penjumlahan", "ditambah"],
    answer:
      "Penjumlahan berarti menggabungkan jumlah. " +
      "Contoh: 3 + 2 = 5."
  },
  {
    keys: ["kurang", "pengurangan", "dikurangi"],
    answer:
      "Pengurangan berarti mengambil sebagian dari jumlah awal. " +
      "Contoh: 8 − 3 = 5."
  },
  {
    keys: ["kali", "perkalian", "dikali"],
    answer:
      "Perkalian adalah penjumlahan berulang. " +
      "Contoh: 3 × 4 = 4 + 4 + 4 = 12."
  },
  {
    keys: ["bagi", "pembagian", "dibagi"],
    answer:
      "Pembagian berarti membagi jumlah menjadi beberapa kelompok. " +
      "Contoh: 12 ÷ 3 = 4."
  }
];

function getTutorAnswer(input) {
  const text = input.toLowerCase();

  if (text.includes("halo") || text.includes("hai")) {
    return "Halo, Sobat Belajar! 🌟 Kamu boleh bertanya " +
      "tentang penjumlahan, pengurangan, perkalian, " +
      "pembagian, atau pecahan.";
  }

  const topic = tutorTopics.find(item =>
    item.keys.some(key => text.includes(key))
  );

  return topic
    ? topic.answer
    : "Aku belum memiliki penjelasan untuk pertanyaan itu. " +
      "Coba tanyakan tentang operasi hitung atau pecahan, ya!";
}

function addMessage(text, type) {
  const message = document.createElement("div");
  message.className = `bubble ${type}`;
  message.textContent = text;

  document.getElementById("chatMessages").appendChild(message);
  message.scrollIntoView({ block: "nearest" });
}

document.getElementById("tutorForm")
  .addEventListener("submit", event => {
    event.preventDefault();

    const input = document.getElementById("tutorInput");
    const question = input.value.trim();

    if (!question) return;

    addMessage(question, "user");
    addMessage(getTutorAnswer(question), "bot");

    input.value = "";
  });

// Status koneksi.
function updateConnection() {
  document.getElementById("connection").textContent =
    navigator.onLine ? "Periksa koneksi" : "Mode offline";
}

window.addEventListener("online", updateConnection);
window.addEventListener("offline", updateConnection);

// Inisialisasi aplikasi.
updateProgress();
renderResults();
updateConnection();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js")
      .catch(error => {
        console.error("Pendaftaran offline gagal:", error);
      });
  });
}