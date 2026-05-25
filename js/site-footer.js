(function(){if(document.querySelector(".site-footer"))return;const o=document.querySelector("main")||document.querySelector(".dashboard")||document.querySelector(".redacao-main")||document.body,e=window.location.pathname.includes("/pages/")?"../":"",t=new Date().getFullYear(),a=document.createElement("footer");a.className="site-footer",a.setAttribute("aria-label","Rodape do AprovAI"),a.innerHTML=`
    <div class="site-footer-inner">
      <div class="footer-brand">
        <a class="footer-logo" href="${e}dashboard.html" aria-label="Voltar ao painel AprovAI">
          <img src="${e}assets/images/aprovai.croco.png" alt="AprovAI">
        </a>
        <p>Um ambiente de estudo ENEM com trilha, biblioteca, quiz, questoes, redacao e rotina organizada em um so lugar.</p>
        <div class="footer-rights-note">
          <i data-lucide="shield-check"></i>
          <span>Conteudo e site com direitos reservados ao criador <strong>kzincks</strong>.</span>
        </div>
      </div>

      <nav class="footer-column" aria-label="Areas do site">
        <h2>Areas do site</h2>
        <a href="${e}dashboard.html">Dashboard</a>
        <a href="${e}biblioteca.html">Biblioteca</a>
        <a href="${e}quiz.html">Quiz por materia</a>
        <a href="${e}questoes.html">Questoes ENEM</a>
        <a href="${e}redacao.html">Redacao</a>
        <a href="${e}plano-estudos.html">Plano 30 dias</a>
      </nav>

      <nav class="footer-column" aria-label="Estudo e pratica">
        <h2>Estudo e pratica</h2>
        <a href="${e}temas-frequentes.html">Temas frequentes</a>
        <a href="${e}ambiente-estudo.html">Ambiente de estudo</a>
        <a href="${e}redacao-editor.html">Editor de redacao</a>
        <a href="${e}redacao-modelos.html">Modelos de redacao</a>
        <a href="${e}questoes.html">Mapa de questoes</a>
        <a href="${e}dashboard.html">Metas e progresso</a>
      </nav>

      <nav class="footer-column" aria-label="Ideias de aprendizagem">
        <h2>Ideias</h2>
        <a href="${e}dashboard.html">Diagnostico inicial</a>
        <a href="${e}plano-estudos.html">Rotina inteligente</a>
        <a href="${e}biblioteca.html">Apostilas por area</a>
        <a href="${e}quiz.html">Revisao por erros</a>
        <a href="${e}redacao.html">Checklist de competencias</a>
        <a href="${e}temas-frequentes.html">Padroes que mais caem</a>
      </nav>

      <nav class="footer-column" aria-label="Termos e direitos">
        <h2>Termos e direitos</h2>
        <a href="${e}direitos-termos.html">Documento completo</a>
        <a href="${e}direitos-termos.html#direitos-autorais">Direitos autorais</a>
        <a href="${e}direitos-termos.html#uso-permitido">Uso permitido</a>
        <a href="${e}direitos-termos.html#privacidade">Privacidade</a>
        <a href="${e}direitos-termos.html#conteudo-educacional">Conteudo educacional</a>
        <a href="${e}direitos-termos.html#criador">Criador kzincks</a>
      </nav>
    </div>

    <div class="site-footer-bottom">
      <span>\xA9 ${t} AprovAI. Todos os direitos reservados.</span>
      <span>Site, identidade, estrutura e conteudo protegidos. Criador: <strong>kzincks</strong>.</span>
      <a href="${e}direitos-termos.html#contato">Contato e solicitacoes</a>
    </div>
  `,document.body.classList.contains("auth-page")?document.body.appendChild(a):o.appendChild(a),window.lucide&&window.lucide.createIcons()})();
