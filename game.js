// Game State
const state = {
  currentQuestionIndex: 0,
  soundEnabled: true,
  selections: new Array(8).fill(null), // tracks chosen door index (0, 1, 2) for each question (8 questions now)
  activeSelectionActive: true,
  puzzleSelections: [] // tracks selected node indices for puzzle questions
};

// 8 Questions Database (shuffled correctness, mixed nodes for Q7, new Anthropic Q5)
const questionsData = [
  {
    indexLabel: "דלת 1: חזון הרמב\"ם (המאה ה-12)",
    type: "doors",
    question: "כיצד מתאר הרמב\"ם בספרו \"משנה תורה\" את תקופת ימות המשיח המאפיינת את חזון האוטומציה והשפע?",
    doors: [
      {
        answer: "\"יהיה רעב ומחסור גדול בארץ, ובני האדם יצטרכו לעמול בפרך מבוקר עד ערב כדי למצוא פת לחם ומחיה לבתיהם\"",
        correct: false,
        explanation: "לא נכון. הרמב\"ם מתאר מציאות של שפע רב וקלות מציאת פרנסה, ולא רעב או מחסור."
      },
      {
        answer: "\"באותם הימים יהיה נקל מאד על בני האדם למצוא מחיתם, עד שבעמל מעט שיעמול האדם – יגיע לתועלת גדולה... ויארכו חיי בני האדם גם כן\"",
        correct: true,
        explanation: "נכון מאוד! זהו הניסוח המדויק המופיע במצגת (הלכות מלכים ומלחמותיהם, פרק י\"ב, הלכה ה')."
      },
      {
        answer: "\"יהיה עידן שבו כל המחלות ייעלמו כליל ולא יהיה עוד צורך ברופאים ובאחיות, והעולם יתנהל על ידי אוטומטים חכמים בלבד\"",
        correct: false,
        explanation: "לא נכון. הרמב\"ם לא עוסק באוטומטים אלא בשפע כלכלי ובקלות השגת המחיה שתפנה את בני האדם לחוכמה."
      }
    ]
  },
  {
    indexLabel: "דלת 2: סיפור הגולם מפראג (המאה ה-16)",
    type: "doors",
    question: "מהו הלקח הפילוסופי-הלכתי של סיפור \"הגולם מפראג\" של המהר\"ל לגבי פיתוח בינה מלאכותית (AI) ללא רוח או אמפתיה?",
    doors: [
      {
        answer: "הגולם מראה כיצד כלי שנוצר מתוך כוונות טובות להגנה, אך בהיעדר מהות ונשמה אנושית מפתח התנהגות הרסנית וקם על יוצרו",
        correct: true,
        explanation: "נכון מאוד! סכנת בינה מלאכותית חסרת רגישות אנושית, הפועלת ללא פיקוח מוסרי."
      },
      {
        answer: "הגולם מלמד כי טכנולוגיה ואוטומציה תבונית יכולות להחליף את הרגש והנשמה האנושית בצורה מושלמת ובטוחה",
        correct: false,
        explanation: "לא נכון. הסיפור בא להזהיר בדיוק מפני פיתוח כזה, שבו יציר הכפיים קם על יוצרו בהיעדר נשמה."
      },
      {
        answer: "הגולם הוא אוטומט מושלם שאין בו שום סיכון, והוא מעיד על יכולת האדם לברוא מחשב חף מטעויות",
        correct: false,
        explanation: "לא נכון. הגולם יצא מכלל שליטה והיה צורך לכבותו (מחיקת האות א' מ-'אמת' להשארת 'מת')."
      }
    ]
  },
  {
    indexLabel: "דלת 3: טעות הסוסים (שנת 1900)",
    type: "doors",
    question: "מהי \"טעות הסוסים\" בהיסטוריה של המהפכות הטכנולוגיות וכיצד היא מתקשרת למהפכת ה-AI?",
    doors: [
      {
        answer: "האמונה כי סוסים מהירים יותר ממנועים ראשוניים, מה שעיכב את כניסת המהפכה התעשייתית לתחבורה",
        correct: false,
        explanation: "לא נכון. זהו סיפור הממחיש את סכנת החלפת כוח העבודה האנושי (המוח) על ידי המחשב."
      },
      {
        answer: "ההערכה השגויה לגבי מספר הסוסים שיידרשו להובלת משאות בערים בעקבות המצאת הרכבת והמכונית",
        correct: false,
        explanation: "לא נכון. הטעות היא חוסר ההבנה שטכנולוגיה חדשה (מנוע) יכולה להחליף לחלוטין את העובד (הסוס) ולא רק לעזור לו."
      },
      {
        answer: "ההנחה שכלים חדשים רק משפרים את פריון השריר, בעוד ה-AI מחליף את המוח האנושי כפי שהמנוע החליף כליל את הסוסים והביא לצניחתם",
        correct: true,
        explanation: "נכון מאוד! ה-AI הוא מהפכה קוגניטיבית המיועדת להחליף את המוח ולא רק לשפר את השריר."
      }
    ]
  },
  {
    indexLabel: "דלת 4: מהפכת 2025 ודו\"ח מיקרוסופט",
    type: "doors",
    question: "על פי דו\"ח מיקרוסופט (Working with AI, אוגוסט 2025), כיצד מדרג מדד ה-AI Applicability Score את מקצועות שוק העבודה?",
    doors: [
      {
        answer: "הוא קובע כי מקצועות הסיעוד והטיפול הפיזי נמצאים בסיכון הגבוה ביותר להחלפה מלאה בתוך שנה",
        correct: false,
        explanation: "לא נכון. מקצועות הטיפול והמגע הפיזי (כמו סיעוד) הם העמידים ביותר בפני החלפה."
      },
      {
        answer: "הוא מדרג מקצועות לפי רמת חפיפת המשימות השגרתיות והקוגניטיביות שלהם מול יכולות הבינה היוצרת",
        correct: true,
        explanation: "נכון מאוד! המדד מנתח אילו משימות משרדיות ותבוניות יכולות להתבצע ישירות על ידי AI."
      },
      {
        answer: "הוא מדרג מקצועות על בסיס רמת המאמץ הפיזי והפעילות הידנית הנדרשת מהעובדים במפעלים",
        correct: false,
        explanation: "לא נכון. הדו\"ח מתמקד בקופיילוט וביכולות קוגניטיביות המבוצעות מול מסך."
      }
    ]
  },
  {
    indexLabel: "דלת 5: דו\"ח אנתרופיק (מרץ 2026)",
    type: "doors",
    question: "על פי דו\"ח אנתרופיק ממרץ 2026, מהו הממצא המרכזי בנוגע לשימוש ב-AI בפועל לעומת יכולות המכונה במקצועות הבריאות?",
    doors: [
      {
        answer: "מקצועות הבריאות מציגים את אחוז השימוש בפועל הגבוה ביותר מכלל התעשיות, כאשר צוותי רפואה מטמיעים את כל יכולות הבינה ללא שום עיכוב.",
        correct: false,
        explanation: "לא נכון. למעשה, מקצועות הבריאות משתרכים מאחור באימוץ בפועל."
      },
      {
        answer: "הבינה המלאכותית הגיעה למלוא מיצוי יכולותיה בפועל במרפאות, ואין עוד פער בין מה שהמערכת מסוגלת לעשות לבין מה שהיא מבצעת.",
        correct: false,
        explanation: "לא נכון. קיים פער משמעותי מאוד בין היכולת הטכנולוגית לבין היישום בפועל."
      },
      {
        answer: "קיים פער משמעותי בין היכולות המוגברות שהבינה מציעה לבין האימוץ והיישום בפועל שלה במקצועות הבריאות, המשתרכים מאחור עקב חסמים רגולטוריים וקליניים.",
        correct: true,
        explanation: "נכון מאוד! הדו\"ח מדגיש את הפער הגדול הקיים בבריאות בין פוטנציאל המכונה לבין היישום בשטח."
      }
    ]
  },
  {
    indexLabel: "דלת 6: סייבר ומערכת הבריאות בישראל (יוני 2026)",
    type: "doors",
    question: "על רקע עלייה באיומי סייבר ביוני 2026, מהי ההנחיה המיידית של משרד הבריאות לגבי שימוש ב-AI?",
    doors: [
      {
        answer: "חסימה מוחלטת של גישה לכלי AI חיצוניים ממחשבי בתי החולים הממשלתיים, והגבלת השימוש למכשירים אישיים בלבד",
        correct: true,
        explanation: "נכון מאוד! הנחיית החירום באה למנוע זליגת מידע רגיש ופרצות אבטחה ברשתות בתי החולים."
      },
      {
        answer: "פתיחת גישה מלאה ומהירה ללא סיסמה לכל מודלי השפה של Anthropic ו-OpenAI ממחשבי המחלקה",
        correct: false,
        explanation: "לא נכון. משרד הבריאות חסם את הכלים לחלוטין ברשתות הפנימיות בשל סיכוני אבטחת מידע."
      },
      {
        answer: "איסור גורף על שימוש בבינה מלאכותית גם במכשירים אישיים לכלל הרופאים והאחיות בארץ",
        correct: false,
        explanation: "לא נכון. השימוש מותר במכשירים אישיים, אך חל איסור מוחלט להזין פרטים מזהים של מטופלים."
      }
    ]
  },
  {
    indexLabel: "דלת 7: פרוטוקול הפרומפט הקליני המובנה",
    type: "puzzle",
    question: "אתגר שער הבקרה: בחרו את 4 המרכיבים ההכרחיים (לפי חוקי הפרומפטולוגיה הקלינית) לבניית פנייה ביקורתית ומובנית ל-AI:",
    nodes: [
      { name: "הגדרת תפקיד המערכת (Role)", correct: true },
      { name: "פרטים מזהים של המטופל (שם מלא, ת.ז)", correct: false },
      { name: "הגדרת המשימה הקלינית (Task)", correct: true },
      { name: "ברכת נימוסין ממושכת למחשב", correct: false },
      { name: "הקשר רפואי מלא ללא פרטים מזהים (Context)", correct: true },
      { name: "קביעת מבנה הפלט הרצוי (Format)", correct: true }
    ],
    requiredCount: 4,
    feedbackSuccess: "קוד הפרומפט זוהה! ROLE, TASK, CONTEXT, FORMAT - שילוב מנצח ללא הפרת חיסיון המטופל. השער נפתח!",
    feedbackFail: "קוד שגוי. הזנת פרטים מזהים מפרה חיסיון, וברכות נימוסין אינן רכיב הכרחי ליציבות הפלט. נסו שוב!"
  },
  {
    indexLabel: "דלת 8: פרוטוקול פעולה מעשי (Human-in-the-Loop)",
    type: "puzzle",
    question: "אתגר שער הכספת: בחרו את 3 הפעולות הבטוחות המהוות את קו ההגנה האחרון של האדם (Human-in-the-Loop) בעבודה עם AI:",
    nodes: [
      { name: "ביצוע הצלבת מידע ותיקוף המלצות מול נהלים רשמיים וספרות מבוססת ראיות", correct: true },
      { name: "שמירה קפדנית על חיסיון מטופלים והזנת תיאורים כלליים בלבד", correct: true },
      { name: "הטמעת עוזרים מחלקתיים אוטונומיים (Gems) המוזנים בנהלים רשמיים", correct: true },
      { name: "הסתמכות מלאה ועיוורת על כל המלצת מכונה ללא בדיקה", correct: false },
      { name: "העתקה והדבקה ישירה של פלטי AI לתיק המטופל ללא קריאה או בקרה", correct: false }
    ],
    requiredCount: 3,
    feedbackSuccess: "הכספת נפתחה! ניווטתם בהצלחה בכל שערי הבקרה, האתיקה וההלכה בעידן ה-AI!",
    feedbackFail: "מערכת נעולה. זכרו כי הסתמכות עיוורת או העתקה ישירה ללא בקרה מפרה את עקרונות הבטיחות והאחריות. נסו שוב!"
  }
];

// Audio Context for sound synthesis
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playSound(type) {
  if (!state.soundEnabled) return;
  initAudio();
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  const now = audioCtx.currentTime;
  
  if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
    osc.start(now);
    osc.stop(now + 0.08);
  } else if (type === 'success') {
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g);
      g.connect(audioCtx.destination);
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, now + i * 0.08);
      g.gain.setValueAtTime(0.1, now + i * 0.08);
      g.gain.linearRampToValueAtTime(0.005, now + i * 0.08 + 0.25);
      o.start(now + i * 0.08);
      o.stop(now + i * 0.08 + 0.25);
    });
  } else if (type === 'error') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.linearRampToValueAtTime(70, now + 0.3);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'unlock') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.3);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

// DOM Elements
const elements = {
  screenLogin: document.getElementById('screen-login'),
  screenIntro: document.getElementById('screen-intro'),
  screenRooms: document.getElementById('screen-rooms'),
  screenVictory: document.getElementById('screen-victory'),
  hud: document.getElementById('game-hud'),
  currentDoorIndicator: document.getElementById('current-door-indicator'),
  btnToggleSound: document.getElementById('btn-toggle-sound'),
  svgVolumeOn: document.getElementById('svg-volume-on'),
  svgVolumeOff: document.getElementById('svg-volume-off'),
  hudDotsContainer: document.getElementById('hud-dots-container'),
  
  // Game Play elements
  questionIndexLabel: document.getElementById('question-index-label'),
  questionText: document.getElementById('question-text'),
  room3dContainer: document.getElementById('room-3d-container'), // The 3D Room Box
  doorsContainer: document.getElementById('doors-container'), // The Back Wall
  feedbackPanel: document.getElementById('feedback-panel'),
  feedbackText: document.getElementById('feedback-text'),
  feedbackActionArea: document.getElementById('feedback-action-area'),
  btnNextQuestion: document.getElementById('btn-next-question'),
  
  // Passcode & Final Code elements
  passcodeInput: document.getElementById('passcode-input'),
  passcodeErrorMsg: document.getElementById('passcode-error-msg'),
  finalCodeValue: document.getElementById('final-code-value'),
  finalScoreText: document.getElementById('final-score-text'),
  
  // Transition elements
  transitionOverlay: document.getElementById('transition-overlay'),

  // General actions
  btnSubmitPasscode: document.getElementById('btn-submit-passcode'),
  btnStartGame: document.getElementById('btn-start-game'),
  btnRestart: document.getElementById('btn-restart')
};

// Initialize Application
function init() {
  setupEventListeners();
  generateHUDDots();
}

// Generate the 8 dots in HUD
function generateHUDDots() {
  elements.hudDotsContainer.innerHTML = '';
  for (let i = 0; i < questionsData.length; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.setAttribute('data-question', i);
    elements.hudDotsContainer.appendChild(dot);
  }
}

// Update the HUD displays
function updateHUD() {
  elements.currentDoorIndicator.innerText = 'דלת ' + (state.currentQuestionIndex + 1) + ' מתוך ' + questionsData.length;
  
  const dots = elements.hudDotsContainer.querySelectorAll('.dot');
  dots.forEach((dot, idx) => {
    dot.className = 'dot';
    if (idx === state.currentQuestionIndex) {
      dot.classList.add('active');
    } else if (state.selections[idx] !== null) {
      dot.classList.add('completed');
    }
  });
}

// Event Listeners Setup
function setupEventListeners() {
  // Passcode submit click
  elements.btnSubmitPasscode.addEventListener('click', () => {
    const passcode = elements.passcodeInput.value.trim();
    if (passcode === '2026') {
      elements.passcodeErrorMsg.classList.add('hidden');
      playSound('unlock');
      
      // Go to briefing screen
      showScreen(elements.screenIntro);
    } else {
      playSound('error');
      elements.passcodeErrorMsg.classList.remove('hidden');
      elements.passcodeInput.style.borderColor = 'var(--alert-neon)';
      elements.passcodeInput.style.boxShadow = '0 0 10px var(--alert-glow)';
    }
  });

  // Start Game click (Briefing page "התחל")
  elements.btnStartGame.addEventListener('click', () => {
    playSound('click');
    showScreen(elements.screenRooms);
    elements.hud.classList.remove('hidden');
    
    state.currentQuestionIndex = 0;
    state.selections.fill(null);
    generateHUDDots();
    loadQuestion(0);
  });
  
  // Sound toggle click
  elements.btnToggleSound.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) {
      elements.svgVolumeOn.classList.remove('hidden');
      elements.svgVolumeOff.classList.add('hidden');
      playSound('click');
    } else {
      elements.svgVolumeOn.classList.add('hidden');
      elements.svgVolumeOff.classList.remove('hidden');
    }
  });

  // Next question click (with 3D Room Box walking zoom transition)
  elements.btnNextQuestion.addEventListener('click', () => {
    if (!state.activeSelectionActive) return;
    
    const qData = questionsData[state.currentQuestionIndex];
    
    if (qData.type === 'doors') {
      const choice = state.selections[state.currentQuestionIndex];
      const selectedDoor = qData.doors[choice];
      
      if (!selectedDoor.correct) {
        // Shaking incorrect door card and let them try again!
        playSound('error');
        const card = document.getElementById("door-card-" + choice);
        card.classList.add('door-locked-shake');
        setTimeout(() => card.classList.remove('door-locked-shake'), 500);
        
        elements.feedbackPanel.className = 'feedback-panel incorrect';
        elements.feedbackText.innerText = selectedDoor.explanation;
        return;
      }
      
      // Correct answer door - open it and advance!
      state.activeSelectionActive = false; // Block clicks during walking animation
      const card = document.getElementById("door-card-" + choice);
      const container = card.parentElement;
      
      playSound('unlock');
      container.classList.add('correct-unlocked');
      card.classList.add('door-opened');
      
      // Zoom camera forward
      elements.room3dContainer.classList.add("zoom-door-" + choice);
      
      triggerCorridorTransition();
      
    } else if (qData.type === 'puzzle') {
      // Validate puzzle nodes
      let correctSelected = 0;
      let wrongSelected = 0;
      
      qData.nodes.forEach((node, idx) => {
        const isSelected = state.puzzleSelections.includes(idx);
        if (isSelected && node.correct) correctSelected++;
        if (isSelected && !node.correct) wrongSelected++;
      });
      
      const buttons = document.querySelectorAll('.puzzle-node-btn');
      
      if (correctSelected === qData.requiredCount && wrongSelected === 0) {
        // Puzzle solved!
        state.activeSelectionActive = false; // block clicks
        buttons.forEach((btn, idx) => {
          if (qData.nodes[idx].correct) btn.classList.add('correct-glow');
        });
        
        playSound('unlock');
        state.selections[state.currentQuestionIndex] = 1; // mark complete in tracker
        
        // zoom forward (central zoom animation)
        elements.room3dContainer.classList.add("zoom-door-1");
        
        triggerCorridorTransition();
      } else {
        // Failed puzzle
        buttons.forEach((btn, idx) => {
          if (btn.classList.contains('selected')) {
            if (qData.nodes[idx].correct) {
              btn.classList.add('correct-glow');
            } else {
              btn.classList.add('incorrect-glow');
            }
          }
        });
        
        playSound('error');
        elements.feedbackPanel.className = 'feedback-panel incorrect';
        elements.feedbackText.innerText = qData.feedbackFail;
        
        // Reset selections after a short delay
        setTimeout(() => {
          buttons.forEach(btn => btn.className = 'puzzle-node-btn');
          state.puzzleSelections = [];
          elements.feedbackPanel.className = 'feedback-panel idles';
          elements.feedbackText.innerText = `נבחרו 0 מתוך ${qData.requiredCount} רכיבים. בחרו את הרכיבים הנכונים ולחצו "אמת קוד".`;
        }, 2200);
      }
    }
  });

  // Restart click
  elements.btnRestart.addEventListener('click', () => {
    playSound('click');
    location.reload();
  });
}

function triggerCorridorTransition() {
  const transitionImages = [
    'clinic_corridor.png',
    'clinic_reception.png',
    'clinic_lab.png',
    'clinic_scanner.png',
    'clinic_server.png',
    'clinic_icu.png',
    'clinic_gate.png',
    'clinic_vault.png'
  ];
  
  const nextImg = transitionImages[state.currentQuestionIndex % transitionImages.length];
  const bgElement = elements.transitionOverlay.querySelector('.transition-bg');
  if (bgElement) {
    bgElement.style.backgroundImage = "url('" + nextImg + "')";
  }
  
  // Show full-screen corridor transition
  setTimeout(() => {
    elements.transitionOverlay.classList.remove('hidden');
    elements.transitionOverlay.classList.add('active');
  }, 300);
  
  setTimeout(() => {
    const nextIndex = state.currentQuestionIndex + 1;
    if (nextIndex < questionsData.length) {
      loadQuestion(nextIndex);
      
      // emerging walk-out effect in next room
      elements.room3dContainer.className = 'room-3d fade-enter';
      elements.room3dContainer.offsetHeight; // Force reflow
      elements.room3dContainer.classList.remove('fade-enter');
      
      elements.transitionOverlay.classList.remove('active');
      setTimeout(() => {
        elements.transitionOverlay.classList.add('hidden');
        state.activeSelectionActive = true;
      }, 400);
    } else {
      // Game victory!
      elements.transitionOverlay.classList.remove('active');
      setTimeout(() => {
        elements.transitionOverlay.classList.add('hidden');
        showScreen(elements.screenVictory);
        elements.hud.classList.add('hidden');
        playSound('success');
        state.activeSelectionActive = true;
      }, 400);
    }
  }, 1400);
}

// Navigation helper
function showScreen(screen) {
  elements.screenLogin.classList.add('hidden');
  elements.screenLogin.classList.remove('active');
  elements.screenIntro.classList.add('hidden');
  elements.screenIntro.classList.remove('active');
  elements.screenRooms.classList.add('hidden');
  elements.screenRooms.classList.remove('active');
  elements.screenVictory.classList.add('hidden');
  elements.screenVictory.classList.remove('active');
  
  screen.classList.remove('hidden');
  screen.classList.add('active');
}

// Load a Question into the view
function loadQuestion(index) {
  state.currentQuestionIndex = index;
  state.activeSelectionActive = true;
  state.puzzleSelections = [];
  updateHUD();
  
  // Reset room box container class
  elements.room3dContainer.className = 'room-3d';
  
  const qData = questionsData[index];
  
  elements.questionIndexLabel.innerText = qData.indexLabel;
  elements.questionText.innerText = qData.question;
  
  // Reset feedback panel
  elements.feedbackPanel.className = 'feedback-panel idles';
  
  if (qData.type === 'doors') {
    elements.feedbackText.innerText = "בחרו בדלת בעלת התשובה הנכונה ביותר...";
    elements.feedbackActionArea.classList.add('hidden');
    
    // Render doors
    elements.doorsContainer.innerHTML = '';
    
    qData.doors.forEach((door, idx) => {
      const container = document.createElement('div');
      container.className = 'door-container';
      
      container.innerHTML = '<div class="door-frame"></div>' +
          '<div class="door-pathway-glow">🔓</div>' +
          '<div class="door-card" id="door-card-' + idx + '">' +
            '<div class="door-front">' +
              '<div class="door-card-reader"></div>' +
              '<div class="door-screen">' + door.answer + '</div>' +
            '</div>' +
          '</div>';
      
      container.addEventListener('click', () => {
        if (!state.activeSelectionActive) return;
        handleDoorSelection(idx, door);
      });
      
      elements.doorsContainer.appendChild(container);
    });
  } else if (qData.type === 'puzzle') {
    elements.feedbackText.innerText = `נבחרו 0 מתוך ${qData.requiredCount} רכיבים. בחרו את הרכיבים הנכונים ולחצו "אמת קוד".`;
    elements.feedbackActionArea.classList.remove('hidden');
    elements.btnNextQuestion.innerText = 'אמת קוד ➡️';
    
    // Render puzzle board inside the 3D room
    elements.doorsContainer.innerHTML = '';
    
    const board = document.createElement('div');
    board.className = 'puzzle-board-container';
    board.innerHTML = `
      <div class="puzzle-board-header">מערכת קוד בקרה - בחרו את הרכיבים הנכונים</div>
      <div class="puzzle-grid" id="puzzle-grid-nodes"></div>
    `;
    elements.doorsContainer.appendChild(board);
    
    const grid = board.querySelector('#puzzle-grid-nodes');
    
    qData.nodes.forEach((node, idx) => {
      const btn = document.createElement('button');
      btn.className = 'puzzle-node-btn';
      btn.textContent = node.name;
      
      btn.addEventListener('click', () => {
        if (!state.activeSelectionActive) return;
        handleNodeSelection(btn, idx, qData);
      });
      
      grid.appendChild(btn);
    });
  }
}

// Handle clicking a door
function handleDoorSelection(doorIdx, doorData) {
  const cards = elements.doorsContainer.querySelectorAll('.door-card');
  cards.forEach(c => c.classList.remove('selected-door'));
  
  const card = document.getElementById("door-card-" + doorIdx);
  card.classList.add('selected-door');
  
  state.selections[state.currentQuestionIndex] = doorIdx;
  updateHUD();
  
  playSound('click');
  
  elements.feedbackPanel.className = 'feedback-panel idles';
  elements.feedbackText.innerText = 'דלת נבחרה. לחצו \"לפתח את הדלת\" כדי לפתוח אותה ולהתקדם.';
  elements.feedbackActionArea.classList.remove('hidden');
  elements.btnNextQuestion.innerText = 'לפתח את הדלת ➡️';
}

// Handle clicking a puzzle node
function handleNodeSelection(btn, nodeIdx, qData) {
  playSound('click');
  
  if (btn.classList.contains('selected')) {
    btn.classList.remove('selected');
    state.puzzleSelections = state.puzzleSelections.filter(i => i !== nodeIdx);
  } else {
    btn.classList.add('selected');
    state.puzzleSelections.push(nodeIdx);
  }
  
  elements.feedbackPanel.className = 'feedback-panel idles';
  elements.feedbackText.innerText = `נבחרו ${state.puzzleSelections.length} מתוך ${qData.requiredCount} רכיבים. בחרו את הרכיבים הנכונים ולחצו "אמת קוד".`;
}

// Auto start
window.addEventListener('DOMContentLoaded', () => {
  init();
});
