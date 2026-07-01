// Audio Context for sound synthesis (Web Audio API)
class AudioSynth {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playClick() {
    this.init();
    if (!this.ctx) return;
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.005, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    let now = this.ctx.currentTime;
    let notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 chord
    notes.forEach((freq, i) => {
      let o = this.ctx.createOscillator();
      let g = this.ctx.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq, now + i * 0.08);
      g.gain.setValueAtTime(0.08, now + i * 0.08);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
      o.connect(g);
      g.connect(this.ctx.destination);
      o.start(now + i * 0.08);
      o.stop(now + i * 0.08 + 0.35);
    });
  }

  playDanger() {
    this.init();
    if (!this.ctx) return;
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  playFailure() {
    this.init();
    if (!this.ctx) return;
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.6);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.6);
  }

  playUnlock() {
    this.init();
    if (!this.ctx) return;
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.005, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playClack() {
    this.init();
    if (!this.ctx) return;
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1100, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.025);
  }
}

const synth = new AudioSynth();

// EKG Monitor Live Canvas Drawing
class EKGMonitor {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.points = [];
    this.x = 0;
    this.animationId = null;
    this.speed = 2;
    this.heartRate = 72;
    this.pulseTimer = 0;
    this.isDead = false;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (this.canvas) {
      const rect = this.canvas.parentNode.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }
  }

  setHeartRate(hr) {
    this.heartRate = hr;
  }

  setDead(isDead) {
    this.isDead = isDead;
    if (isDead) this.heartRate = 0;
  }

  start() {
    const draw = () => {
      this.ctx.fillStyle = 'rgba(4, 5, 13, 0.15)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.015)';
      this.ctx.lineWidth = 1;
      for (let i = 0; i < this.canvas.width; i += 20) {
        this.ctx.beginPath();
        this.ctx.moveTo(i, 0);
        this.ctx.lineTo(i, this.canvas.height);
        this.ctx.stroke();
      }
      for (let j = 0; j < this.canvas.height; j += 20) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, j);
        this.ctx.lineTo(this.canvas.width, j);
        this.ctx.stroke();
      }

      this.ctx.beginPath();
      this.ctx.strokeStyle = this.isDead ? 'rgba(255, 23, 68, 0.85)' : 'rgba(0, 229, 255, 0.85)';
      this.ctx.lineWidth = 2.5;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = this.isDead ? 'rgba(255, 23, 68, 0.4)' : 'rgba(0, 229, 255, 0.4)';
      
      let cy = this.canvas.height / 2;
      this.pulseTimer += this.isDead ? 0 : (this.heartRate / 60) * 0.07;
      let wave = 0;
      
      if (!this.isDead) {
        let t = this.pulseTimer % Math.PI;
        if (t < 0.2) {
          wave = Math.sin(t * Math.PI / 0.2) * 3;
        } else if (t >= 0.2 && t < 0.3) {
          wave = -Math.sin((t - 0.2) * Math.PI / 0.1) * 2;
        } else if (t >= 0.3 && t < 0.45) {
          wave = Math.sin((t - 0.3) * Math.PI / 0.15) * 28;
        } else if (t >= 0.45 && t < 0.55) {
          wave = -Math.sin((t - 0.45) * Math.PI / 0.1) * 10;
        } else if (t >= 0.55 && t < 0.8) {
          wave = Math.sin((t - 0.55) * Math.PI / 0.25) * 5;
        } else {
          wave = 0;
        }
      } else {
        wave = (Math.random() - 0.5) * 0.6;
      }
      
      let py = cy - wave;
      this.points.push({ x: this.x, y: py });
      if (this.points.length > this.canvas.width / this.speed) {
        this.points.shift();
      }
      
      for (let i = 0; i < this.points.length; i++) {
        let p = this.points[i];
        let drawX = (p.x - this.x) + this.canvas.width - 20;
        if (i === 0) {
          this.ctx.moveTo(drawX, p.y);
        } else {
          this.ctx.lineTo(drawX, p.y);
        }
      }
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
      
      this.x += this.speed;
      this.animationId = requestAnimationFrame(draw);
    };
    
    draw();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// 8 Scenario Questions Database
const questionsData = [
  {
    indexLabel: "דלת 1: חזון הרמב\"ם והגולם מפראג",
    slide: "slide29.png",
    type: "doors",
    question: "בהרצאה הוזכר חזון האוטומציה של הרמב\"ם (המאה ה-12) מול משל 'הגולם מפראג' (המאה ה-16). מהו הלקח המרכזי משילוב שני הרעיונות הללו לגבי שימוש ב-AI ברפואה?",
    doors: [
      {
        answer: "ה-AI צריך להחליף לחלוטין את הצוות הסיעודי כדי להגיע לאוטופיה של הרמב\"ם.",
        correct: false,
        explanation: "לא, הרמב\"ם חזה הקלה בעמל האדם, אך משל הגולם מלמד אותנו שאין לוותר על המרכיב האנושי."
      },
      {
        answer: "יש להשתמש באוטומציה להפחתת עמל האדם (הרמב\"ם), אך להיזהר מיצירת כלי מורכב ללא נשמה ואמפתיה (הגולם) שעלול להזיק. 🗝️",
        correct: true,
        explanation: "נכון מאוד! שילוב של קדמה טכנולוגית מקילה (הרמב\"ם) עם מודעות ופיקוח אתי מבוסס נשמה ואנושיות (הגולם)."
      },
      {
        answer: "ההלכה אוסרת לחלוטין על שימוש בטכנולוגיות המדמות תבונה אנושית או יוצרות אוטומציה.",
        correct: false,
        explanation: "לא נכון, מחשבת ההלכה מעודדת רפואה וקדמה כל עוד הן שומרות על ערך החיים ומונעות סבל."
      }
    ],
    bridgeTitle: "הגשר למושב הבא ב-10:10:",
    bridgeText: "בחירה זו מובילה אותנו ישירות למושב הבא: **סיעוד דיגיטלי חכם - AI**."
  },
  {
    indexLabel: "דלת 2: טעות הסוסים ומדד האפליקביליות",
    slide: "slide9.png",
    type: "doors",
    question: "מהי 'טעות הסוסים' (1900) וכיצד היא מתקשרת לדו\"ח מיקרוסופט (אוגוסט 2025) על שוק העבודה בעידן ה-AI?",
    doors: [
      {
        answer: "ה-AI משפר את פריון השריר האנושי בלבד, כפי שהמנוע עשה לסוסים בעבר.",
        correct: false,
        explanation: "לא, המנוע החליף את השריר, בעוד ה-AI מחליף את המוח והחשיבה."
      },
      {
        answer: "ה-AI מחליף את המוח והשפה האנושית (כפי שהמנוע החליף את השריר של הסוסים), ומאפשר אוטומציה דווקא של מקצועות מבוססי מידע וצווארון לבן. 🗝️",
        correct: true,
        explanation: "נכון מאוד! ה-AI הוא מהפכת פריון המוח והמידע, ולכן פוגע קודם כל במקצועות מבוססי טקסט ותכנון."
      },
      {
        answer: "ה-AI פוגע בעיקר במקצועות פיזיים של צווארון כחול ומחליף את המגע הידני של האחות.",
        correct: false,
        explanation: "לא נכון, מקצועות הדורשים תנועה ומגע פיזי מורכב הם העמידים ביותר בפני אוטומציה."
      }
    ],
    bridgeTitle: "הגשר למושב הבא ב-11:20:",
    bridgeText: "הבנת מהפכת ה-AI קוגניטיבית מעבירה אותנו למושב הבא: **הלכה למעשה בטיפול הרפואי**."
  },
  {
    indexLabel: "דלת 3: היפוך פירמידת הסיכון ועמידות הסיעוד",
    slide: "slide64.png",
    type: "doors",
    question: "על פי תובנות הכנס, מדוע מקצוע הסיעוד מוגדר ברמת סיכון אפסית להחלפה על ידי AI בטווח הנראה לעין?",
    doors: [
      {
        answer: "כי אחיות זקוקות לשילוב של נוכחות פיזית, שיפוט קליני דינמי, ניהול סיכונים בזמן אמת, מגע אנושי ואמפתיה. 🗝️",
        correct: true,
        explanation: "נכון מאוד! הליבה הסיעודית משלבת פיזיות ורגש שלא ניתנים לשכפול אלגוריתמי כיום."
      },
      {
        answer: "כי העבודה הסיעודית מיושנת ואינה כוללת משימות משרדיות או שימוש במחשבים.",
        correct: false,
        explanation: "לא נכון, האחות עוברת מ'אחות מבצעת' ל'מנהלת מערכת חכמה' (Orchestrator) המשלבת מחשוב רב."
      },
      {
        answer: "כי ה-AI אינו מסוגל לאבחן מחלות או לתת המלצות תרופתיות כלל.",
        correct: false,
        explanation: "לא מדויק, ה-AI מנבא ומאבחן בדיוק רב, אך חסר לו הממד הטיפולי-פיזי והליווי האנושי."
      }
    ],
    bridgeTitle: "הגשר למושב הבא ב-12:10:",
    bridgeText: "חוזק המקצוע מאפשר לנו להוביל את המושב הבא: **קבלת החלטות אתיות ותומכות החלטה**."
  },
  {
    indexLabel: "דלת 4: מציאות קלינית וחסימת הכלים בישראל",
    slide: "slide70.png",
    type: "doors",
    question: "בסוף יוני 2026 הורה משרד הבריאות על חסימה מוחלטת של גישה לכלי AI חיצוניים ממחשבי בתי החולים עקב איומי סייבר. כיצד על האחיות לפעול?",
    doors: [
      {
        answer: "להפסיק שימוש בטכנולוגיות עזר לחלוטין ולחזור לתיעוד ידני בניירות בלבד.",
        correct: false,
        explanation: "זה עלול לעכב את הטיפול ולפגוע ביעילות ובבטיחות המטופלים במחלקה."
      },
      {
        answer: "להיעזר ב-AI תומך החלטה דרך מכשירים אישיים בלבד, תחת נהלי אבטחה מחמירים וללא הזנת פרטים מזהים של מטופלים. 🗝️",
        correct: true,
        explanation: "נכון מאוד! הגנה על סייבר וחיסיון המטופל תוך שימוש מושכל בכלים מחוץ לרשת הבית-חולימית המאובטחת."
      },
      {
        answer: "להשתמש ברשתות VPN לא מאושרות במחשבי המשרד כדי לעקוף את החסימה.",
        correct: false,
        explanation: "זוהי עבירת אבטחה חמורה ביותר שעלולה לחשוף את בית החולים למתקפות כופר קריטיות."
      }
    ],
    bridgeTitle: "הגשר למושב הבא:",
    bridgeText: "הצורך באבטחה ודיוק מוביל אותנו לבחינת כלי ה-AI עצמם ודילמת המודלים..."
  },
  {
    indexLabel: "דלת 5: דילמת ריבוי המודלים והזיות AI",
    slide: "slide142.png",
    type: "doors",
    question: "הרצת פרומפט וקיבלת המלצות טיפוליות סותרות משלושה מודלים שונים (Gemini, Claude, GPT). מהי הפעולה הקלינית הנכונה ביותר?",
    doors: [
      {
        answer: "לבחור במודל שמציע את הטיפול האגרסיבי והמהיר ביותר כדי למנוע הידרדרות.",
        correct: false,
        explanation: "לא, טיפול אגרסיבי ללא הצלבה עלול לגרום לתופעות לוואי קשות ולנזק מיותר למטופל."
      },
      {
        answer: "להבין את סכנת ה'הזיות' של מודלים, ולבצע הצלבה ותיקוף של המלצות ה-AI מול ספרות מבוססת ראיות ונהלים רשמיים. 🗝️",
        correct: true,
        explanation: "נכון מאוד! הצלבת מידע מול נהלים מאושרים וספרות (כמו OpenEvidence) היא חובה מקצועית."
      },
      {
        answer: "לרשום בתיק הרפואי שה-AI המליץ על טיפול מסוים ובכך להעביר את האחריות למפתחים.",
        correct: false,
        explanation: "חוקית ואתית לא ניתן להעביר אחריות למכונה. האחריות נותרת תמיד על איש הצוות האנושי."
      }
    ],
    bridgeTitle: "הגשר לאתגר הדלת הבאה:",
    bridgeText: "כעת, כדי להתקדם, עלייך לפתור חידת קוד לפתיחת הדלת האלקטרונית!"
  },
  {
    indexLabel: "דלת 6: אתגר הפרומפט הקליני המובנה",
    slide: "slide103.png",
    type: "puzzle",
    question: "אתגר הדלת האלקטרונית: כדי לפתוח את הדלת, בחרי בדיוק את 4 המרכיבים ההכרחיים של פרומפט קליני בטוח ומובנה (לפי חוקי הפרומפטולוגיה הקלינית שנלמדו):",
    nodes: [
      { name: "הגדרת תפקיד המערכת (Role)", correct: true },
      { name: "הגדרת המשימה הקלינית (Task)", correct: true },
      { name: "הקשר רפואי מלא ללא פרטים מזהים (Context)", correct: true },
      { name: "קביעת מבנה הפלט הרצוי (Format)", correct: true },
      { name: "ברכת נימוסין ממושכת למודל", correct: false },
      { name: "שם המטופל ומספר תעודת הזהות שלו", correct: false }
    ],
    requiredCount: 4,
    feedbackSuccess: "קוד הפרומפט זוהה! הדלת נפתחה בהצלחה. ROLE, TASK, CONTEXT, FORMAT - שילוב מנצח ללא הפרת חיסיון המטופל.",
    feedbackFail: "קוד שגוי. בחירת פרטים מזהים מפרה את חיסיון המטופל, וברכות נימוסין אינן מרכיב הכרחי ליציבות הפלט. נסי שוב!",
    bridgeTitle: "הגשר למושב הבא ב-11:20:",
    bridgeText: "כתיבת פרומפט נכון מביאה אותנו לדילמות הלכתיות מעשיות בקליניקה..."
  },
  {
    indexLabel: "דלת 7: פיקוח נפש, הלכה ו-Wegovy",
    slide: "slide112.png",
    type: "doors",
    question: "מטופל סוכרתי הנוטל מעכבי SGLT2 ו-Wegovy (Semaglutide - שקף 112) מעוניין לצום ביום כיפור. ה-AI מתריע על סכנת היפוגליקמיה. מהו הפרוטוקול הנכון?",
    doors: [
      {
        answer: "הנחיה לצום כרגיל ללא שינוי, מתוך הנחה שהמצווה תגן עליו מנזק בריאותי קליני.",
        correct: false,
        explanation: "זהו סיכון חיים ממשי שאינו עולה בקנה אחד עם עקרון פיקוח נפש הדוחה צום."
      },
      {
        answer: "תיאום הלכתי-קליני המבוסס על פיקוח נפש: שיתוף סמכות רבנית והתאמת המינונים או הנחיה לצום לשיעורין לפי המלצות איגוד האנדוקרינולוגיה. 🗝️",
        correct: true,
        explanation: "נכון מאוד! שילוב של בטיחות קלינית (מניעת קטואצידוזיס והיפוגליקמיה) והנחיות הלכתיות מותאמות אישית."
      },
      {
        answer: "איסור גורף ללא הסבר, שעלול לגרום לכך שהמטופל יצום בסתר וללא תיאום רפואי.",
        correct: false,
        explanation: "איסור גורף ללא הדרכה דתית-רפואית פוגע באמון ולרוב גורם למטופלים לצום בסתר ולהסתכן."
      }
    ],
    bridgeTitle: "הגשר לאתגר השער האחרון:",
    bridgeText: "נעבור כעת לשער המרכזי של חדר הבקרה - אתגר הכספת האתית!"
  },
  {
    indexLabel: "דלת 8: אתגר הכספת - פרוטוקול הפעולה המעשי",
    slide: "slide157.png",
    type: "puzzle",
    question: "אתגר שער הכספת: בחרי בדיוק את 3 הפעולות הבטוחות המהוות את פרוטוקול הפעולה המעשי והחיוני של האחות (Human-in-the-Loop) בעידן ה-AI:",
    nodes: [
      { name: "שימוש כקו הגנה אחרון המצליב נתוני AI מול נהלים רשמיים", correct: true },
      { name: "שמירה קפדנית על חיסיון מטופלים והזנת תיאורים כלליים בלבד", correct: true },
      { name: "הטמעת עוזרים מחלקתיים מותאמים אישית (Gems) המוזנים בנהלים רשמיים", correct: true },
      { name: "העתקה והדבקה אוטומטית של פלטי AI לתיק המטופל ללא קריאה", correct: false },
      { name: "הסתמכות מלאה על אבחנות AI ללא בקרה אנושית", correct: false }
    ],
    requiredCount: 3,
    feedbackSuccess: "הכספת נפתחה! ניווטת בהצלחה בכל 8 השלבים ושמרת על מנהיגות סיעודית אתית, הלכתית וקלינית מנצחת!",
    feedbackFail: "מערכת נעולה. זכרי כי הסתמכות עיוורת או העתקה ישירה ללא בקרה מפרה את עקרונות הבטיחות והאחריות. נסי שוב!",
    bridgeTitle: "הסימולציה הושלמה בהצלחה!",
    bridgeText: "כעת תוכלי לעבור לדו\"ח הבקרה הסופי ולפאנל הסיכום של הכנס."
  }
];

// Game Management State
class Game {
  constructor() {
    this.stats = {
      ai: 50,
      ethics: 50,
      safety: 50
    };
    this.currentStage = 0; // 0: Login, 1: Intro, 2..9: Questions, 10: Victory, 11: Fail
    this.ekg = null;
    this.soundEnabled = true;
    this.selections = new Array(questionsData.length).fill(null);
    this.activeSelectionActive = true;
    this.puzzleSelections = []; // tracks selected nodes in puzzle type questions
    
    this.initDOM();
  }

  initDOM() {
    // Event listeners
    document.getElementById('btn-submit-passcode').addEventListener('click', () => {
      const code = document.getElementById('passcode-input').value.trim();
      if (code === '2026') {
        document.getElementById('passcode-error-msg').classList.add('hidden');
        synth.playUnlock();
        this.currentStage = 1;
        this.showScreen('screen-intro');
      } else {
        synth.playFailure();
        document.getElementById('passcode-error-msg').classList.remove('hidden');
        document.getElementById('passcode-input').style.borderColor = 'var(--neon-rose)';
      }
    });

    document.getElementById('btn-start-game').addEventListener('click', () => {
      synth.playClick();
      this.currentStage = 2;
      document.getElementById('game-hud').classList.remove('hidden');
      this.showScreen('screen-rooms');
      this.loadQuestion(0);
      this.updateHUD();
    });

    document.getElementById('btn-restart').addEventListener('click', () => {
      synth.playClick();
      location.reload();
    });

    document.getElementById('btn-restart-fail').addEventListener('click', () => {
      synth.playClick();
      location.reload();
    });

    document.getElementById('btn-next-question').addEventListener('click', () => {
      this.advanceStage();
    });

    document.getElementById('btn-toggle-sound').addEventListener('click', () => {
      this.soundEnabled = !this.soundEnabled;
      const onIcon = document.getElementById('svg-volume-on');
      const offIcon = document.getElementById('svg-volume-off');
      if (this.soundEnabled) {
        onIcon.classList.remove('hidden');
        offIcon.classList.add('hidden');
        synth.playClick();
      } else {
        onIcon.classList.add('hidden');
        offIcon.classList.remove('hidden');
      }
    });

    // Delegated hover sound click
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.door-container') || e.target.closest('.puzzle-node-btn') || e.target.closest('.btn')) {
        if (this.soundEnabled) synth.playClack();
      }
    });

    // EKG Initialization
    this.ekg = new EKGMonitor('ekg-canvas');
    this.ekg.start();
  }

  showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
  }

  generateHUDDots() {
    const container = document.getElementById('hud-dots-container');
    container.innerHTML = '';
    for (let i = 0; i < questionsData.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'dot';
      container.appendChild(dot);
    }
  }

  updateHUD() {
    this.generateHUDDots();
    document.getElementById('current-door-indicator').innerText = 'דלת ' + (this.currentStage - 1) + ' מתוך ' + questionsData.length;
    
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      dot.className = 'dot';
      let qIdx = this.currentStage - 2;
      if (idx === qIdx) {
        dot.classList.add('active');
      } else if (this.selections[idx] !== null) {
        dot.classList.add('completed');
      }
    });

    // Update gauge bars
    this.setProgressBar('ai-bar', this.stats.ai);
    this.setProgressBar('ethics-bar', this.stats.ethics);
    this.setProgressBar('safety-bar', this.stats.safety);

    // Update EKG heart rate
    let hr = 72;
    if (this.stats.safety < 30) {
      hr = 115;
      if (this.soundEnabled) synth.playDanger();
    } else if (this.stats.safety > 80) {
      hr = 58;
    }
    this.ekg.setHeartRate(hr);
  }

  setProgressBar(barId, val) {
    const bar = document.getElementById(barId);
    bar.style.width = Math.max(0, Math.min(100, val)) + '%';
    document.getElementById(barId.replace('-bar', '-val')).textContent = val + '%';
    
    if (val < 25) {
      bar.classList.add('gauge-warning');
    } else {
      bar.classList.remove('gauge-warning');
    }
  }

  loadQuestion(qIdx) {
    const qData = questionsData[qIdx];
    this.activeSelectionActive = true;
    this.puzzleSelections = [];
    
    // Set slide image
    const slideImg = document.getElementById('slide-img');
    const placeholder = document.getElementById('slide-placeholder');
    if (qData.slide) {
      slideImg.src = 'slides_by_number/' + qData.slide;
      slideImg.classList.remove('hidden');
      placeholder.classList.add('hidden');
    } else {
      slideImg.classList.add('hidden');
      placeholder.classList.remove('hidden');
    }

    // Set scenario text
    document.getElementById('question-index-label').textContent = qData.indexLabel;
    document.getElementById('question-text').textContent = qData.question;
    
    // Reset feedback panel
    const feedback = document.getElementById('feedback-panel');
    feedback.className = 'feedback-panel idles';
    feedback.querySelector('.feedback-content').textContent = 'בחר בדלת התשובה הנכונה ביותר כדי להתקדם...';
    document.getElementById('feedback-action-area').classList.add('hidden');

    // Load layout depending on type
    const room3d = document.getElementById('room-3d-container');
    room3d.className = 'room-3d';
    
    const doorsContainer = document.getElementById('doors-container');
    doorsContainer.innerHTML = '';

    if (qData.type === 'doors') {
      qData.doors.forEach((door, idx) => {
        const container = document.createElement('div');
        container.className = 'door-container';
        container.innerHTML = `
          <div class="door-frame"></div>
          <div class="door-pathway-glow"><span class="door-success-seal">🔓</span></div>
          <div class="door-card" id="door-card-${idx}">
            <div class="door-front">
              <div class="door-card-reader"></div>
              <div class="door-screen">${door.answer}</div>
            </div>
          </div>
        `;
        
        container.addEventListener('click', () => {
          if (!this.activeSelectionActive) return;
          this.handleDoorClick(idx, door);
        });
        
        doorsContainer.appendChild(container);
      });
    } else if (qData.type === 'puzzle') {
      // Create puzzle board grid in the 3D room
      const board = document.createElement('div');
      board.className = 'puzzle-board-container';
      board.innerHTML = `
        <div class="puzzle-board-header">מערכת קוד בקרה - בחרי את הרכיבים הנכונים</div>
        <div class="puzzle-grid" id="puzzle-grid-nodes"></div>
      `;
      doorsContainer.appendChild(board);
      
      const grid = board.querySelector('#puzzle-grid-nodes');
      qData.nodes.forEach((node, idx) => {
        const btn = document.createElement('button');
        btn.className = 'puzzle-node-btn';
        btn.textContent = node.name;
        btn.addEventListener('click', () => {
          if (!this.activeSelectionActive) return;
          this.handleNodeClick(btn, idx, qData);
        });
        grid.appendChild(btn);
      });
    }
  }

  handleDoorClick(idx, door) {
    const cards = document.querySelectorAll('.door-card');
    cards.forEach(c => c.classList.remove('selected-door'));
    
    const selectedCard = document.getElementById('door-card-' + idx);
    selectedCard.classList.add('selected-door');
    
    this.selections[this.currentStage - 2] = idx;
    this.updateHUD();
    
    synth.playClick();
    
    // Show next button
    const feedback = document.getElementById('feedback-panel');
    feedback.className = 'feedback-panel idles';
    feedback.querySelector('.feedback-content').textContent = 'דלת נבחרה. לחצי "לפתח את הדלת" כדי לפתוח אותה ולהתקדם.';
    document.getElementById('feedback-action-area').classList.remove('hidden');
    document.getElementById('btn-next-question').textContent = 'לפתח את הדלת ➡️';
  }

  handleNodeClick(btn, idx, qData) {
    synth.playClick();
    
    if (btn.classList.contains('selected')) {
      btn.classList.remove('selected');
      this.puzzleSelections = this.puzzleSelections.filter(i => i !== idx);
    } else {
      btn.classList.add('selected');
      this.puzzleSelections.push(idx);
    }
    
    // Show submit button in feedback panel
    const feedback = document.getElementById('feedback-panel');
    feedback.className = 'feedback-panel idles';
    feedback.querySelector('.feedback-content').textContent = `נבחרו ${this.puzzleSelections.length} מתוך ${qData.requiredCount} רכיבים. לחצי "פתח את השער" כדי לאמת.`;
    document.getElementById('feedback-action-area').classList.remove('hidden');
    document.getElementById('btn-next-question').textContent = 'פתח את השער ➡️';
  }

  advanceStage() {
    if (!this.activeSelectionActive) return;
    
    const qIdx = this.currentStage - 2;
    const qData = questionsData[qIdx];
    
    if (qData.type === 'doors') {
      const choice = this.selections[qIdx];
      const door = qData.doors[choice];
      
      if (door.correct) {
        this.stats.ai = Math.min(100, this.stats.ai + 10);
        this.stats.ethics = Math.min(100, this.stats.ethics + 10);
        this.stats.safety = Math.min(100, this.stats.safety + 10);
        this.updateHUD();
        
        this.animateWalkthrough(choice, qData.bridgeTitle, qData.bridgeText);
      } else {
        // Shaking door and deducting stats
        synth.playFailure();
        const card = document.getElementById('door-card-' + choice);
        card.classList.add('door-locked-shake');
        setTimeout(() => card.classList.remove('door-locked-shake'), 500);
        
        this.stats.safety = Math.max(0, this.stats.safety - 20);
        this.stats.ethics = Math.max(0, this.stats.ethics - 15);
        this.updateHUD();
        
        const feedback = document.getElementById('feedback-panel');
        feedback.className = 'feedback-panel incorrect';
        feedback.querySelector('.feedback-content').textContent = 'הדלת נעולה! ' + door.explanation;
        
        if (this.stats.safety <= 0 || this.stats.ethics <= 0) {
          setTimeout(() => this.showFailScreen(), 1000);
        }
      }
    } else if (qData.type === 'puzzle') {
      // Validate puzzle selections
      let correctSelected = 0;
      let wrongSelected = 0;
      
      qData.nodes.forEach((node, idx) => {
        const isSelected = this.puzzleSelections.includes(idx);
        if (isSelected && node.correct) correctSelected++;
        if (isSelected && !node.correct) wrongSelected++;
      });
      
      const buttons = document.querySelectorAll('.puzzle-node-btn');
      
      if (correctSelected === qData.requiredCount && wrongSelected === 0) {
        // Success
        buttons.forEach((btn, idx) => {
          if (qData.nodes[idx].correct) btn.classList.add('correct-glow');
        });
        
        this.stats.ai = Math.min(100, this.stats.ai + 15);
        this.stats.ethics = Math.min(100, this.stats.ethics + 15);
        this.stats.safety = Math.min(100, this.stats.safety + 15);
        this.updateHUD();
        
        this.selections[qIdx] = 1; // Mark completed in tracker
        
        this.animateWalkthrough(1, qData.bridgeTitle, qData.bridgeText); // central door zoom animation
      } else {
        // Failure
        buttons.forEach((btn, idx) => {
          if (btn.classList.contains('selected')) {
            if (qData.nodes[idx].correct) {
              btn.classList.add('correct-glow');
            } else {
              btn.classList.add('incorrect-glow');
            }
          }
        });
        
        synth.playFailure();
        this.stats.safety = Math.max(0, this.stats.safety - 20);
        this.stats.ethics = Math.max(0, this.stats.ethics - 20);
        this.updateHUD();
        
        const feedback = document.getElementById('feedback-panel');
        feedback.className = 'feedback-panel incorrect';
        feedback.querySelector('.feedback-content').textContent = qData.feedbackFail;
        
        if (this.stats.safety <= 0 || this.stats.ethics <= 0) {
          setTimeout(() => this.showFailScreen(), 1000);
        } else {
          // Allow reset after a short delay
          setTimeout(() => {
            buttons.forEach(btn => btn.className = 'puzzle-node-btn');
            this.puzzleSelections = [];
          }, 2000);
        }
      }
    }
  }

  animateWalkthrough(choiceIdx, bridgeTitle, bridgeText) {
    this.activeSelectionActive = false; // block clicks
    
    // swing door open
    synth.playUnlock();
    const card = document.getElementById('door-card-' + choiceIdx);
    if (card) {
      card.parentElement.classList.add('correct-unlocked');
      card.classList.add('door-opened');
    }
    
    // Zoom/walk forward
    const room3d = document.getElementById('room-3d-container');
    room3d.classList.add('zoom-door-' + choiceIdx);
    
    // Show full-screen portal transition overlay
    const overlay = document.getElementById('transition-overlay');
    const bg = overlay.querySelector('.transition-bg');
    
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
    
    const nextImg = transitionImages[(this.currentStage - 2) % transitionImages.length];
    bg.style.backgroundImage = `url('${nextImg}')`;
    
    setTimeout(() => {
      overlay.classList.add('active');
    }, 300);

    setTimeout(() => {
      const nextIndex = this.currentStage - 2 + 1;
      if (nextIndex < questionsData.length) {
        this.currentStage++;
        this.loadQuestion(nextIndex);
        this.updateHUD();
        
        // emerging walk-out transition
        room3d.className = 'room-3d fade-enter';
        room3d.offsetHeight; // Force reflow
        room3d.classList.remove('fade-enter');
        
        overlay.classList.remove('active');
        this.activeSelectionActive = true;
      } else {
        // Victory!
        overlay.classList.remove('active');
        this.currentStage = 10;
        this.showWinScreen();
        this.activeSelectionActive = true;
      }
    }, 1400);
  }

  showWinScreen() {
    this.showScreen('screen-victory');
    document.getElementById('game-hud').classList.add('hidden');
    synth.playSuccess();
    
    // Determine final code
    let finalCode = "HUMAN IN THE LOOP";
    document.getElementById('final-code-value').innerText = finalCode;
    
    // EKG normal rhythm
    this.ekg.setHeartRate(60);
    this.ekg.setDead(false);
  }

  showFailScreen() {
    this.showScreen('screen-fail');
    document.getElementById('game-hud').classList.add('hidden');
    synth.playFailure();
    
    // Flatline EKG
    this.ekg.setDead(true);
  }
}

// Auto start game engine
window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new Game();
});
