const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const navLinks = [...document.querySelectorAll(".desktop-nav a, .mobile-nav a")];
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
const chatSuggestions = [...document.querySelectorAll("[data-chat-suggestion]")];
const localHostnames = new Set(["localhost", "127.0.0.1", "::1"]);
const defaultChatApiUrl = localHostnames.has(window.location.hostname)
  ? "http://127.0.0.1:8000/chat"
  : "/api/chat";
const chatApiUrl = window.CV_CHAT_API_URL || defaultChatApiUrl;

let isChatSending = false;

function setHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeMobileNav() {
  document.body.classList.remove("nav-open");
  header?.classList.remove("is-open");
  mobileNav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Открыть меню");
}

function toggleMobileNav() {
  const isOpen = navToggle?.getAttribute("aria-expanded") === "true";

  document.body.classList.toggle("nav-open", !isOpen);
  header?.classList.toggle("is-open", !isOpen);
  mobileNav?.classList.toggle("is-open", !isOpen);
  navToggle?.setAttribute("aria-expanded", String(!isOpen));
  navToggle?.setAttribute("aria-label", isOpen ? "Открыть меню" : "Закрыть меню");
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
  chatToggle?.setAttribute(
    "aria-label",
    isOpen ? "Закрыть чат с CV-ботом" : "Открыть чат с CV-ботом",
  );

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
  summary.textContent = "Источники";
  details.append(summary);

  const list = document.createElement("ol");
  list.className = "chat-sources-list";

  sources.slice(0, 3).forEach((source) => {
    const item = document.createElement("li");
    const title = document.createElement("strong");
    const meta = document.createElement("span");

    title.textContent = source.title || source.file || "Раздел резюме";
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
    return "Проверьте, что CV_CHAT_API_URL задана в Vercel и backend доступен.";
  }

  return `Проверьте, что backend доступен по адресу ${chatApiUrl}.`;
}

async function sendChatMessage(message) {
  isChatSending = true;
  chatInput.disabled = true;
  chatSubmit.disabled = true;
  setChatStatus("Бот ищет ответ в резюме...");

  const pendingMessage = appendChatMessage("bot", "Печатает");
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
    appendChatMessage("bot", payload.answer || "Пустой ответ.", payload.sources || []);
    setChatStatus("");
  } catch (error) {
    pendingMessage?.remove();
    appendChatMessage(
      "error",
      `Не удалось получить ответ. ${getChatConnectionHint()}\n${error.message}`,
    );
    setChatStatus("Ошибка подключения к чат-боту");
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
      link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`);
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
    chatInput.value = button.dataset.chatSuggestion || button.textContent.trim();
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

setHeaderState();
