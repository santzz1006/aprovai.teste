const topicsFile="data/questoes/temas-frequentes.json?v=temas-robusto-2",state={data:null,themes:[],visibleCount:36,filters:{query:"",area:"all",subject:"all",frequency:"all",sort:"priority"}},$=e=>document.querySelector(e),$$=e=>[...document.querySelectorAll(e)];document.addEventListener("DOMContentLoaded",init);async function init(){bindEvents(),await loadTopics(),renderAll(),refreshIcons()}function bindEvents(){$("#searchInput").addEventListener("input",e=>{state.filters.query=e.target.value.trim().toLowerCase(),state.visibleCount=36,renderResults()}),$("#sortSelect").addEventListener("change",e=>{state.filters.sort=e.target.value,renderResults()}),$("#loadMoreButton").addEventListener("click",()=>{state.visibleCount+=36,renderResults()})}async function loadTopics(){try{state.data=await window.AprovaiContent.getJson(topicsFile),state.themes=state.data.areas.flatMap(e=>e.collections.flatMap(t=>t.themes.map(a=>({...a,areaIcon:e.icon,areaShortLabel:e.shortLabel}))))}catch{state.data={totals:{areas:0,collections:0,themes:0},areas:[]},state.themes=[],showToast("Entre na sua conta para carregar temas frequentes.")}}function renderAll(){renderStats(),renderFilters(),renderOverview(),renderResults()}function renderStats(){$("#statAreas").textContent=state.data.totals.areas,$("#statCollections").textContent=state.data.totals.collections,$("#statThemes").textContent=state.data.totals.themes,$("#sidebarCount").textContent=`${state.data.totals.themes} temas`}function renderFilters(){const e=[{value:"all",label:"Todas"},...state.data.areas.map(s=>({value:s.area,label:s.shortLabel||s.areaLabel}))],t=unique(state.themes.map(s=>s.subject)).map(s=>({value:s,label:s})),a=unique(state.themes.map(s=>s.frequency)).map(s=>({value:s,label:s}));$("#areaFilters").innerHTML=renderChips(e,"area"),$("#subjectFilters").innerHTML=renderChips([{value:"all",label:"Todas"},...t],"subject"),$("#frequencyFilters").innerHTML=renderChips([{value:"all",label:"Todas"},...a],"frequency"),$$("[data-area-filter]").forEach(s=>{s.addEventListener("click",()=>{state.filters.area=s.dataset.areaFilter,state.visibleCount=36,renderFilters(),renderOverview(),renderResults()})}),$$("[data-subject-filter]").forEach(s=>{s.addEventListener("click",()=>{state.filters.subject=s.dataset.subjectFilter,state.visibleCount=36,renderFilters(),renderResults()})}),$$("[data-frequency-filter]").forEach(s=>{s.addEventListener("click",()=>{state.filters.frequency=s.dataset.frequencyFilter,state.visibleCount=36,renderFilters(),renderResults()})})}function renderChips(e,t){return e.map(a=>`
    <button class="filter-chip ${state.filters[t]===a.value?"active":""}" type="button" data-${t}-filter="${escapeAttr(a.value)}">
      ${a.label}
    </button>
  `).join("")}function renderOverview(){const e=state.filters.area==="all"?state.data.areas:state.data.areas.filter(t=>t.area===state.filters.area);$("#areaOverview").innerHTML=e.map(t=>`
    <article class="area-card">
      <span class="frequent-icon"><i data-lucide="${t.icon}"></i></span>
      <h3>${t.shortLabel}</h3>
      <p>${t.totals.themes} temas, ${t.totals.collections} apostilas e ${t.totals.subjects} mat\xE9rias.</p>
    </article>
  `).join(""),refreshIcons()}function renderResults(){const e=sortThemes(filterThemes());if($("#resultsTitle").textContent=`${e.length} temas encontrados`,!e.length){$("#themesList").innerHTML='<div class="empty-state">Nenhum tema encontrado com esses filtros.</div>',$("#loadMoreButton").hidden=!0;return}const t=e.slice(0,state.visibleCount);$("#themesList").innerHTML=t.map(renderThemeCard).join(""),$("#loadMoreButton").hidden=t.length>=e.length,$("#loadMoreButton").textContent=`Carregar mais temas (${t.length}/${e.length})`,refreshIcons()}function filterThemes(){return state.themes.filter(e=>state.filters.area!=="all"&&e.area!==state.filters.area||state.filters.subject!=="all"&&e.subject!==state.filters.subject||state.filters.frequency!=="all"&&e.frequency!==state.filters.frequency?!1:state.filters.query?[e.title,e.subject,e.bookletTitle,e.chapterTitle,e.frequency,e.whyFrequent,e.coreFormulaOrModel,...e.tags,...e.appearsAs,...e.howToSolve,...e.commonMistakes,...e.questionSignals,...e.relatedTopics||[],...(e.resolutionModel||[]).map(a=>`${a.step} ${a.detail}`)].join(" ").toLowerCase().includes(state.filters.query):!0)}function sortThemes(e){return[...e].sort((t,a)=>state.filters.sort==="area"?t.areaLabel.localeCompare(a.areaLabel)||t.title.localeCompare(a.title):state.filters.sort==="subject"?t.subject.localeCompare(a.subject)||t.title.localeCompare(a.title):state.filters.sort==="title"?t.title.localeCompare(a.title):(a.priority||0)-(t.priority||0)||t.title.localeCompare(a.title))}function renderThemeCard(e){return`
    <article class="theme-card">
      <header>
        <div>
          <span class="eyebrow">${e.areaShortLabel} / ${e.subject}</span>
          <h3>${e.title}</h3>
          <div class="theme-meta">
            <span class="meta-pill">${e.frequency}</span>
            <span class="meta-pill">${e.bookletTitle}</span>
            <span class="meta-pill">${e.chapterTitle}</span>
          </div>
        </div>
        <span class="frequent-icon"><i data-lucide="${e.areaIcon||"badge-help"}"></i></span>
      </header>

      <div class="theme-grid">
        ${renderBlock("Como aparece",e.appearsAs)}
        ${renderBlock("Como resolver",e.howToSolve,"ol")}
        ${renderKeyModel(e)}
        ${renderObjectBlock("Modelo de resolu\xE7\xE3o",e.resolutionModel)}
        ${renderBlock("Erros comuns",e.commonMistakes)}
        ${renderBlock("Sinais no enunciado",e.questionSignals)}
        ${renderBlock("Comandos t\xEDpicos",e.commandPatterns)}
        ${renderBlock("Leitura visual",e.visualReading)}
        <section class="mini-question">
          <p>${e.miniQuestion.prompt}</p>
          <ol type="A">
            ${e.miniQuestion.alternatives.map(renderAlternative).join("")}
          </ol>
          <p><strong>Gabarito:</strong> ${e.miniQuestion.answer}. ${e.miniQuestion.explanation}</p>
        </section>
        ${renderPracticeModels(e.practiceModels)}
        ${renderBlock("Trilha de revis\xE3o",e.studyPath,"ol")}
      </div>

      <div class="tag-row">
        ${e.tags.slice(0,10).map(t=>`<span class="tag">${t}</span>`).join("")}
      </div>
    </article>
  `}function renderKeyModel(e){return`
    <section class="theme-block model-highlight">
      <strong>F\xF3rmula ou modelo-chave</strong>
      <p>${e.coreFormulaOrModel}</p>
    </section>
  `}function renderObjectBlock(e,t){return`
    <section class="theme-block">
      <strong>${e}</strong>
      <ol>
        ${(t||[]).map(a=>`<li><b>${a.step}</b><span>${a.detail}</span></li>`).join("")}
      </ol>
    </section>
  `}function renderPracticeModels(e){return`
    <section class="theme-block practice-models">
      <strong>Modelos de quest\xE3o</strong>
      ${(e||[]).map(t=>`
        <article>
          <b>${t.title}</b>
          <p>${t.situation}</p>
          <small>${t.task}</small>
          <span>${t.answerStrategy}</span>
        </article>
      `).join("")}
    </section>
  `}function renderAlternative(e,t){return typeof e=="string"?`<li><b>${"ABCDE"[t]})</b> ${e}</li>`:`<li><b>${e.letter})</b> ${e.text}</li>`}function renderBlock(e,t,a="ul"){const s=a==="ol"?"ol":"ul";return`
    <section class="theme-block">
      <strong>${e}</strong>
      <${s}>
        ${(t||[]).map(r=>`<li>${r}</li>`).join("")}
      </${s}>
    </section>
  `}function unique(e){return[...new Set(e.filter(Boolean))].sort((t,a)=>t.localeCompare(a))}function escapeAttr(e){return String(e).replace(/"/g,"&quot;")}function showToast(e){$("#toastText").textContent=e,$("#toast").classList.add("show"),clearTimeout(showToast.timer),showToast.timer=setTimeout(()=>$("#toast").classList.remove("show"),2200)}function refreshIcons(){window.lucide&&window.lucide.createIcons()}
