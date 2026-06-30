// Custom Synth for Sci-Fi Retro Sound Effects using Web Audio API
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
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playSuccess() {
    this.init();
    if (!this.ctx) return;
    
    let now = this.ctx.currentTime;
    let notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 chord
    
    notes.forEach((freq, idx) => {
      let osc = this.ctx.createOscillator();
      let gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      
      gain.gain.setValueAtTime(0.08, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.45);
    });
  }

  playDanger() {
    this.init();
    if (!this.ctx) return;
    
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(90, this.ctx.currentTime + 0.3);
    
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  playFailure() {
    this.init();
    if (!this.ctx) return;
    
    let now = this.ctx.currentTime;
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.6);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(now + 0.6);
  }

  playClack() {
    this.init();
    if (!this.ctx) return;
    
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.035);
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
    this.heartRate = 75; // Normal
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
    if (isDead) {
      this.heartRate = 0;
    }
  }

  start() {
    const draw = () => {
      this.ctx.fillStyle = 'rgba(4, 5, 12, 0.15)'; // Trail effect
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Grid lines
      this.ctx.strokeStyle = 'rgba(0, 229, 255, 0.02)';
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

      // Draw EKG pulse line
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.isDead ? 'rgba(255, 23, 68, 0.85)' : 'rgba(0, 229, 255, 0.85)';
      this.ctx.lineWidth = 2.5;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = this.isDead ? 'rgba(255, 23, 68, 0.5)' : 'rgba(0, 229, 255, 0.5)';
      
      let cy = this.canvas.height / 2;
      
      this.pulseTimer += this.isDead ? 0 : (this.heartRate / 60) * 0.07;
      let wave = 0;
      
      if (!this.isDead) {
        let t = this.pulseTimer % Math.PI;
        // Constructing EKG cycle (P, Q, R, S, T waves)
        if (t < 0.2) {
          wave = Math.sin(t * Math.PI / 0.2) * 4; // P wave
        } else if (t >= 0.2 && t < 0.3) {
          wave = -Math.sin((t - 0.2) * Math.PI / 0.1) * 3; // Q wave
        } else if (t >= 0.3 && t < 0.45) {
          wave = Math.sin((t - 0.3) * Math.PI / 0.15) * 35; // R wave (high spike)
        } else if (t >= 0.45 && t < 0.55) {
          wave = -Math.sin((t - 0.45) * Math.PI / 0.1) * 12; // S wave (deep drop)
        } else if (t >= 0.55 && t < 0.8) {
          wave = Math.sin((t - 0.55) * Math.PI / 0.25) * 6; // T wave
        } else {
          wave = 0; // Flat line between beats
        }
      } else {
        // Asystole flatline with tiny hum
        wave = (Math.random() - 0.5) * 0.8;
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
      this.ctx.shadowBlur = 0; // Reset shadow
      
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

// Game Scenarios Data
const scenarios = [
  {
    id: 1,
    badge: "תרחיש 1 - שעה 09:10",
    title: "אתגר הרמב\"ם והאוטומציה במיון",
    text: "הנהלת המרכז הרפואי מציעה לשלב מערכת AI חדשה למיון קבלה (Triage) של מטופלים. המערכת מבוססת על מודל שפה שאומן על מיליוני תיקים רפואיים, ותחליף 80% מזמן מיון האחיות. בהשראת הרמב\"ם (משנה תורה, הלכות מלכים י\"ב): \"קל יהיה לבני האדם למצוא מחייתם... בעמל מעט יגיע לתועלת גדולה\", אך מנגד אנו חוששים לאובדן \"הקשר האנושי\" האחותי. מהי המדיניות שתקבעי?",
    choices: [
      {
        letter: "א",
        text: "אימוץ מלא של ה-AI: המיון יבוצע כולו על ידי המערכת האוטומטית. האחיות יתפנו לטיפול ישיר בלבד.",
        impacts: { ai: 30, ethics: -25, safety: -10 },
        feedback: "ה-AI פועל במהירות שיא, אך המטופלים מרגישים מנוכרים ללא מגע אנושי ראשוני, ומדד הבטיחות יורד בגלל פספוס תסמינים עדינים לא מילוליים. (מכין את הבמה למושב הבא ב-10:10: סיעוד דיגיטלי חכם - AI)."
      },
      {
        letter: "ב",
        text: "שילוב מבוקר (Triage היברידי): ה-AI יסווג מדדים קרים ומסמכים, אך ההחלטה הסופית והמפגש הרגשי יישארו בידי האחות.",
        impacts: { ai: 15, ethics: 20, safety: 15 },
        feedback: "איזון מעולה! הפחתת עומס קוגניטיבי של ניירת (שקף 64) לצד שימור שיפוט דעת אדם והמגע האנושי. (מכין את הבמה למושב הבא ב-10:10: סיעוד דיגיטלי חכם - AI)."
      },
      {
        letter: "ג",
        text: "דחיית המערכת: התבססות מלאה על שיפוט קליני מסורתי ללא סיוע טכנולוגי.",
        impacts: { ai: -20, ethics: 10, safety: -15 },
        feedback: "שימרת את המגע האנושי, אך המחלקה קורסת תחת עומס קבלות אדיר וזמני ההמתנה מתארכים, מה שמסכן מטופלים קריטיים. (מכין את הבמה למושב הבא ב-10:10: סיעוד דיגיטלי חכם - AI)."
      }
    ],
    bridgeTitle: "הגשר למושב הבא בכנס ב-10:10:",
    bridgeText: "בחירה זו מחברת אותנו ישירות למושב הבא: **סיעוד דיגיטלי חכם - AI**. בואי נראה כיצד ה-AI מתמודד עם ניתוח קליני עמוק יותר..."
  },
  {
    id: 2,
    badge: "תרחיש 2 - שעה 10:10",
    title: "דילמת המודלים הרפואיים",
    text: "מטופלת בעלת היסטוריה משפחתית מורכבת מגיעה לבדיקת סיקור. ה-AI מנבא סיכון גבוה לסרטן השד ל-5 השנים הבאות (שקף 50). הרצת את הפרומפט שלך מול 3 מודלים שונים (שקף 142) וקיבלת המלצות סותרות: מודל A מציע טיפול מניעתי אגרסיבי, מודל B ממליץ על מעקב שמרני בלבד, ומודל C מזהיר מפני תופעות לוואי חמורות. כיצד תפעלי?",
    choices: [
      {
        letter: "א",
        text: "ללכת לפי המודל האגרסיבי (מודל A): התחלת טיפול מניעתי תרופתי מיידי כדי למנוע סרטן בכל מחיר.",
        impacts: { ai: 20, ethics: -15, safety: -10 },
        feedback: "מנעת את הסיכון העתידי, אך המטופלת סובלת מתופעות לוואי קשות שפוגעות קשות באיכות חייה ללא בסיס מבוסס-קליניקה מוחלט."
      },
      {
        letter: "ב",
        text: "שקלול והצגת האפשרויות למטופלת: שיתוף המטופלת בדילמה של המודלים וקבלת החלטה משותפת (Shared Decision Making).",
        impacts: { ai: 10, ethics: 25, safety: 15 },
        feedback: "גישה קלינית מעולה! שילוב של אוטונומיית המטופלת, הסבר אתי על מגבלות ה-AI והערכת סיכונים משותפת בהתאם להנחיות. (מכין את הבמה למושב הבא ב-11:20: הלכה למעשה בסיעוד)."
      },
      {
        letter: "ג",
        text: "התעלמות מהמלצות ה-AI: ביצוע סבב בדיקות קליניות מלא מההתחלה ודחיית ממצאי ה-AI כלא מבוססים.",
        impacts: { ai: -25, ethics: -5, safety: 5 },
        feedback: "נמנעת מטעויות AI, אך שלחת את המטופלת לבדיקות פולשניות חוזרות ומיותרות תוך בזבוז משאבי מחלקה והארכת תקופת החרדה שלה. (מכין את הבמה למושב הבא ב-11:20: הלכה למעשה בסיעוד)."
      }
    ],
    bridgeTitle: "הגשר למושב הבא בכנס ב-11:20:",
    bridgeText: "בחירה זו מחברת אותנו ישירות למושב הבא: **הלכה למעשה בסיעוד ורפואה**. נעבור כעת לדילמה פרקטית המשלבת קליניקה, טכנולוגיה ודת..."
  },
  {
    id: 3,
    badge: "תרחיש 3 - שעה 11:20",
    title: "הלכה למעשה: Wegovy וצום יום כיפור",
    text: "מטופל סוכרתי המטופל בתרופות ממשפחת מעכבי SGLT2 וב-Wegovy (Semaglutide 2.4mg - שקף 112) מעוניין לצום ביום כיפור. מערכת ה-AI הקלינית מתריעה על סיכון קריטי להיפוגליקמיה וקטואצידוזיס סוכרתית במהלך הצום. המטופל פונה אלייך לקבלת הנחיה: האם להפסיק זמנית את התרופות, להימנע מהצום, או לצום כרגיל?",
    choices: [
      {
        letter: "א",
        text: "הנחיה לצום כרגיל ללא שינוי בתרופות: כבוד למסורת הדתית של המטופל מעל הכל.",
        impacts: { ai: -10, ethics: 10, safety: -35 },
        feedback: "אסון קליני! המטופל קרס במהלך הצום ומובהל למיון בגלל קטואצידוזיס קשה. פיקוח נפש דוחה הכל, והנחיה כזו מסכנת חיים בניגוד גמור להלכה הקלינית והתורנית."
      },
      {
        letter: "ב",
        text: "הנחיה הלכתית-קלינית משולבת: פנייה לרב המרכז הרפואי בשילוב הנחיות האגודה לאנדוקרינולוגיה (שקף 103) להתאמת מינונים או צום לשיעורין (\"שתייה ואכילה לשיעורין\") במידת הצורך.",
        impacts: { ai: 10, ethics: 25, safety: 20 },
        feedback: "שילוב מנצח של הלכה למעשה! תיאום בין רגולציה קלינית, עקרון פיקוח נפש, רצון המטופל והנחיות המותאמות אישית. (מכין את הבמה למושב הבא ב-12:10: קבלת החלטות אתיות)."
      },
      {
        letter: "ג",
        text: "איסור מוחלט על הצום: פקודה קלינית חד-משמעית לא לצום כלל, תוך התעלמות מהמשמעות הדתית של המטופל.",
        impacts: { ai: 15, ethics: -15, safety: 10 },
        feedback: "שמרת על בטיחותו הפיזית, אך פגעת באמונתו וביחסי האמון איתו. המטופל עשוי להחליט לצום בסתר ללא תיאום ובכך להסתכן אף יותר."
      }
    ],
    bridgeTitle: "הגשר למושב הבא בכנס ב-12:10:",
    bridgeText: "בחירה זו מחברת אותנו ישירות למושב הבא: **קבלת החלטות אתיות וקליניות**. נעבור כעת לאתגר האחרון של מנהיגות סיעודית תחת עומס קוגניטיבי..."
  },
  {
    id: 4,
    badge: "תרחיש 4 - שעה 12:10",
    title: "הפיקוד האתי הסופי",
    text: "במחלקה מתפרץ משבר זיהומי. עקב עומס קוגניטיבי קיצוני, נעזרת ב-NotebookLM ובGemini (שקף 157) כדי לנתח במהירות מאות דפי פרוטוקול רגולציה. המערכת מציעה פרוטוקול טיפולי חדשני ולא מאושר רשמית בארץ שצפוי לעצור את ההתפרצות. ההנהלה לוחצת לקבלת החלטה מהירה. מי נושא באחריות האתית והמשפטית להחלטה?",
    choices: [
      {
        letter: "א",
        text: "אחריות ה-AI והמפתחים: אישור הפרוטוקול וציון ברשומה הרפואית כי הטיפול הוצע על ידי מערכת ה-AI המוסמכת של בית החולים.",
        impacts: { ai: -20, ethics: -30, safety: -20 },
        feedback: "כשל משפטי ואתי חמור! לא ניתן להעביר אחריות קלינית למכונה. החלטה כזו פוגעת בלב ליבו של רישיון האחות והאחריות המקצועית."
      },
      {
        letter: "ב",
        text: "לקיחת אחריות אחותית מלאה (Human-in-the-loop): אישור הפרוטוקול רק לאחר הצלבתו עם מנהל המחלקה, קבלת אישור חריג (טופס 29ג') ושימוש ב-AI ככלי מסייע בלבד.",
        impacts: { ai: 20, ethics: 25, safety: 25 },
        feedback: "מנהיגות קלינית ואתית ברמה הגבוהה ביותר! ה-AI הוא שותף מדהים לייעול הידע, אך המצפן האתי והאחריות הסופית הם תמיד אנושיים. (מוביל למושב הסיום בכנס ב-13:00 - סיכום ופאנל דיון)."
      },
      {
        letter: "ג",
        text: "דחיית המלצת ה-AI והמתנה לפרוטוקול רגיל: סירוב להשתמש בפרוטוקול עד לאישורו הרשמי על ידי משרד הבריאות, גם אם זה ייקח שבועות והזיהום יתפשט.",
        impacts: { ai: -25, ethics: 10, safety: -15 },
        feedback: "פעלת לפי הספר היבש, אך עיכוב הטיפול הוביל להתפשטות הזיהום ולפגיעה קשה במטופלים שניתן היה להציל בעזרת שיקול דעת אמיץ ומושכל."
      }
    ],
    bridgeTitle: "הגשר לפאנל סיכום הכנס ב-13:00:",
    bridgeText: "בחירה זו מסיימת את הסימולציה ומעבירה אותנו ישירות למושב האחרון: **פאנל דיון וסיכום הכנס**. בואי נראה את הדו\"ח המסכם של מפקדת הבקרה!"
  }
];

// Game State
class Game {
  constructor() {
    this.stats = {
      ai: 50,
      ethics: 50,
      safety: 50
    };
    this.currentStage = 0; // 0: Welcome, 1..4: Scenarios, 5: Win, 6: Fail
    this.ekg = null;
    
    this.initDOM();
  }

  initDOM() {
    // Event listeners
    document.getElementById('start-btn').addEventListener('click', () => {
      synth.playClick();
      this.startGame();
    });
    
    document.getElementById('restart-btn-win').addEventListener('click', () => {
      synth.playClick();
      this.resetGame();
    });
    
    document.getElementById('restart-btn-fail').addEventListener('click', () => {
      synth.playClick();
      this.resetGame();
    });
    
    document.getElementById('next-stage-btn').addEventListener('click', () => {
      synth.playClick();
      this.advanceStage();
    });

    // Keyboard simulation typing sound for choice buttons (registered via delegation)
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('.choice-btn') || e.target.closest('.btn')) {
        synth.playClack();
      }
    });

    // Init EKG Canvas
    this.ekg = new EKGMonitor('ekg-canvas');
    this.ekg.start();
  }

  startGame() {
    this.currentStage = 1;
    this.stats = { ai: 50, ethics: 50, safety: 50 };
    this.updateStatsUI();
    this.showScreen('scenario-screen');
    this.loadScenario(0);
    this.updateTimelineUI();
    this.ekg.setHeartRate(75);
    this.ekg.setDead(false);
  }

  resetGame() {
    this.currentStage = 0;
    this.stats = { ai: 50, ethics: 50, safety: 50 };
    this.updateStatsUI();
    this.showScreen('welcome-screen');
    this.updateTimelineUI();
    this.ekg.setHeartRate(75);
    this.ekg.setDead(false);
  }

  showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
  }

  updateStatsUI() {
    // Update numerical displays
    document.getElementById('ai-val').textContent = this.stats.ai + '%';
    document.getElementById('ethics-val').textContent = this.stats.ethics + '%';
    document.getElementById('safety-val').textContent = this.stats.safety + '%';
    
    // Update progress bars
    this.setProgressBar('ai-bar', this.stats.ai);
    this.setProgressBar('ethics-bar', this.stats.ethics);
    this.setProgressBar('safety-bar', this.stats.safety);
    
    // Update EKG rate based on safety and AI balance
    let hr = 75;
    if (this.stats.safety < 30) {
      hr = 120; // Panic state
      synth.playDanger();
    } else if (this.stats.safety > 80) {
      hr = 60; // Calm state
    }
    this.ekg.setHeartRate(hr);
  }

  setProgressBar(barId, val) {
    const bar = document.getElementById(barId);
    bar.style.width = Math.max(0, Math.min(100, val)) + '%';
    
    if (val < 25) {
      bar.classList.add('gauge-warning');
    } else {
      bar.classList.remove('gauge-warning');
    }
  }

  updateTimelineUI() {
    const nodes = document.querySelectorAll('.timeline-node');
    nodes.forEach((node, idx) => {
      node.classList.remove('active', 'completed');
      let nodeStage = idx + 1;
      if (nodeStage === this.currentStage) {
        node.classList.add('active');
      } else if (nodeStage < this.currentStage || this.currentStage > 4) {
        node.classList.add('completed');
      }
    });
  }

  loadScenario(index) {
    const data = scenarios[index];
    document.getElementById('scen-badge').textContent = data.badge;
    document.getElementById('scen-title').textContent = data.title;
    document.getElementById('scen-text').textContent = data.text;
    
    const container = document.getElementById('scen-choices');
    container.innerHTML = '';
    
    data.choices.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerHTML = `
        <span class="choice-letter">${c.letter}</span>
        <span>${c.text}</span>
      `;
      btn.addEventListener('click', () => {
        synth.playClick();
        this.handleChoice(c, data);
      });
      container.appendChild(btn);
    });
  }

  handleChoice(choice, scenario) {
    // Apply impacts
    this.stats.ai = Math.max(0, Math.min(100, this.stats.ai + choice.impacts.ai));
    this.stats.ethics = Math.max(0, Math.min(100, this.stats.ethics + choice.impacts.ethics));
    this.stats.safety = Math.max(0, Math.min(100, this.stats.safety + choice.impacts.safety));
    
    this.updateStatsUI();
    
    // Check Fail condition
    if (this.stats.ai <= 0 || this.stats.ethics <= 0 || this.stats.safety <= 0) {
      this.showFeedback(choice, scenario, true);
      return;
    }
    
    this.showFeedback(choice, scenario, false);
  }

  showFeedback(choice, scenario, isFailure) {
    const feedbackTitle = document.getElementById('fb-title');
    const feedbackText = document.getElementById('fb-text');
    const impactList = document.getElementById('fb-impacts');
    const bridgeBox = document.getElementById('fb-bridge');
    
    impactList.innerHTML = '';
    
    // Display feedback text
    feedbackText.textContent = choice.feedback;
    
    // Display impacts
    const addImpact = (label, val) => {
      if (val !== 0) {
        const item = document.createElement('div');
        item.className = `impact-item ${val > 0 ? 'up' : 'down'}`;
        item.innerHTML = `
          <span>${label} ${val > 0 ? '▲' : '▼'} ${Math.abs(val)}%</span>
        `;
        impactList.appendChild(item);
      }
    };
    
    addImpact('ביטחון AI', choice.impacts.ai);
    addImpact('אתיקה והלכה', choice.impacts.ethics);
    addImpact('בטיחות קלינית', choice.impacts.safety);

    // Setup bridge information
    document.getElementById('fb-bridge-title').textContent = scenario.bridgeTitle;
    document.getElementById('fb-bridge-text').textContent = scenario.bridgeText;

    if (isFailure) {
      synth.playFailure();
      feedbackTitle.textContent = "התראה: המערכת קרסה!";
      feedbackTitle.className = "feedback-status success";
      feedbackTitle.style.color = "var(--neon-rose)";
      feedbackTitle.style.textShadow = "var(--glow-rose)";
      bridgeBox.style.display = 'none';
      document.getElementById('next-stage-btn').textContent = "לדו\"ח הקריסה";
    } else {
      synth.playSuccess();
      feedbackTitle.textContent = "פקודה בוצעה בהצלחה";
      feedbackTitle.className = "feedback-status success";
      feedbackTitle.style.color = "var(--neon-green)";
      feedbackTitle.style.textShadow = "var(--glow-green)";
      bridgeBox.style.display = 'block';
      document.getElementById('next-stage-btn').textContent = "אשר והמשך בלו\"ז הכנס";
    }
    
    this.showScreen('feedback-screen');
  }

  advanceStage() {
    // Check if we were in failure
    if (this.stats.ai <= 0 || this.stats.ethics <= 0 || this.stats.safety <= 0) {
      this.currentStage = 6;
      this.showFailScreen();
      return;
    }

    if (this.currentStage < 4) {
      this.currentStage++;
      this.loadScenario(this.currentStage - 1);
      this.updateTimelineUI();
      this.showScreen('scenario-screen');
    } else {
      this.currentStage = 5;
      this.showWinScreen();
    }
  }

  showWinScreen() {
    this.showScreen('win-screen');
    this.updateTimelineUI();
    
    // Set final stats in win screen summary
    document.getElementById('final-ai-win').textContent = this.stats.ai + '%';
    document.getElementById('final-ethics-win').textContent = this.stats.ethics + '%';
    document.getElementById('final-safety-win').textContent = this.stats.safety + '%';
    
    // Pulse rates flat or normal
    this.ekg.setHeartRate(60);
  }

  showFailScreen() {
    this.showScreen('fail-screen');
    this.updateTimelineUI();
    
    // Set final stats in fail screen summary
    document.getElementById('final-ai-fail').textContent = this.stats.ai + '%';
    document.getElementById('final-ethics-fail').textContent = this.stats.ethics + '%';
    document.getElementById('final-safety-fail').textContent = this.stats.safety + '%';
    
    // Flatline EKG!
    this.ekg.setDead(true);
  }
}

// Instantiate the game once DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new Game();
});
