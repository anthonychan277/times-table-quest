(function () {
  "use strict";

  var facts = [
    { a: 3, b: 3, answer: 9, story: "Three treasure doors open to Room 9." },
    { a: 3, b: 4, answer: 12, story: "Three race cars zoom to Gate 12." },
    { a: 3, b: 6, answer: 18, story: "Three rockets blast toward Star 18." },
    { a: 3, b: 7, answer: 21, story: "Three rainbow slides land on Cloud 21." },
    { a: 3, b: 8, answer: 24, story: "Three drum teams march to Beat 24." },
    { a: 3, b: 9, answer: 27, story: "Three magic lifts stop at Floor 27." },
    { a: 4, b: 3, answer: 12, story: "Four treasure carts roll into Cave 12." },
    { a: 4, b: 4, answer: 16, story: "Four square windows light up House 16." },
    { a: 4, b: 6, answer: 24, story: "Four pizza plates spin toward Table 24." },
    { a: 4, b: 7, answer: 28, story: "Four trains race into Station 28." },
    { a: 4, b: 8, answer: 32, story: "Four game teams jump to Level 32." },
    { a: 4, b: 9, answer: 36, story: "Four bright spotlights shine on Stage 36." }
  ];

  var avatars = [
    { letter: "A", name: "Ace", cost: 0, color: "#ff6f61" },
    { letter: "B", name: "Bolt", cost: 20, color: "#2878ff" },
    { letter: "C", name: "Comet", cost: 45, color: "#00b884" },
    { letter: "D", name: "Dash", cost: 80, color: "#8b5cf6" }
  ];

  var state = loadState();
  var currentMode = "speed";
  var currentSet = "mixed";
  var round = null;
  var timerId = null;
  var questionStartedAt = 0;
  var audioContext = null;

  var screens = {
    home: document.getElementById("homeScreen"),
    game: document.getElementById("gameScreen"),
    results: document.getElementById("resultsScreen")
  };

  var els = {
    soundButton: document.getElementById("soundButton"),
    homeStars: document.getElementById("homeStars"),
    homeAvatar: document.getElementById("homeAvatar"),
    missionProgress: document.getElementById("missionProgress"),
    reviewCount: document.getElementById("reviewCount"),
    unlockRow: document.getElementById("unlockRow"),
    exitButton: document.getElementById("exitButton"),
    roundCounter: document.getElementById("roundCounter"),
    comboText: document.getElementById("comboText"),
    roundStars: document.getElementById("roundStars"),
    timerBar: document.getElementById("timerBar"),
    arena: document.getElementById("arena"),
    targetAvatar: document.getElementById("targetAvatar"),
    promptLabel: document.getElementById("promptLabel"),
    questionText: document.getElementById("questionText"),
    answers: document.getElementById("answers"),
    feedbackPop: document.getElementById("feedbackPop"),
    memoryCard: document.getElementById("memoryCard"),
    memoryTitle: document.getElementById("memoryTitle"),
    memoryFact: document.getElementById("memoryFact"),
    memoryStory: document.getElementById("memoryStory"),
    continueButton: document.getElementById("continueButton"),
    resultMedal: document.getElementById("resultMedal"),
    resultTitle: document.getElementById("resultTitle"),
    resultScore: document.getElementById("resultScore"),
    resultStars: document.getElementById("resultStars"),
    resultCombo: document.getElementById("resultCombo"),
    resultMessage: document.getElementById("resultMessage"),
    playAgainButton: document.getElementById("playAgainButton"),
    homeButton: document.getElementById("homeButton")
  };

  document.querySelectorAll("[data-mode]").forEach(function (button) {
    button.addEventListener("click", function () {
      startRound(button.dataset.mode);
    });
  });

  document.querySelectorAll("[data-set]").forEach(function (button) {
    button.addEventListener("click", function () {
      currentSet = button.dataset.set;
      document.querySelectorAll("[data-set]").forEach(function (item) {
        item.classList.toggle("active", item === button);
      });
    });
  });

  els.soundButton.addEventListener("click", function () {
    state.sound = !state.sound;
    saveState();
    renderHome();
    chirp(state.sound ? 660 : 220, 0.08);
  });

  els.exitButton.addEventListener("click", function () {
    clearTimer();
    showScreen("home");
    renderHome();
  });

  els.continueButton.addEventListener("click", function () {
    els.memoryCard.hidden = true;
    askQuestion(round.currentFact, true);
  });

  els.playAgainButton.addEventListener("click", function () {
    startRound(currentMode);
  });

  els.homeButton.addEventListener("click", function () {
    showScreen("home");
    renderHome();
  });

  renderHome();

  function loadState() {
    var initial = {
      stars: 0,
      dailyStars: 0,
      lastDay: todayKey(),
      mistakes: {},
      sound: true,
      selectedAvatar: 0
    };

    try {
      var saved = JSON.parse(localStorage.getItem("timesTableQuest") || "null");
      if (!saved) return initial;
      var merged = Object.assign(initial, saved);
      if (merged.lastDay !== todayKey()) {
        merged.dailyStars = 0;
        merged.lastDay = todayKey();
      }
      return merged;
    } catch (error) {
      return initial;
    }
  }

  function saveState() {
    localStorage.setItem("timesTableQuest", JSON.stringify(state));
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function showScreen(name) {
    Object.keys(screens).forEach(function (key) {
      screens[key].classList.toggle("active", key === name);
    });
  }

  function renderHome() {
    var avatar = getAvatar();
    els.homeStars.textContent = state.stars;
    els.homeAvatar.textContent = avatar.letter;
    els.homeAvatar.style.color = avatar.color;
    els.soundButton.textContent = state.sound ? "Sound On" : "Sound Off";
    els.missionProgress.textContent = Math.min(state.dailyStars, 20) + "/20";

    var mistakeCount = Object.keys(state.mistakes).filter(function (key) {
      return state.mistakes[key] > 0;
    }).length;
    els.reviewCount.textContent = mistakeCount ? mistakeCount + " facts ready" : "No mistakes yet";

    els.unlockRow.innerHTML = "";
    avatars.forEach(function (item, index) {
      var unlocked = state.stars >= item.cost;
      var node = document.createElement("button");
      node.type = "button";
      node.className = "unlock" + (unlocked ? "" : " locked");
      node.innerHTML = "<strong>" + item.letter + "</strong><br><small>" + (unlocked ? item.name : item.cost + " stars") + "</small>";
      node.addEventListener("click", function () {
        if (!unlocked) return;
        state.selectedAvatar = index;
        saveState();
        renderHome();
      });
      els.unlockRow.appendChild(node);
    });
  }

  function getAvatar() {
    var selected = avatars[state.selectedAvatar] || avatars[0];
    if (state.stars < selected.cost) return avatars[0];
    return selected;
  }

  function startRound(mode) {
    currentMode = mode;
    var pool = getPool(mode);
    if (!pool.length) {
      currentMode = "speed";
      pool = getPool("speed");
    }

    round = {
      mode: currentMode,
      queue: buildQueue(pool, currentMode === "review" ? Math.min(10, Math.max(4, pool.length * 2)) : 10),
      index: 0,
      correct: 0,
      stars: 0,
      combo: 0,
      bestCombo: 0,
      revenge: [],
      currentFact: null,
      locked: false
    };

    els.memoryCard.hidden = true;
    showScreen("game");
    askNext();
  }

  function getPool(mode) {
    if (mode === "review") {
      var reviewFacts = Object.keys(state.mistakes)
        .filter(function (key) { return state.mistakes[key] > 0; })
        .map(function (key) { return findFact(key); })
        .filter(Boolean);
      return reviewFacts;
    }

    return facts.filter(function (fact) {
      if (currentSet === "three") return fact.a === 3;
      if (currentSet === "four") return fact.a === 4;
      return true;
    });
  }

  function buildQueue(pool, count) {
    var queue = [];
    var shuffled = shuffle(pool.slice());
    while (queue.length < count) {
      queue = queue.concat(shuffle(shuffled.slice()));
    }
    return queue.slice(0, count);
  }

  function askNext() {
    if (round.index >= round.queue.length) {
      finishRound();
      return;
    }

    askQuestion(round.queue[round.index], false);
  }

  function askQuestion(fact, retry) {
    clearTimer();
    round.locked = false;
    round.currentFact = fact;

    var avatar = getAvatar();
    els.targetAvatar.textContent = avatar.letter;
    els.targetAvatar.style.color = avatar.color;
    els.roundCounter.textContent = Math.min(round.index + 1, round.queue.length) + " / " + round.queue.length;
    els.comboText.textContent = "Combo x" + round.combo;
    els.roundStars.textContent = round.stars;
    els.promptLabel.textContent = retry ? "Try again!" : "Choose the answer!";
    els.questionText.textContent = fact.a + " x " + fact.b + " = ?";
    els.answers.innerHTML = "";

    makeOptions(fact.answer).forEach(function (option) {
      var button = document.createElement("button");
      button.className = "answer-button";
      button.type = "button";
      button.textContent = option;
      button.addEventListener("click", function () {
        chooseAnswer(option, button);
      });
      els.answers.appendChild(button);
    });

    if (round.mode === "practice") {
      els.timerBar.style.transform = "scaleX(1)";
      return;
    }

    questionStartedAt = performance.now();
    tickTimer();
    timerId = window.setInterval(tickTimer, 60);
  }

  function chooseAnswer(option, button) {
    if (round.locked) return;
    round.locked = true;
    clearTimer();

    var fact = round.currentFact;
    var correct = option === fact.answer;
    var elapsed = (performance.now() - questionStartedAt) / 1000;

    if (correct) {
      button.classList.add("correct");
      round.correct += 1;
      round.combo += 1;
      round.bestCombo = Math.max(round.bestCombo, round.combo);

      var earned = round.mode === "practice" ? 1 : elapsed <= 5 ? 2 : 1;
      if (round.revenge.indexOf(factKey(fact)) !== -1) earned += 1;
      round.stars += earned;
      state.stars += earned;
      state.dailyStars += earned;
      state.mistakes[factKey(fact)] = Math.max(0, (state.mistakes[factKey(fact)] || 0) - 1);
      saveState();

      showFeedback(round.combo >= 3 ? "Combo x" + round.combo : "Great!");
      els.targetAvatar.classList.add("hit");
      setTimeout(function () { els.targetAvatar.classList.remove("hit"); }, 220);
      chirp(740 + Math.min(round.combo, 5) * 60, 0.1);

      setTimeout(function () {
        round.index += 1;
        askNext();
      }, 620);
    } else {
      button.classList.add("wrong");
      round.combo = 0;
      state.mistakes[factKey(fact)] = (state.mistakes[factKey(fact)] || 0) + 1;
      saveState();
      showFeedback("Try again");
      chirp(180, 0.16);
      round.revenge.push(factKey(fact));
      showMemory(fact, "Remember");
    }
  }

  function tickTimer() {
    var elapsed = (performance.now() - questionStartedAt) / 1000;
    var remaining = Math.max(0, 5 - elapsed);
    els.timerBar.style.transform = "scaleX(" + (remaining / 5).toFixed(3) + ")";

    if (remaining <= 0) {
      clearTimer();
      if (round.locked) return;
      round.locked = true;
      round.combo = 0;
      var fact = round.currentFact;
      state.mistakes[factKey(fact)] = (state.mistakes[factKey(fact)] || 0) + 1;
      saveState();
      showFeedback("Time up");
      chirp(160, 0.18);
      round.revenge.push(factKey(fact));
      showMemory(fact, "Time up");
    }
  }

  function showMemory(fact, title) {
    els.memoryTitle.textContent = title;
    els.memoryFact.textContent = fact.a + " x " + fact.b + " = " + fact.answer;
    els.memoryStory.textContent = fact.story;
    els.memoryCard.hidden = false;
  }

  function finishRound() {
    clearTimer();
    showScreen("results");

    els.resultScore.textContent = round.correct + " / " + round.queue.length;
    els.resultStars.textContent = round.stars;
    els.resultCombo.textContent = round.bestCombo;

    if (round.correct === round.queue.length) {
      els.resultTitle.textContent = "Perfect run!";
      els.resultMessage.textContent = "You cleared every question.";
      els.resultMedal.textContent = "P";
    } else if (round.correct >= Math.ceil(round.queue.length * 0.8)) {
      els.resultTitle.textContent = "Great run!";
      els.resultMessage.textContent = "One more round can lock it in.";
      els.resultMedal.textContent = "S";
    } else {
      els.resultTitle.textContent = "Good practice!";
      els.resultMessage.textContent = "Mistake questions are ready for review.";
      els.resultMedal.textContent = "G";
    }
  }

  function makeOptions(answer) {
    var options = [answer];
    var candidates = facts.map(function (fact) { return fact.answer; })
      .concat([6, 8, 10, 14, 15, 20, 30, 40]);

    candidates = shuffle(candidates.filter(function (value, index, array) {
      return value !== answer && array.indexOf(value) === index;
    }));

    candidates.forEach(function (value) {
      if (options.length < 4 && Math.abs(value - answer) <= 12) options.push(value);
    });

    candidates.forEach(function (value) {
      if (options.length < 4) options.push(value);
    });

    return shuffle(options);
  }

  function clearTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function showFeedback(text) {
    els.feedbackPop.textContent = text;
    els.feedbackPop.classList.remove("show");
    void els.feedbackPop.offsetWidth;
    els.feedbackPop.classList.add("show");
  }

  function chirp(frequency, duration) {
    if (!state.sound) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      var oscillator = audioContext.createOscillator();
      var gain = audioContext.createGain();
      oscillator.frequency.value = frequency;
      oscillator.type = "sine";
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
      oscillator.connect(gain).connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + duration + 0.02);
    } catch (error) {
      state.sound = false;
    }
  }

  function factKey(fact) {
    return fact.a + "x" + fact.b;
  }

  function findFact(key) {
    return facts.find(function (fact) {
      return factKey(fact) === key;
    });
  }

  function shuffle(array) {
    for (var index = array.length - 1; index > 0; index -= 1) {
      var swapIndex = Math.floor(Math.random() * (index + 1));
      var temp = array[index];
      array[index] = array[swapIndex];
      array[swapIndex] = temp;
    }
    return array;
  }
}());
