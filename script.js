const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const navLinks = [
  ...document.querySelectorAll(".desktop-nav a, .mobile-nav a"),
];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const chatWidget = document.querySelector("[data-chat-widget]");
const chatToggle = document.querySelector("[data-chat-toggle]");
const chatPanel = document.querySelector("[data-chat-panel]");
const chatClose = document.querySelector("[data-chat-close]");
const chatOpenButtons = [...document.querySelectorAll("[data-chat-open]")];
const chatMessages = document.querySelector("[data-chat-messages]");
const chatForm = document.querySelector("[data-chat-form]");
const chatInput = document.querySelector("[data-chat-input]");
const chatSubmit = document.querySelector("[data-chat-submit]");
const chatStatus = document.querySelector("[data-chat-status]");
const chatSuggestions = [
  ...document.querySelectorAll("[data-chat-suggestion]"),
];
const languageSwitcher = document.querySelector("[data-language-switcher]");
const languageButtons = [
  ...document.querySelectorAll("[data-language-button]"),
];
const localHostnames = new Set(["localhost", "127.0.0.1", "::1"]);
const defaultChatApiUrl = localHostnames.has(window.location.hostname)
  ? "http://127.0.0.1:8000/chat"
  : "/api/chat";
const chatApiUrl = window.CV_CHAT_API_URL || defaultChatApiUrl;
const languageStorageKey = "cv-site-language";
const supportedLanguages = new Set(["ru", "en"]);
const originalElementText = new WeakMap();
const originalAttributes = new WeakMap();
const i18n = {
  ru: {
    meta: {
      title: "Егор Кузнецов - ML Engineer",
      description:
        "Егор Кузнецов - ML-инженер, production Computer Vision, NLP, LLM-агенты, RAG и ML-инфраструктура.",
      ogTitle: "Егор Кузнецов - ML Engineer",
      ogDescription:
        "Production ML: Computer Vision, NLP, LLM agents, RAG, инференс и мониторинг.",
    },
    dynamic: {
      closeChat: "Закрыть чат с CV-ботом",
      closeMenu: "Закрыть меню",
      emptyAnswer: "Пустой ответ.",
      fallbackSource: "Раздел резюме",
      languageSwitcherLabel: "Выбор языка",
      localConnectionHint: "Проверьте, что backend доступен по адресу",
      openChat: "Открыть чат с CV-ботом",
      openMenu: "Открыть меню",
      remoteConnectionHint:
        "Проверьте, что CV_CHAT_API_URL задана в Vercel и backend доступен.",
      requestError: "Не удалось получить ответ.",
      sendingStatus: "Бот ищет ответ в резюме...",
      sources: "Источники",
      typing: "Печатает",
      connectionErrorStatus: "Ошибка подключения к чат-боту",
    },
    text: {},
  },
  en: {
    meta: {
      title: "Egor Kuznetsov - ML Engineer",
      description:
        "Egor Kuznetsov is an ML Engineer building production Computer Vision, NLP, LLM agents, RAG, and ML infrastructure.",
      ogTitle: "Egor Kuznetsov - ML Engineer",
      ogDescription:
        "Production ML: Computer Vision, NLP, LLM agents, RAG, inference, and monitoring.",
    },
    dynamic: {
      closeChat: "Close the CV bot chat",
      closeMenu: "Close menu",
      emptyAnswer: "Empty response.",
      fallbackSource: "CV section",
      languageSwitcherLabel: "Language selection",
      localConnectionHint: "Check that the backend is available at",
      openChat: "Open the CV bot chat",
      openMenu: "Open menu",
      remoteConnectionHint:
        "Check that CV_CHAT_API_URL is set in Vercel and the backend is available.",
      requestError: "Could not get a response.",
      sendingStatus: "The bot is looking for an answer in the CV...",
      sources: "Sources",
      typing: "Typing",
      connectionErrorStatus: "Chatbot connection error",
    },
    text: {
      "К содержанию": "Skip to content",
      "Егор Кузнецов, наверх": "Egor Kuznetsov, back to top",
      "Основная навигация": "Main navigation",
      Результаты: "Impact",
      Опыт: "Experience",
      Стек: "Stack",
      Проекты: "Projects",
      Контакты: "Contacts",
      "Открыть меню": "Open menu",
      "Мобильная навигация": "Mobile navigation",
      "Егор Кузнецов": "Egor Kuznetsov",
      "Разрабатываю production ML-системы полного цикла: Computer Vision, NLP, LLM-агенты, RAG, инференс, мониторинг и оценка бизнес-эффекта.":
        "I build end-to-end production ML systems: Computer Vision, NLP, LLM agents, RAG, inference, monitoring, and business impact evaluation.",
      Связаться: "Contact",
      "Скачать CV": "Download CV",
      "Спросить бота": "Ask the bot",
      Фокус: "Focus",
      Локация: "Location",
      Москва: "Moscow",
      Язык: "Language",
      "Результаты, которые уже работают в продукте":
        "Results already running in production",
      пользователей: "users",
      "LLM-агент для анализа совместимости и помощи в общении в dating-продукте.":
        "An LLM agent for compatibility analysis and communication help in a dating product.",
      автоматизации: "automation",
      "CV-модель для модерации пользовательских фото заменила большую часть ручных проверок.":
        "A CV model for user photo moderation replaced most manual reviews.",
      "Улучшение качества внутренней модели и отказ от внешних решений для фото-модерации.":
        "Improved the internal model quality and replaced external solutions for photo moderation.",
      "строк данных": "data rows",
      "SQL-аналитика и Metabase-дашборды для продуктовых и операционных метрик.":
        "SQL analytics and Metabase dashboards for product and operations metrics.",
      "Инженер на стыке моделей, данных и продукта":
        "An engineer at the intersection of models, data, and product",
      "Беру ML-задачи от постановки и подготовки данных до деплоя, мониторинга и измеримого влияния на процесс. Основной опыт - production-решения для Computer Vision, NLP, GenAI и аналитики больших массивов данных.":
        "I take ML tasks from problem framing and data preparation through deployment, monitoring, and measurable process impact. My core experience is in production solutions for Computer Vision, NLP, GenAI, and large-scale data analytics.",
      "В коммерческих проектах внедрял LLM-агентов, RAG-ботов для поддержки, CV-модерацию пользовательского контента, LLM-пайплайны разметки и операционный мониторинг.":
        "In commercial projects, I have shipped LLM agents, RAG support bots, CV moderation for user-generated content, LLM-based labeling pipelines, and operational monitoring.",
      "Коммерческий опыт": "Commercial experience",
      "12.2024 - н.в.": "Dec 2024 - present",
      "ML/DL-разработчик, аналитик данных, GenAI-инженер":
        "ML/DL Developer, Data Analyst, GenAI Engineer",
      "Разработал dating-copilot на базе LLM для 200+ тыс. пользователей.":
        "Built an LLM-based dating copilot for 200k+ users.",
      "Внедрил RAG-чат-ботов для автоматизации поддержки и снижения зависимости от внешних решений.":
        "Introduced RAG chatbots to automate support and reduce dependence on external solutions.",
      "Собрал CV-модель фото-модерации с автоматизацией 80%+ ручных проверок и качеством 0.85+ F1.":
        "Built a CV photo moderation model that automates 80%+ of manual checks with 0.85+ F1 quality.",
      "Запустил LLM-пайплайн категоризации контента, сократив подготовку обучающих датасетов более чем в два раза.":
        "Launched an LLM pipeline for content categorization, cutting training dataset preparation time by more than half.",
      "Строил SQL-аналитику, Metabase-дашборды и мониторинг эффективности поддержки.":
        "Built SQL analytics, Metabase dashboards, and support efficiency monitoring.",
      "МПС Софт": "MPS Soft",
      "C#-разработчик": "C# Developer",
      "Разрабатывал модули для промышленной SCADA-системы и интеграции новых видов оборудования.":
        "Developed modules for an industrial SCADA system and integrations for new equipment types.",
      "Работал с backend-сервисами и промышленными протоколами для надежных production-решений.":
        "Worked with backend services and industrial protocols for reliable production solutions.",
      "Технологический стек": "Technology stack",
      "ML и Deep Learning": "ML and Deep Learning",
      "LLM и инференс": "LLM and inference",
      "Данные и аналитика": "Data and analytics",
      "Backend и инфраструктура": "Backend and infrastructure",
      Мониторинг: "Monitoring",
      "Распознавание эмоций по лицу": "Facial emotion recognition",
      "CNN-модель для классификации семи эмоций по изображениям лиц и FastAPI-сервис для онлайн-инференса.":
        "A CNN model for classifying seven emotions from face images, plus a FastAPI service for online inference.",
      "Telegram-бот мониторинга метрик": "Telegram bot for metrics monitoring",
      "Ежедневный контроль CAC, LTV и досматриваемости онлайн-кинотеатра на основе clickhouse-данных примерно на 2 млн событий.":
        "Daily monitoring of CAC, LTV, and online cinema completion metrics based on roughly 2 million ClickHouse events.",
      "Сбор параметров с датчиков": "Sensor parameter capture",
      "On-prem CV-решение для промышленности, фиксирующее показания цифровых, округлых и термометрических датчиков с камер. Уже применяется на производстве.":
        "An on-prem industrial CV solution that reads digital, dial, and thermometer sensor values from camera feeds. It is already used in production.",
      "Готов обсудить ML-задачи, GenAI-продукты и production-инфраструктуру":
        "Ready to discuss ML tasks, GenAI products, and production infrastructure",
      Наверх: "Back to top",
      "Чат с CV-ботом": "Chat with the CV bot",
      "Спросите про опыт": "Ask about experience",
      "Закрыть чат": "Close chat",
      "Я отвечаю по резюме Егора: опыт, проекты, стек, образование и контакты.":
        "I answer based on Egor's CV: experience, projects, stack, education, and contacts.",
      "Ограничения демо-чата": "Demo chat limitations",
      "Демо может отвечать нестабильно": "The demo may respond inconsistently",
      "API развернут на слабой машине с 2 ГБ RAM, E5-модель эмбеддингов плохо понимает русский, а бесплатные модели OpenRouter иногда падают или возвращают неполный ответ.":
        "The API runs on a small 2 GB RAM machine, the E5 embedding model has weak Russian understanding, and free OpenRouter models sometimes fail or return incomplete answers.",
      "Быстрые вопросы": "Quick questions",
      "Расскажите про опыт Егора с RAG и LLM-агентами":
        "Tell me about Egor's experience with RAG and LLM agents",
      "RAG и агенты": "RAG and agents",
      "Какой у Егора опыт с Computer Vision?":
        "What experience does Egor have with Computer Vision?",
      "Какие production ML-задачи он решал?":
        "What production ML problems has he solved?",
      "Ваш вопрос": "Your question",
      "Напишите вопрос по резюме": "Ask a question about the CV",
      "Отправить вопрос": "Send question",
      "Открыть чат с CV-ботом": "Open the CV bot chat",
      "CV-бот": "CV bot",
      "Выбор языка": "Language selection",
    },
  },
};

let isChatSending = false;
let currentLanguage = "ru";

function normalizeText(text) {
  return text.trim().replace(/\s+/g, " ");
}

function getCurrentCopy(group, key) {
  return i18n[currentLanguage]?.[group]?.[key] || i18n.ru[group]?.[key] || "";
}

function translateText(text, language = currentLanguage) {
  const normalized = normalizeText(text);

  if (language === "ru") {
    return normalized;
  }

  return i18n[language]?.text?.[normalized] || normalized;
}

function getOriginalAttribute(element, attribute) {
  const attributes = originalAttributes.get(element) || {};

  if (!(attribute in attributes)) {
    attributes[attribute] = element.getAttribute(attribute) || "";
    originalAttributes.set(element, attributes);
  }

  return attributes[attribute];
}

function translatePageText(language) {
  document.querySelectorAll("body *").forEach((element) => {
    if (["SCRIPT", "STYLE"].includes(element.tagName) || element.childElementCount) {
      return;
    }

    const text = element.textContent;

    if (!text.trim()) {
      return;
    }

    if (!originalElementText.has(element)) {
      originalElementText.set(element, normalizeText(text));
    }

    element.textContent = translateText(originalElementText.get(element), language);
  });
}

function translateAttributes(language) {
  document
    .querySelectorAll("[aria-label], [placeholder], [data-chat-suggestion]")
    .forEach((element) => {
      ["aria-label", "placeholder", "data-chat-suggestion"].forEach((attribute) => {
        if (!element.hasAttribute(attribute)) {
          return;
        }

        const original = getOriginalAttribute(element, attribute);
        element.setAttribute(attribute, translateText(original, language));
      });
    });
}

function updateMeta(language) {
  const meta = i18n[language]?.meta || i18n.ru.meta;

  document.title = meta.title;
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", meta.description);
  document
    .querySelector('meta[property="og:title"]')
    ?.setAttribute("content", meta.ogTitle);
  document
    .querySelector('meta[property="og:description"]')
    ?.setAttribute("content", meta.ogDescription);
}

function getStoredLanguage() {
  try {
    return localStorage.getItem(languageStorageKey);
  } catch {
    return null;
  }
}

function storeLanguage(language) {
  try {
    localStorage.setItem(languageStorageKey, language);
  } catch {
    // The language still changes for the current session if storage is blocked.
  }
}

function updateNavToggleLabel() {
  const isOpen = navToggle?.getAttribute("aria-expanded") === "true";
  navToggle?.setAttribute(
    "aria-label",
    getCurrentCopy("dynamic", isOpen ? "closeMenu" : "openMenu"),
  );
}

function updateChatToggleLabel() {
  const isOpen = chatWidget?.classList.contains("is-open");
  chatToggle?.setAttribute(
    "aria-label",
    getCurrentCopy("dynamic", isOpen ? "closeChat" : "openChat"),
  );
}

function setLanguage(language, options = {}) {
  if (!supportedLanguages.has(language)) {
    language = "ru";
  }

  currentLanguage = language;
  document.documentElement.lang = language;
  document.body.dataset.language = language;
  translatePageText(language);
  translateAttributes(language);
  updateMeta(language);
  languageSwitcher?.setAttribute(
    "aria-label",
    getCurrentCopy("dynamic", "languageSwitcherLabel"),
  );

  languageButtons.forEach((button) => {
    const isActive = button.dataset.language === language;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  updateNavToggleLabel();
  updateChatToggleLabel();

  if (options.persist !== false) {
    storeLanguage(language);
  }
}

function setHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeMobileNav() {
  document.body.classList.remove("nav-open");
  header?.classList.remove("is-open");
  mobileNav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  updateNavToggleLabel();
}

function toggleMobileNav() {
  const isOpen = navToggle?.getAttribute("aria-expanded") === "true";

  document.body.classList.toggle("nav-open", !isOpen);
  header?.classList.toggle("is-open", !isOpen);
  mobileNav?.classList.toggle("is-open", !isOpen);
  navToggle?.setAttribute("aria-expanded", String(!isOpen));
  navToggle?.setAttribute(
    "aria-label",
    getCurrentCopy("dynamic", isOpen ? "openMenu" : "closeMenu"),
  );
}

function scrollChatToBottom() {
  if (!chatMessages) {
    return;
  }

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setChatStatus(message = "") {
  if (chatStatus) {
    chatStatus.textContent = message;
  }
}

function setChatOpen(isOpen) {
  chatWidget?.classList.toggle("is-open", isOpen);
  chatPanel?.setAttribute("aria-hidden", String(!isOpen));
  chatToggle?.setAttribute("aria-expanded", String(isOpen));
  updateChatToggleLabel();

  if (isOpen) {
    closeMobileNav();
    setTimeout(() => chatInput?.focus(), 160);
    scrollChatToBottom();
  }
}

function appendChatSources(messageElement, sources = []) {
  if (!sources.length) {
    return;
  }

  const details = document.createElement("details");
  details.className = "chat-sources";

  const summary = document.createElement("summary");
  summary.textContent = getCurrentCopy("dynamic", "sources");
  details.append(summary);

  const list = document.createElement("ol");
  list.className = "chat-sources-list";

  sources.slice(0, 3).forEach((source) => {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    const meta = document.createElement("span");

    title.textContent =
      source.title || source.file || getCurrentCopy("dynamic", "fallbackSource");
    meta.textContent = source.score ? ` · score ${source.score}` : "";

    item.append(title, meta);
    list.append(item);
  });

  details.append(list);
  messageElement.append(details);
}

function appendChatMessage(type, text, sources = []) {
  if (!chatMessages) {
    return null;
  }

  const message = document.createElement("article");
  const paragraph = document.createElement("p");

  message.className = `chat-message chat-message-${type}`;
  paragraph.className = "chat-message-text";
  paragraph.textContent = text;

  message.append(paragraph);
  appendChatSources(message, sources);
  chatMessages.append(message);
  scrollChatToBottom();

  return message;
}

async function readErrorDetail(response) {
  try {
    const payload = await response.json();
    return payload.detail || `HTTP ${response.status}`;
  } catch {
    return `HTTP ${response.status}`;
  }
}

function getChatConnectionHint() {
  if (chatApiUrl.startsWith("/api/")) {
    return getCurrentCopy("dynamic", "remoteConnectionHint");
  }

  return `${getCurrentCopy("dynamic", "localConnectionHint")} ${chatApiUrl}.`;
}

async function sendChatMessage(message) {
  isChatSending = true;
  chatInput.disabled = true;
  chatSubmit.disabled = true;
  setChatStatus(getCurrentCopy("dynamic", "sendingStatus"));

  const pendingMessage = appendChatMessage(
    "bot",
    getCurrentCopy("dynamic", "typing"),
  );
  pendingMessage?.classList.add("is-pending");

  try {
    const response = await fetch(chatApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(await readErrorDetail(response));
    }

    const payload = await response.json();
    pendingMessage?.remove();
    appendChatMessage(
      "bot",
      payload.answer || getCurrentCopy("dynamic", "emptyAnswer"),
      payload.sources || [],
    );
    setChatStatus("");
  } catch (error) {
    pendingMessage?.remove();
    appendChatMessage(
      "error",
      `${getCurrentCopy("dynamic", "requestError")} ${getChatConnectionHint()}\n${error.message}`,
    );
    setChatStatus(getCurrentCopy("dynamic", "connectionErrorStatus"));
  } finally {
    isChatSending = false;
    chatInput.disabled = false;
    chatSubmit.disabled = false;
    chatInput.focus();
  }
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px 8% 0px", threshold: 0.08 },
);

document.querySelectorAll("[data-reveal]").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 42, 260)}ms`;
  revealObserver.observe(element);
});

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) {
      return;
    }

    navLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        link.getAttribute("href") === `#${visible.target.id}`,
      );
    });
  },
  { rootMargin: "-24% 0px -56% 0px", threshold: [0.08, 0.18, 0.32, 0.5] },
);

sections.forEach((section) => navObserver.observe(section));
navToggle?.addEventListener("click", toggleMobileNav);
mobileNav?.addEventListener("click", (event) => {
  if (event.target instanceof HTMLAnchorElement) {
    closeMobileNav();
  }
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.language || "ru");
  });
});

chatToggle?.addEventListener("click", () => {
  setChatOpen(!chatWidget?.classList.contains("is-open"));
});

chatClose?.addEventListener("click", () => setChatOpen(false));

chatOpenButtons.forEach((button) => {
  button.addEventListener("click", () => setChatOpen(true));
});

chatSuggestions.forEach((button) => {
  button.addEventListener("click", () => {
    if (isChatSending || !(chatInput instanceof HTMLTextAreaElement)) {
      return;
    }

    setChatOpen(true);
    chatInput.value =
      button.dataset.chatSuggestion || button.textContent.trim();
    chatForm?.requestSubmit();
  });
});

chatForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (isChatSending || !(chatInput instanceof HTMLTextAreaElement)) {
    return;
  }

  const message = chatInput.value.trim();

  if (!message) {
    return;
  }

  setChatOpen(true);
  appendChatMessage("user", message);
  chatInput.value = "";
  sendChatMessage(message);
});

chatInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm?.requestSubmit();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && chatWidget?.classList.contains("is-open")) {
    setChatOpen(false);
  }
});

window.addEventListener("scroll", setHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    closeMobileNav();
  }
});

setLanguage(getStoredLanguage() || "ru", { persist: false });
setHeaderState();
