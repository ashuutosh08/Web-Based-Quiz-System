const STORAGE_KEY = "quizmaster_local_v1";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_ATTEMPTS = 50;
const MAX_SETS = 10;

const STOP_WORDS = new Set([
    "the","a","an","and","or","is","are","was","were","to","for","of","in","on","at","with","by","from","as","it","this","that","these","those","be","been","being","into","than","then","their","there","which","where","what","when","who","whom","why","how"
]);

const BAD_TARGETS = new Set([
    "process","statement","system","thing","things","part","parts","type","types","use","uses","used","using","work","works","working","based","best","select","pick","choose","term","word","answer","options","option","example","info","data","result","results","guide","general","basic","improve","package","subset","include","includes","occur","occurs","make","makes","made","more","less","many","some","most","this","that","these","those"
]);

const ui = {
    introArea: document.getElementById("introArea"),
    introLoginBtn: document.getElementById("introLoginBtn"),
    introSignupBtn: document.getElementById("introSignupBtn"),
    introContinueBtn: document.getElementById("introContinueBtn"),
    introNotLoggedIn: document.getElementById("introNotLoggedIn"),
    introLoggedIn: document.getElementById("introLoggedIn"),
    introUserName: document.getElementById("introUserName"),
    authArea: document.getElementById("authArea"),
    appArea: document.getElementById("appArea"),
    setupArea: document.getElementById("setupArea"),
    showLoginBtn: document.getElementById("showLoginBtn"),
    showSignupBtn: document.getElementById("showSignupBtn"),
    loginForm: document.getElementById("loginForm"),
    signupForm: document.getElementById("signupForm"),
    recoveryForm: document.getElementById("recoveryForm"),
    showRecoveryBtn: document.getElementById("showRecoveryBtn"),
    loadRecoveryQuestionBtn: document.getElementById("loadRecoveryQuestionBtn"),
    recoveryQuestionPreview: document.getElementById("recoveryQuestionPreview"),
    userTitle: document.getElementById("userTitle"),
    logoutBtn: document.getElementById("logoutBtn"),
    exportBtn: document.getElementById("exportBtn"),
    importInput: document.getElementById("importInput"),
    topBar: document.getElementById("topBar"),
    uploadTriggerBtn: document.getElementById("uploadTriggerBtn"),
    resourceInput: document.getElementById("resourceInput"),
    fileMeta: document.getElementById("fileMeta"),
    manualTextInput: document.getElementById("manualTextInput"),
    pasteClipboardBtn: document.getElementById("pasteClipboardBtn"),
    questionCountSelect: document.getElementById("questionCountSelect"),
    difficultySelect: document.getElementById("difficultySelect"),
    timerModeSelect: document.getElementById("timerModeSelect"),
    generateBtn: document.getElementById("generateBtn"),
    statusText: document.getElementById("statusText"),
    reviewArea: document.getElementById("reviewArea"),
    reviewList: document.getElementById("reviewList"),
    startQuizBtn: document.getElementById("startQuizBtn"),
    quizArea: document.getElementById("quizArea"),
    questionCounter: document.getElementById("questionCounter"),
    progressBar: document.getElementById("progressBar"),
    questionCount: document.getElementById("questionCount"),
    timerBadge: document.getElementById("timerBadge"),
    questionText: document.getElementById("questionText"),
    optionsWrap: document.getElementById("optionsWrap"),
    skipBtn: document.getElementById("skipBtn"),
    submitBtn: document.getElementById("submitBtn"),
    resultArea: document.getElementById("resultArea"),
    scoreText: document.getElementById("scoreText"),
    resultMeta: document.getElementById("resultMeta"),
    retryBtn: document.getElementById("retryBtn"),
    uploadNewBtn: document.getElementById("uploadNewBtn"),
    newSetBtn: document.getElementById("newSetBtn"),
    attemptList: document.getElementById("attemptList"),
    attemptsArea: document.getElementById("attemptsArea"),
    scoreHistoryArea: document.getElementById("scoreHistoryArea"),
    scoreHistoryList: document.getElementById("scoreHistoryList"),
    quantityBtns: document.querySelectorAll(".quantityBtn")
};

let store = loadStore();
let activeResource = { fileName: "", fileType: "", fileSize: 0, rawText: "" };
let workingQuestions = [];
let currentSetMeta = null;
let quizState = null;
let timerId = null;
let selectedQuantity = localStorage.getItem("selectedQuantity") || "10";

init();

function init() {
    bindEvents();
    restoreSession();
    displayScoreHistory();
}

function bindEvents() {
    ui.introLoginBtn.addEventListener("click", () => {
        ui.introArea.classList.add("hide");
        ui.authArea.classList.remove("hide");
        switchAuth("login");
    });
    ui.introSignupBtn.addEventListener("click", () => {
        ui.introArea.classList.add("hide");
        ui.authArea.classList.remove("hide");
        switchAuth("signup");
    });
    ui.introContinueBtn.addEventListener("click", () => {
        ui.introArea.classList.add("hide");
        ui.appArea.classList.remove("hide");
            resetWorkspace(true);
    });
    ui.showLoginBtn.addEventListener("click", () => switchAuth("login"));
    ui.showSignupBtn.addEventListener("click", () => switchAuth("signup"));
    ui.showRecoveryBtn.addEventListener("click", () => switchAuth("recovery"));
    ui.loginForm.addEventListener("submit", onLogin);
    ui.signupForm.addEventListener("submit", onSignup);
    ui.loadRecoveryQuestionBtn.addEventListener("click", onLoadRecoveryQuestion);
    ui.recoveryForm.addEventListener("submit", onResetPin);
    ui.logoutBtn.addEventListener("click", onLogout);
    ui.resourceInput.addEventListener("change", onFileSelected);
    if (ui.manualTextInput) ui.manualTextInput.addEventListener("input", onManualTextChanged);
    if (ui.pasteClipboardBtn) ui.pasteClipboardBtn.addEventListener("click", onPasteClipboard);
    ui.quantityBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            ui.quantityBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            selectedQuantity = btn.dataset.quantity;
            localStorage.setItem("selectedQuantity", btn.dataset.quantity);
        });
    });
    ui.generateBtn.addEventListener("click", onGenerateQuestions);
    if (ui.startQuizBtn) ui.startQuizBtn.addEventListener("click", onStartQuizClicked);
    ui.skipBtn.addEventListener("click", skipQuestion);
    ui.submitBtn.addEventListener("click", submitQuiz);
    ui.retryBtn.addEventListener("click", startQuiz);
    if (ui.uploadNewBtn) ui.uploadNewBtn.addEventListener("click", goToNewResource);
    if (ui.newSetBtn) ui.newSetBtn.addEventListener("click", backToGenerator);
    ui.exportBtn.addEventListener("click", exportBackup);
    ui.importInput.addEventListener("change", importBackup);
}

function switchAuth(mode) {
    animatePulse(ui.authArea, "flowFlash");
    ui.loginForm.classList.toggle("hide", mode !== "login");
    ui.signupForm.classList.toggle("hide", mode !== "signup");
    ui.recoveryForm.classList.toggle("hide", mode !== "recovery");
    ui.showLoginBtn.classList.toggle("active", mode === "login");
    ui.showSignupBtn.classList.toggle("active", mode === "signup");
}

function animatePulse(node, className) {
    if (!node) return;
    node.classList.remove(className);
    // Force reflow for replayable transition animation.
    void node.offsetWidth;
    node.classList.add(className);
}

function notify(message) {
    alert(message);
}

function setStatus(message, isError = false) {
    if (!ui.statusText) return;
    ui.statusText.textContent = message;
    ui.statusText.classList.toggle("statusError", isError);
    ui.statusText.classList.toggle("statusOk", !isError);
}

function loadStore() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { profiles: [], currentUserId: null };
        const parsed = JSON.parse(raw);
        return {
            profiles: Array.isArray(parsed.profiles) ? parsed.profiles : [],
            currentUserId: parsed.currentUserId || null
        };
    } catch {
        return { profiles: [], currentUserId: null };
    }
}

function saveStore() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function loadCurrentProfile() {
    return store.profiles.find((profile) => profile.id === store.currentUserId) || null;
}

function normalizeProfile(profile) {
    profile.attempts = Array.isArray(profile.attempts) ? profile.attempts : [];
    profile.generatedSets = Array.isArray(profile.generatedSets) ? profile.generatedSets : [];
    return profile;
}

function restoreSession() {
    const profile = loadCurrentProfile();
    if (profile) {
        openApp(profile);
        initializeQuantityButton();
        displayScoreHistory();
    } else {
        ui.introArea.classList.remove("hide");
        ui.authArea.classList.add("hide");
        ui.appArea.classList.add("hide");
        switchAuth("login");
    }
}

function updateIntroUIState() {
    const profile = loadCurrentProfile();
    if (profile) {
        // User is logged in
        ui.introNotLoggedIn.classList.add("hide");
        ui.introLoggedIn.classList.remove("hide");
        ui.introUserName.textContent = profile.name;
    } else {
        // User is not logged in
        ui.introNotLoggedIn.classList.remove("hide");
        ui.introLoggedIn.classList.add("hide");
    }
}

function simpleHash(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return String(hash);
}

function createId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function onSignup(event) {
    event.preventDefault();
    const name = document.getElementById("signupName").value.trim();
    const email = document.getElementById("signupEmail").value.trim().toLowerCase();
    const pin = document.getElementById("signupPin").value.trim();
    const confirmPin = document.getElementById("signupPinConfirm").value.trim();
    const recoveryQuestion = document.getElementById("recoveryQuestion").value.trim();
    const recoveryAnswer = document.getElementById("recoveryAnswer").value.trim().toLowerCase();

    if (!name || !email || !recoveryQuestion || !recoveryAnswer) return notify("All fields are required.");
    if (!/^\d{4}$/.test(pin) || pin !== confirmPin) return notify("PIN must be exactly 4 digits and match confirmation.");
    if (store.profiles.some((profile) => profile.email === email)) return notify("A profile with this email already exists.");

    const profile = normalizeProfile({
        id: createId("user"),
        name,
        email,
        pinHash: simpleHash(pin),
        recoveryQuestion,
        recoveryAnswerHash: simpleHash(recoveryAnswer),
        createdAt: new Date().toISOString(),
        attempts: [],
        generatedSets: []
    });

    store.profiles.push(profile);
    store.currentUserId = profile.id;
    saveStore();
    ui.signupForm.reset();
    openApp(profile);
}

function onLogin(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const pin = document.getElementById("loginPin").value.trim();
    const profile = store.profiles.find((item) => item.email === email);

    if (!profile) return notify("No profile found for this email.");
    if (profile.pinHash !== simpleHash(pin)) return notify("Invalid PIN.");

    store.currentUserId = profile.id;
    saveStore();
    ui.loginForm.reset();
    openApp(profile);
}

function onLoadRecoveryQuestion() {
    const email = document.getElementById("recoveryEmail").value.trim().toLowerCase();
    const profile = store.profiles.find((item) => item.email === email);
    ui.recoveryQuestionPreview.textContent = profile ? `Recovery Question: ${profile.recoveryQuestion}` : "No profile found for this email.";
}

function onResetPin(event) {
    event.preventDefault();
    const email = document.getElementById("recoveryEmail").value.trim().toLowerCase();
    const answer = document.getElementById("recoveryAnswerInput").value.trim().toLowerCase();
    const newPin = document.getElementById("newPin").value.trim();
    const profile = store.profiles.find((item) => item.email === email);

    if (!profile) return notify("No profile found for this email.");
    if (profile.recoveryAnswerHash !== simpleHash(answer)) return notify("Recovery answer did not match.");
    if (!/^\d{4}$/.test(newPin)) return notify("New PIN must be exactly 4 digits.");

    profile.pinHash = simpleHash(newPin);
    saveStore();
    ui.recoveryForm.reset();
    ui.recoveryQuestionPreview.textContent = "PIN updated successfully.";
    switchAuth("login");
}

function openApp(profile) {
    normalizeProfile(profile);
    ui.introArea.classList.add("hide");
    ui.authArea.classList.add("hide");
    ui.appArea.classList.remove("hide");
    if (ui.scoreHistoryArea) ui.scoreHistoryArea.classList.remove("hide");
    ui.userTitle.textContent = profile.name;
    initializeQuantityButton();
    renderAttempts(profile);
    displayScoreHistory();
    resetWorkspace();
}

function onLogout() {
    store.currentUserId = null;
    saveStore();
    resetWorkspace(true);
    ui.appArea.classList.add("hide");
    ui.authArea.classList.add("hide");
    ui.introArea.classList.remove("hide");
    switchAuth("login");
}

function resetWorkspace(clearResource = false) {
    stopTimer();
    workingQuestions = [];
    currentSetMeta = null;
    quizState = null;
    if (ui.reviewArea) ui.reviewArea.classList.add("hide");
    ui.quizArea.classList.add("hide");
    ui.resultArea.classList.add("hide");
    if (ui.topBar) ui.topBar.classList.remove("hide");
    ui.setupArea.classList.remove("hide");
    if (ui.scoreHistoryArea) ui.scoreHistoryArea.classList.remove("hide");
    if (ui.attemptsArea) ui.attemptsArea.classList.add("hide");
    if (ui.startQuizBtn) {
        ui.startQuizBtn.classList.add("hide");
        ui.startQuizBtn.disabled = true;
    }
    if (clearResource) {
        activeResource = { fileName: "", fileType: "", fileSize: 0, rawText: "" };
        ui.fileMeta.textContent = "No file selected.";
        if (ui.manualTextInput) ui.manualTextInput.value = "";
        if (ui.statusText) ui.statusText.textContent = "";
    }
}

function getManualText() {
    if (!ui.manualTextInput) return "";
    return cleanText(ui.manualTextInput.value || "");
}

function applyManualTextResource(text) {
    activeResource = {
        fileName: "pasted-text",
        fileType: "text",
        fileSize: text.length,
        rawText: text
    };
    if (ui.startQuizBtn) {
        ui.startQuizBtn.classList.add("hide");
        ui.startQuizBtn.disabled = true;
    }
    workingQuestions = [];
    ui.fileMeta.textContent = `Pasted text | ${text.length} chars extracted`;
    setStatus(text.length < 180 ? "Text loaded, but content is short. Add more text for better questions." : "Text ready. Generate questions now.", text.length < 180);
}

function onManualTextChanged() {
    const text = getManualText();
    if (!text) return;
    applyManualTextResource(text);
}

async function onPasteClipboard() {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
        return notify("Clipboard access is not available in this browser. Paste manually into the text box.");
    }
    try {
        const raw = await navigator.clipboard.readText();
        const text = cleanText(raw);
        if (!text) return notify("Clipboard is empty.");
        if (ui.manualTextInput) ui.manualTextInput.value = text;
        applyManualTextResource(text);
        animatePulse(ui.pasteClipboardBtn, "flowFlash");
    } catch (error) {
        console.error(error);
        notify("Clipboard read failed. Paste manually into the text box.");
    }
}

async function onFileSelected(event) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
        ui.resourceInput.value = "";
        return notify("File is too large. Max size is 5 MB.");
    }

    const ext = file.name.toLowerCase().split(".").pop();
    if (ext !== "txt") {
        ui.resourceInput.value = "";
        return notify("Only TXT files are supported.");
    }

    try {
        setStatus("Reading TXT file...");
        const rawText = await file.text();
        const text = cleanText(rawText);

        activeResource = {
            fileName: file.name,
            fileType: ext,
            fileSize: file.size,
            rawText: text
        };
        if (ui.startQuizBtn) {
            ui.startQuizBtn.classList.add("hide");
            ui.startQuizBtn.disabled = true;
        }
        workingQuestions = [];
        ui.fileMeta.textContent = `${file.name} | ${(file.size / 1024).toFixed(1)} KB | ${text.length} chars extracted`;
        if (ui.manualTextInput && !ui.manualTextInput.value.trim()) {
            ui.manualTextInput.value = text;
        }
        animatePulse(ui.uploadTriggerBtn, "flowFlash");
        if (text.length < 180) {
            setStatus("Resource loaded, but extracted text is very short. Add richer content.", true);
        } else {
            setStatus("Resource ready. Generate questions now.");
        }
    } catch (error) {
        console.error(error);
        setStatus("Failed to read file.", true);
        const detail = error && error.message ? ` (${error.message})` : "";
        notify(`Failed to parse file. Use a TXT file or pasted text.${detail}`);
    }
}

function cleanText(text) {
    return text.replace(/\s+/g, " ").replace(/\u0000/g, "").trim();
}

function tokenize(text) {
    return (text.match(/[A-Za-z][A-Za-z\-]{3,}/g) || [])
        .map((word) => word.toLowerCase())
        .filter((word) => !STOP_WORDS.has(word) && !BAD_TARGETS.has(word));
}

function isValidTarget(word, freqMap) {
    if (!word || word.length < 5) return false;
    if (STOP_WORDS.has(word) || BAD_TARGETS.has(word)) return false;
    const freq = freqMap.get(word) || 0;
    return freq >= 1 || word.length >= 8;
}

function splitSentences(text) {
    return text
        .split(/(?<=[.!?])\s+/)
        .map((item) => item.trim())
        .filter((item) => item.length >= 55 && item.length <= 240 && /[a-zA-Z]{3,}/.test(item));
}

function extractTerms(text) {
    const words = tokenize(text);
    const freq = new Map();
    for (const word of words) freq.set(word, (freq.get(word) || 0) + 1);
    return [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([word]) => word);
}

function chooseTarget(sentence, terms) {
    const words = tokenize(sentence);
    const freqMap = new Map(terms.map((term) => [term, 1]));
    const ranked = words.filter((word) => isValidTarget(word, freqMap)).sort((a, b) => b.length - a.length);
    return ranked[0] || terms.find((term) => isValidTarget(term, freqMap)) || null;
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pickQuestionStem(sentence, target, difficulty) {
    const cleanSentence = sanitizeQuestionSentence(sentence);
    const blanked = cleanSentence.replace(new RegExp(`\\b${escapeRegex(target)}\\b`, "i"), "____");
    return blanked.replace(/\s+/g, " ").trim();
}

function sanitizeQuestionSentence(sentence) {
    let text = sentence.replace(/^[\s\u{1F300}-\u{1FAFF}]+/gu, "").trim();
    text = text.replace(/^package\s*\d+\s*:\s*[^.?!]*?(?=\b[A-Z][a-z]+)/i, "").trim();
    text = text.replace(/^topic\s*:\s*[^.?!]*?(?=\b[A-Z][a-z]+)/i, "").trim();
    text = text.replace(/^\s*[A-Za-z][A-Za-z\s&-]*\((?:easy|medium|hard|mixed)\)\s*topic\s*:\s*[A-Za-z][A-Za-z\s&-]*\s+/i, "").trim();
    text = text.replace(/^\s*[A-Za-z][A-Za-z\s&-]*\((?:easy|medium|hard|mixed)\)\s+/i, "").trim();
    text = text.replace(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,6})\s+([A-Z][a-z]+\s+[a-z].*)$/, "$2");
    return text;
}

function similarity(a, b) {
    const ta = new Set(tokenize(a));
    const tb = new Set(tokenize(b));
    if (!ta.size || !tb.size) return 0;
    let shared = 0;
    for (const token of tb) if (ta.has(token)) shared += 1;
    return shared / tb.size;
}

function pickDistractors(answer, terms) {
    const answerText = answer.toLowerCase();
    const answerLength = answerText.length;
    const picks = [];
    for (const term of shuffle(terms.filter((term) => term !== answer))) {
        const lower = term.toLowerCase();
        if (picks.includes(term)) continue;
        if (STOP_WORDS.has(lower) || BAD_TARGETS.has(lower)) continue;
        if (Math.abs(lower.length - answerLength) > 5) continue;
        if (lower.startsWith(answerText.slice(0, 4))) continue;
        picks.push(term);
        if (picks.length === 3) break;
    }
    while (picks.length < 3) {
        const fallback = ["concept", "detail", "factor", "element", "feature", "structure"];
        picks.push(fallback[picks.length]);
    }
    return picks;
}

function shuffle(list) {
    const arr = [...list];
    for (let i = arr.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function qualityPass(question) {
    if (!question.q || question.q.length < 40) return false;
    if (!Array.isArray(question.o) || question.o.length !== 4) return false;
    if (new Set(question.o.map((item) => item.toLowerCase())).size !== 4) return false;
    if (question.o.some((item) => STOP_WORDS.has(item.toLowerCase()) || BAD_TARGETS.has(item.toLowerCase()))) return false;
    if (!question.source || similarity(question.source, question.q) < 0.18) return false;
    const answer = question.o[question.a - 1];
    if (!answer || answer.length < 5) return false;
    if (similarity(question.source, answer) < 0.05 && answer.length < 8) return false;
    return Number.isInteger(question.a) && question.a >= 1 && question.a <= 4;
}

function rankQuestions(questions, sourceText) {
    const sourceTokens = new Set(tokenize(sourceText));
    return [...questions]
        .map((question) => {
            const answer = question.o[question.a - 1] || "";
            const optionDiversity = new Set(question.o.map((item) => item.toLowerCase())).size;
            const sourceOverlap = tokenize(question.source || "").filter((word) => sourceTokens.has(word)).length;
            const stemOverlap = tokenize(question.q).filter((word) => sourceTokens.has(word)).length;
            const score = (sourceOverlap * 3) + stemOverlap + (optionDiversity * 1.2) + Math.min(question.q.length / 140, 1) + Math.min(answer.length / 20, 1);
            return { question, score };
        })
        .sort((a, b) => b.score - a.score)
        .map((item) => item.question);
}

function generateMcqs(text, count, difficulty) {
    const sentences = splitSentences(text);
    const terms = extractTerms(text);
    if (!sentences.length) return [];

    const candidates = [];
    let cursor = 0;
    const maxTries = Math.max(60, count * 20);
    for (let tries = 0; tries < maxTries && candidates.length < count * 2; tries += 1) {
        const sentence = sentences[cursor % sentences.length];
        cursor += 1;
        const target = chooseTarget(sentence, terms);
        if (!target) continue;

        const distractors = pickDistractors(target, terms);
        const options = shuffle([target, ...distractors]);
        const answerIndex = options.findIndex((item) => item === target) + 1;
        const question = {
            id: createId("q"),
            q: pickQuestionStem(sentence, target, difficulty),
            o: options,
            a: answerIndex,
            source: sentence
        };

        if (!qualityPass(question)) continue;
        if (candidates.some((item) => item.q === question.q)) continue;
        candidates.push(question);
    }

    return rankQuestions(candidates, text).slice(0, count);
}

function generateSupplementalMcqs(text, needed, existingQuestions = []) {
    if (needed <= 0) return [];

    const sentences = splitSentences(text);
    const terms = extractTerms(text);
    if (!sentences.length || !terms.length) return [];

    const usedStems = new Set(existingQuestions.map((question) => question.q.toLowerCase()));
    const extra = [];
    let sentenceCursor = 0;
    let termCursor = 0;
    const maxTries = Math.max(120, needed * 80);

    for (let tries = 0; tries < maxTries && extra.length < needed; tries += 1) {
        const sentence = sentences[sentenceCursor % sentences.length];
        const target = terms[termCursor % terms.length];
        sentenceCursor += 1;
        termCursor += 2;

        if (!target || !new RegExp(`\\b${escapeRegex(target)}\\b`, "i").test(sentence)) continue;
        if (target.length < 5) continue;

        const stem = pickQuestionStem(sentence, target, "mixed");
        if (!stem || !stem.includes("____") || stem.length < 30) continue;
        if (usedStems.has(stem.toLowerCase())) continue;

        const distractors = pickDistractors(target, terms).filter((item) => item.toLowerCase() !== target.toLowerCase());
        const options = shuffle([target, ...distractors.slice(0, 3)]);
        if (options.length !== 4 || new Set(options.map((item) => item.toLowerCase())).size !== 4) continue;

        const answerIndex = options.findIndex((item) => item === target) + 1;
        if (answerIndex < 1) continue;

        const question = {
            id: createId("q"),
            q: stem,
            o: options,
            a: answerIndex,
            source: sentence
        };
        if (!qualityPass(question)) continue;

        extra.push(question);
        usedStems.add(stem.toLowerCase());
    }

    return extra;
}

function onGenerateQuestions() {
    const manualText = getManualText();
    if (manualText) applyManualTextResource(manualText);
    if (!activeResource.rawText) return notify("Upload a TXT file or paste text first.");
    animatePulse(ui.generateBtn, "flowFlash");
    const count = parseInt(selectedQuantity) || 10;
    const difficulty = ui.difficultySelect ? ui.difficultySelect.value : "mixed";
    let generated = generateMcqs(activeResource.rawText, count, difficulty);
    if (generated.length < count) {
        const supplemental = generateSupplementalMcqs(activeResource.rawText, count - generated.length, generated);
        generated = [...generated, ...supplemental].slice(0, count);
    }
    if (generated.length < 3) {
        setStatus("Could not generate enough quality questions from this resource.", true);
        return notify("Not enough quality questions could be generated. Try a richer document.");
    }

    workingQuestions = generated;
    currentSetMeta = {
        id: createId("set"),
        createdAt: new Date().toISOString(),
        difficulty,
        timerMode: ui.timerModeSelect ? ui.timerModeSelect.value : "none",
        source: {
            fileName: activeResource.fileName,
            fileType: activeResource.fileType,
            fileSize: activeResource.fileSize,
            chars: activeResource.rawText.length
        }
    };
    setStatus(`Generated ${workingQuestions.length} questions.`);
    if (ui.startQuizBtn) {
        ui.startQuizBtn.disabled = false;
        ui.startQuizBtn.classList.remove("hide");
        animatePulse(ui.startQuizBtn, "specialReveal");
    }
}

function onStartQuizClicked() {
    animatePulse(ui.startQuizBtn, "startAction");
    startQuiz();
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

function startQuiz() {
    if (workingQuestions.length < 3) return notify("Need at least 3 questions to start the quiz.");
    for (const question of workingQuestions) {
        if (!qualityPass(question)) return notify("Some reviewed questions are invalid. Check the answer and options.");
    }

    quizState = {
        questions: workingQuestions.map((question) => ({ ...question, o: [...question.o] })),
        currentIndex: 0,
        score: 0,
        answers: [],
        timerMode: ui.timerModeSelect ? ui.timerModeSelect.value : "none",
        timeLeft: 30,
        totalLeft: workingQuestions.length * 30
    };

    if (quizState.timerMode === "per-question") quizState.timeLeft = 30;
    if (quizState.timerMode === "full-quiz") quizState.totalLeft = quizState.questions.length * 30;

    if (ui.reviewArea) ui.reviewArea.classList.add("hide");
    ui.resultArea.classList.add("hide");
    if (ui.topBar) ui.topBar.classList.add("hide");
    ui.setupArea.classList.add("hide");
    if (ui.attemptsArea) ui.attemptsArea.classList.add("hide");
    if (ui.scoreHistoryArea) ui.scoreHistoryArea.classList.add("hide");
    ui.quizArea.classList.remove("hide");
    saveCurrentSet();
    renderQuestion();
    startTimer();
}

function renderQuestion() {
    const question = quizState.questions[quizState.currentIndex];
    if (!question) return submitQuiz();

    // Update progress tracker
    const currentQ = quizState.currentIndex + 1;
    const totalQ = quizState.questions.length;
    if (ui.questionCounter) {
        ui.questionCounter.textContent = `${currentQ} of ${totalQ}`;
    }
    
    // Update progress bar
    const progressPercent = (currentQ / totalQ) * 100;
    if (ui.progressBar) {
        ui.progressBar.style.width = `${progressPercent}%`;
    }

    ui.questionText.textContent = question.q;
    ui.optionsWrap.innerHTML = "";

    question.o.forEach((option, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "optBtn";
        button.textContent = `${index + 1}) ${option}`;
        button.addEventListener("click", () => pickAnswer(index + 1));
        ui.optionsWrap.appendChild(button);
    });

    updateTimerBadge();
}

function pickAnswer(selected) {
    const question = quizState.questions[quizState.currentIndex];
    const buttons = [...ui.optionsWrap.querySelectorAll(".optBtn")];
    buttons.forEach((button, index) => {
        const optionNumber = index + 1;
        button.disabled = true;
        if (optionNumber === question.a) button.classList.add("correct");
        if (optionNumber === selected && optionNumber !== question.a) button.classList.add("wrong");
    });
    if (selected === question.a) quizState.score += 1;
    quizState.answers.push({ questionId: question.id, selected, correct: question.a });
    setTimeout(nextQuestion, 350);
}

function skipQuestion() {
    if (!quizState) return;
    const question = quizState.questions[quizState.currentIndex];
    quizState.answers.push({ questionId: question.id, selected: null, correct: question.a });
    nextQuestion();
}

function nextQuestion() {
    quizState.currentIndex += 1;
    if (quizState.currentIndex >= quizState.questions.length) return submitQuiz();
    if (quizState.timerMode === "per-question") quizState.timeLeft = 30;
    renderQuestion();
}

function updateTimerBadge() {
    if (!ui.timerBadge) return;
    if (!quizState || quizState.timerMode === "none") {
        ui.timerBadge.textContent = "Timer: Off";
        return;
    }
    ui.timerBadge.textContent = quizState.timerMode === "per-question" ? `Timer: ${quizState.timeLeft}s` : `Timer: ${quizState.totalLeft}s`;
}

function startTimer() {
    stopTimer();
    if (!quizState || quizState.timerMode === "none") {
        updateTimerBadge();
        return;
    }
    timerId = setInterval(() => {
        if (!quizState) return;
        if (quizState.timerMode === "per-question") {
            quizState.timeLeft -= 1;
            if (quizState.timeLeft <= 0) return skipQuestion();
        } else if (quizState.timerMode === "full-quiz") {
            quizState.totalLeft -= 1;
            if (quizState.totalLeft <= 0) return submitQuiz();
        }
        updateTimerBadge();
    }, 1000);
}

function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
}

function submitQuiz() {
    if (!quizState) return;
    stopTimer();
    const profile = loadCurrentProfile();
    if (!profile) return;

    const total = quizState.questions.length;
    const score = quizState.score;
    const attempt = {
        id: createId("attempt"),
        createdAt: new Date().toISOString(),
        score,
        total,
        percent: Math.round((score / total) * 100),
        timerMode: quizState.timerMode,
        sourceFile: currentSetMeta?.source?.fileName || activeResource.fileName || "unknown"
    };

    normalizeProfile(profile);
    profile.attempts.unshift(attempt);
    profile.attempts = profile.attempts.slice(0, MAX_ATTEMPTS);
    saveStore();

    ui.quizArea.classList.add("hide");
    ui.resultArea.classList.remove("hide");
    if (ui.topBar) ui.topBar.classList.add("hide");
    ui.setupArea.classList.add("hide");
    if (ui.attemptsArea) ui.attemptsArea.classList.add("hide");
    if (ui.scoreHistoryArea) ui.scoreHistoryArea.classList.remove("hide");
    ui.scoreText.textContent = `Your Score: ${score}/${total}`;
    ui.resultMeta.textContent = `${attempt.percent}%`;
    saveScoreHistory(attempt);
    displayScoreHistory();
    renderAttempts(profile);
}

function saveCurrentSet() {
    const profile = loadCurrentProfile();
    if (!profile || !currentSetMeta) return;
    normalizeProfile(profile);
    profile.generatedSets.unshift({
        ...currentSetMeta,
        questionCount: workingQuestions.length,
        questions: workingQuestions.map((question) => ({ q: question.q, o: [...question.o], a: question.a }))
    });
    profile.generatedSets = profile.generatedSets.slice(0, MAX_SETS);
    saveStore();
}

function backToGenerator() {
    ui.resultArea.classList.add("hide");
    ui.quizArea.classList.add("hide");
    if (ui.topBar) ui.topBar.classList.remove("hide");
    ui.setupArea.classList.remove("hide");
    if (ui.scoreHistoryArea) ui.scoreHistoryArea.classList.remove("hide");
    if (ui.attemptsArea) ui.attemptsArea.classList.add("hide");
}

function goToNewResource() {
    stopTimer();
    quizState = null;
    workingQuestions = [];
    currentSetMeta = null;
    activeResource = { fileName: "", fileType: "", fileSize: 0, rawText: "" };
    if (ui.resourceInput) ui.resourceInput.value = "";
    if (ui.fileMeta) ui.fileMeta.textContent = "No file selected.";
    if (ui.manualTextInput) ui.manualTextInput.value = "";
    if (ui.startQuizBtn) {
        ui.startQuizBtn.classList.add("hide");
        ui.startQuizBtn.disabled = true;
    }
    
    // Show the intro landing page with proper login state
    ui.appArea.classList.add("hide");
    ui.introArea.classList.remove("hide");
    updateIntroUIState();
}

function renderAttempts(profile) {
    normalizeProfile(profile);
    if (!profile.attempts.length) {
        ui.attemptList.innerHTML = '<p class="mutedText">No attempts yet.</p>';
        return;
    }
    ui.attemptList.innerHTML = profile.attempts.map((attempt) => {
        const date = new Date(attempt.createdAt).toLocaleString();
        return `<div class="attemptItem"><strong>${attempt.score}/${attempt.total}</strong> <span class="mutedText">(${attempt.percent}%)</span><div class="mutedText">${date} | ${attempt.timerMode} | ${attempt.sourceFile}</div></div>`;
    }).join("");
}

function saveScoreHistory(attempt) {
    let history = JSON.parse(localStorage.getItem("scoreHistory")) || [];
    history.unshift({ ...attempt, savedAt: new Date().toISOString() });
    history = history.slice(0, 10);
    localStorage.setItem("scoreHistory", JSON.stringify(history));
}

function initializeQuantityButton() {
    const savedQuantity = localStorage.getItem("selectedQuantity") || "10";
    selectedQuantity = savedQuantity;
    ui.quantityBtns.forEach(btn => {
        if (btn.dataset.quantity === savedQuantity) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

function displayScoreHistory() {
    if (!ui.scoreHistoryList) return;
    let history = JSON.parse(localStorage.getItem("scoreHistory")) || [];
    if (history.length === 0) {
        ui.scoreHistoryList.innerHTML = '<p class="mutedText">No completed quizzes yet.</p>';
        return;
    }
    ui.scoreHistoryList.innerHTML = history.map((score, index) => {
        const date = new Date(score.savedAt);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `<div class="scoreHistoryItem">
            <div class="scoreHistoryRank"><strong>#${index + 1}</strong></div>
            <div class="scoreHistoryScore"><strong>${score.score}/${score.total}</strong> <span>(${score.percent}%)</span></div>
            <div class="scoreHistoryDate"><span class="scoreDate">${formattedDate}</span> <span class="scoreTime">${formattedTime}</span></div>
        </div>`;
    }).join("");
}

function exportBackup() {
    const profile = loadCurrentProfile();
    if (!profile) return;
    const payload = { version: 1, exportedAt: new Date().toISOString(), data: store };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quizmaster-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

async function importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    try {
        const payload = JSON.parse(await file.text());
        if (!payload?.data?.profiles || !Array.isArray(payload.data.profiles)) throw new Error("Invalid backup");
        store = payload.data;
        saveStore();
        restoreSession();
        notify("Backup imported successfully.");
    } catch (error) {
        console.error(error);
        notify("Invalid backup file.");
    } finally {
        ui.importInput.value = "";
    }
}

function onLoginReturn() {}
