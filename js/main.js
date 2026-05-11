/* ===================================================
   MAIN.JS — Portfólio Luis Santos
   Responsável por:
     1. Alternância de tema claro / escuro
     2. Menu hamburger responsivo
     3. Destaque do link de navegação ativo (scroll spy)
     4. Validação do formulário de contato
     5. Simulação de envio e exibição do modal de confirmação
   =================================================== */

// -------------------------------------------------------
// 1. ALTERNÂNCIA DE TEMA CLARO / ESCURO
//    Lê a preferência salva no localStorage; ao clicar no
//    botão, alterna o atributo data-theme no <html> e salva
//    a nova preferência para persistir entre visitas.
// -------------------------------------------------------
const html       = document.documentElement;
const themeBtn   = document.getElementById("theme-toggle");
const themeIcon  = document.getElementById("theme-icon");

// Recupera a preferência salva ou usa "dark" como padrão
const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

themeBtn.addEventListener("click", () => {
  const current = html.getAttribute("data-theme");
  const next    = current === "dark" ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next); // persiste a escolha
});

/** Aplica o tema e atualiza o ícone do botão */
function applyTheme(theme) {
  html.setAttribute("data-theme", theme);
  // Ícone: sol no tema escuro (para indicar "ir para claro"),
  // lua no tema claro (para indicar "ir para escuro")
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
}

// -------------------------------------------------------
// 2. MENU HAMBURGER (responsivo para mobile)
//    Ao clicar no botão hamburger, alterna a classe "open"
//    nos elementos do menu e no próprio botão.
// -------------------------------------------------------
const hamburger = document.getElementById("hamburger");
const navLinks  = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  // Alterna a classe "open" no menu e no ícone hamburger
  navLinks.classList.toggle("open");
  hamburger.classList.toggle("open");
});

// Fecha o menu ao clicar em qualquer link de navegação
navLinks.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    hamburger.classList.remove("open");
  });
});

// -------------------------------------------------------
// 3. SCROLL SPY — destaque do link ativo na navbar
//    Usa IntersectionObserver para detectar qual seção está
//    visível e marca o link correspondente como "active".
// -------------------------------------------------------
const sections = document.querySelectorAll(".section");
const navItems = document.querySelectorAll(".nav-link");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remove "active" de todos os links
        navItems.forEach(link => link.classList.remove("active"));
        // Adiciona "active" ao link cujo href aponta para a seção visível
        const activeLink = document.querySelector(
          `.nav-link[href="#${entry.target.id}"]`
        );
        if (activeLink) activeLink.classList.add("active");
      }
    });
  },
  {
    // Considera a seção visível quando ocupa ≥ 40% da viewport
    threshold: 0.4,
    // Desconta a altura do header fixo (64px)
    rootMargin: "-64px 0px 0px 0px",
  }
);

sections.forEach(section => observer.observe(section));

// -------------------------------------------------------
// 4. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
//    Verifica:
//      - Campos obrigatórios não vazios
//      - E-mail com formato válido (regex)
//    Exibe mensagens de erro individuais por campo.
//    Ao passar na validação, chama simulateSubmit().
// -------------------------------------------------------
const form          = document.getElementById("contact-form");
const inputNome     = document.getElementById("nome");
const inputEmail    = document.getElementById("email");
const inputMensagem = document.getElementById("mensagem");

// Elementos que exibem as mensagens de erro
const erroNome     = document.getElementById("erro-nome");
const erroEmail    = document.getElementById("erro-email");
const erroMensagem = document.getElementById("erro-mensagem");

// Regex para validação básica de formato de e-mail
// Exemplo válido: usuario@dominio.com
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

form.addEventListener("submit", (event) => {
  // Impede o envio real do formulário (apenas simulação)
  event.preventDefault();

  const isValid = validateForm();
  if (isValid) {
    simulateSubmit();
  }
});

/** Valida todos os campos e retorna true se não houver erros */
function validateForm() {
  let valid = true;

  // Validação do campo Nome
  const nome = inputNome.value.trim();
  if (nome === "") {
    showError(inputNome, erroNome, "Por favor, informe seu nome.");
    valid = false;
  } else {
    clearError(inputNome, erroNome);
  }

  // Validação do campo E-mail
  const email = inputEmail.value.trim();
  if (email === "") {
    showError(inputEmail, erroEmail, "Por favor, informe seu e-mail.");
    valid = false;
  } else if (!EMAIL_REGEX.test(email)) {
    showError(inputEmail, erroEmail, "Informe um e-mail válido (ex: usuario@dominio.com).");
    valid = false;
  } else {
    clearError(inputEmail, erroEmail);
  }

  // Validação do campo Mensagem
  const mensagem = inputMensagem.value.trim();
  if (mensagem === "") {
    showError(inputMensagem, erroMensagem, "Por favor, escreva sua mensagem.");
    valid = false;
  } else {
    clearError(inputMensagem, erroMensagem);
  }

  return valid;
}

/** Aplica a classe de erro e exibe a mensagem no campo */
function showError(input, errorEl, message) {
  input.classList.add("is-invalid");
  errorEl.textContent = message;
}

/** Remove a classe de erro e limpa a mensagem do campo */
function clearError(input, errorEl) {
  input.classList.remove("is-invalid");
  errorEl.textContent = "";
}

// -------------------------------------------------------
// 5. SIMULAÇÃO DE ENVIO DO FORMULÁRIO
//    Após validação bem-sucedida:
//      - Lê o nome para personalizar a mensagem
//      - Limpa todos os campos
//      - Exibe o modal de confirmação com o nome do usuário
// -------------------------------------------------------
const modalOverlay = document.getElementById("modal-overlay");
const modalNome    = document.getElementById("modal-nome");
const modalClose   = document.getElementById("modal-close");

/** Simula o envio, limpa o formulário e exibe o modal */
function simulateSubmit() {
  const nome = inputNome.value.trim();

  // Limpa todos os campos após "envio"
  form.reset();
  // Remove também quaisquer classes de erro residuais
  [inputNome, inputEmail, inputMensagem].forEach(el =>
    el.classList.remove("is-invalid")
  );

  // Personaliza a mensagem do modal com o nome do remetente
  modalNome.textContent = nome;

  // Exibe o modal adicionando a classe "visible"
  modalOverlay.classList.add("visible");

  // Move o foco para o botão de fechar (acessibilidade)
  modalClose.focus();
}

/** Fecha o modal ao clicar no botão */
modalClose.addEventListener("click", closeModal);

/** Fecha o modal ao clicar fora dele (no overlay) */
modalOverlay.addEventListener("click", (event) => {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

/** Fecha o modal com a tecla Escape */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalOverlay.classList.contains("visible")) {
    closeModal();
  }
});

/** Remove a classe "visible" para ocultar o modal */
function closeModal() {
  modalOverlay.classList.remove("visible");
}
