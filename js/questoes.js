const progressKey="saasEnemExamModulesProgressV1",indexFile="data/questoes/questoes-index.json",areaLabels={humanas:"Humanas",linguagens:"Linguagens",natureza:"Natureza",matematica:"Matem\xE1tica"},state={index:null,module:null,modules:[],currentModuleId:null,currentIndex:0,progress:{},reviewWrongOnly:!1},$=e=>document.querySelector(e),$$=e=>[...document.querySelectorAll(e)];document.addEventListener("DOMContentLoaded",init);async function init(){state.progress=readJson(progressKey)||{},bindEvents(),await loadIndex(),await loadModule(state.modules[0]?.id),renderAll(),refreshIcons()}function bindEvents(){$("#mobileMenuButton").addEventListener("click",()=>document.body.classList.toggle("menu-open")),$("#screenDim").addEventListener("click",()=>document.body.classList.remove("menu-open")),$("#previousButton").addEventListener("click",previousQuestion),$("#nextButton").addEventListener("click",nextQuestion),$("#continueButton").addEventListener("click",continueModule),$("#showAnswerButton").addEventListener("click",revealAnswer),$("#favoriteButton").addEventListener("click",toggleFavorite),$("#reviewWrongButton").addEventListener("click",toggleWrongReview),document.addEventListener("keydown",e=>{e.key==="ArrowRight"&&nextQuestion(),e.key==="ArrowLeft"&&previousQuestion(),e.key==="Escape"&&document.body.classList.remove("menu-open")})}async function loadIndex(){try{state.index=await window.AprovaiContent.getJson(indexFile),state.modules=state.index.modules||[],$("#statModules").textContent=state.index.totals?.modules||state.modules.length,$("#statQuestions").textContent=state.index.totals?.questions||0}catch{state.index={modules:[],totals:{modules:0,questions:0}},state.modules=[],showToast("Entre na sua conta para carregar as questoes protegidas.")}}async function loadModule(e){const t=state.modules.find(n=>n.id===e)||state.modules[0];if(t)try{state.module=await window.AprovaiContent.getJson(t.file),state.currentModuleId=state.module.id,state.currentIndex=getModuleProgress().lastIndex||0,state.reviewWrongOnly=!1}catch{showToast("Falha ao carregar modulo protegido.")}}function renderAll(){renderModules(),renderModuleInfo(),renderAreaTabs(),renderQuestionMap(),renderQuestion(),renderStats(),renderAreaPerformance(),refreshIcons()}function renderModules(){$("#moduleStrip").innerHTML=state.modules.map(e=>{const t=getProgressForModule(e.id),n=Object.values(t.answers||{}).length,s=e.totalQuestions?Math.round(n/e.totalQuestions*100):0;return`
      <button class="module-card ${e.id===state.currentModuleId?"active":""}" type="button" data-module-id="${e.id}">
        <span class="eyebrow">${e.totalQuestions} quest\xF5es</span>
        <strong>${e.title}</strong>
        <small>${e.description}</small>
        <div class="module-progress" aria-hidden="true"><span style="width: ${s}%"></span></div>
      </button>
    `}).join(""),$$("[data-module-id]").forEach(e=>{e.addEventListener("click",async()=>{await loadModule(e.dataset.moduleId),renderAll(),showToast(`${state.module.title} carregado.`)})})}function renderModuleInfo(){state.module&&($("#moduleTitle").textContent=state.module.title,$("#moduleDescription").textContent=state.module.description,$("#sidebarModule").textContent=state.module.title,$("#moduleMeta").innerHTML=state.module.structure.map(e=>`
    <span class="meta-pill">${e.areaLabel}: ${e.start}-${e.end}</span>
  `).join(""))}function renderAreaTabs(){if(!state.module)return;const e=currentQuestion();$("#areaTabs").innerHTML=state.module.structure.map(t=>{const n=getQuestionsByArea(t.area).filter(s=>getAnswer(s.id)).length;return`
      <button class="area-tab ${e?.area===t.area?"active":""}" type="button" data-area="${t.area}">
        <span>${areaLabels[t.area]||t.areaLabel}</span>
        <small>${n}/${t.count}</small>
      </button>
    `}).join(""),$$("[data-area]").forEach(t=>{t.addEventListener("click",()=>{const n=state.module.questions.findIndex(s=>s.area===t.dataset.area);n>=0&&(state.currentIndex=n,saveLastIndex(),renderAll())})})}function renderQuestionMap(){state.module&&($("#questionMap").innerHTML=visibleQuestions().map((e,t)=>{const n=state.module.questions.findIndex(o=>o.id===e.id),s=getAnswer(e.id),r=s?s.status:"";return`
      <button class="map-dot ${n===state.currentIndex?"active":""} ${r}" type="button" data-question-index="${n}">
        ${e.order}
      </button>
    `}).join(""),$$("[data-question-index]").forEach(e=>{e.addEventListener("click",()=>{state.currentIndex=Number(e.dataset.questionIndex),saveLastIndex(),renderAll()})}))}function renderQuestion(){const e=currentQuestion();if(!e){$("#questionCard").innerHTML=`
      <div class="loading-state">
        <strong>Nenhuma quest\xE3o encontrada.</strong>
        <span>Carregue um m\xF3dulo ou desative a revis\xE3o de erros.</span>
      </div>
    `;return}const t=getAnswer(e.id),n=!!getModuleProgress().favorites?.[e.id];$("#favoriteButton").classList.toggle("active",n),$("#questionContext").textContent=`${e.areaLabel} / ${e.subject} / ${e.topic}`,$("#questionTitle").textContent=`Quest\xE3o ${e.order}`,$("#questionCard").innerHTML=`
    <div class="question-head">
      <span class="question-chip">${e.areaLabel}</span>
      <span class="question-chip">${e.subject}</span>
      <span class="question-chip">${e.difficulty}</span>
      <span class="question-chip">${e.reference.note}</span>
    </div>
    ${renderStimulus(e.stimulus)}
    <p class="question-prompt">${e.prompt}</p>
    <div class="alternatives">
      ${e.alternatives.map(s=>renderAlternative(e,s,t)).join("")}
    </div>
    <div class="feedback-box ${t?"show":""}" id="feedbackBox">
      <strong>${t?.correct?"Voc\xEA acertou.":t?"Voc\xEA errou.":"Gabarito"}</strong>
      <p>${e.explanation}</p>
    </div>
  `,$$(".alternative").forEach(s=>{s.addEventListener("click",()=>answerQuestion(e.id,s.dataset.letter))})}function renderAlternative(e,t,n){const s=n?.letter===t.letter,r=!!n,o=e.answer===t.letter;return`
    <button class="${["alternative",s?"selected":"",r&&o?"correct":"",r&&s&&!o?"wrong":""].filter(Boolean).join(" ")}" type="button" data-letter="${t.letter}">
      <span class="alternative-letter">${t.letter}</span>
      <span>${t.text}</span>
    </button>
  `}function renderStimulus(e){if(!e)return"";if(e.type==="table"){const t=e.columns?.length||3;return`
      <section class="stimulus-card">
        <h3>${e.title}</h3>
        <p>${e.text}</p>
        <div class="mini-table" style="--cols: ${t}">
          <div class="mini-row">${e.columns.map(n=>`<span>${n}</span>`).join("")}</div>
          ${e.rows.map(n=>`<div class="mini-row">${n.map(s=>`<span>${s}</span>`).join("")}</div>`).join("")}
        </div>
      </section>
    `}if(e.type==="chart"){const t=Math.max(...e.bars.map(n=>n.value),1);return`
      <section class="stimulus-card">
        <h3>${e.title}</h3>
        <p>${e.text}</p>
        <div class="chart-bars">
          ${e.bars.map(n=>`
            <div class="chart-bar-item">
              <span class="chart-bar" style="--h: ${Math.max(18,Math.round(n.value/t*140))}px"></span>
              <strong>${n.value}</strong>
              <small>${n.label}</small>
            </div>
          `).join("")}
        </div>
      </section>
    `}return`
    <section class="stimulus-card">
      <h3>${e.title}</h3>
      <p>${e.text}</p>
    </section>
  `}function answerQuestion(e,t){const n=state.module.questions.find(o=>o.id===e);if(!n)return;const s=n.answer===t,r=getModuleProgress();r.answers[e]={letter:t,correct:s,status:s?"correct":"wrong",answeredAt:new Date().toISOString()},state.progress[state.currentModuleId]=r,saveProgress(),renderAll(),showToast(s?"Boa, quest\xE3o correta.":"Quase. Veja a explica\xE7\xE3o.")}function revealAnswer(){const e=currentQuestion();if(!e)return;const t=getModuleProgress();t.answers[e.id]={letter:e.answer,correct:!0,status:"correct",revealed:!0,answeredAt:new Date().toISOString()},state.progress[state.currentModuleId]=t,saveProgress(),renderAll()}function toggleFavorite(){const e=currentQuestion();if(!e)return;const t=getModuleProgress();t.favorites[e.id]=!t.favorites[e.id],state.progress[state.currentModuleId]=t,saveProgress(),renderQuestion(),showToast(t.favorites[e.id]?"Quest\xE3o favoritada.":"Favorito removido.")}function previousQuestion(){const e=visibleQuestions(),t=currentQuestion(),n=e.findIndex(r=>r.id===t?.id),s=e[Math.max(0,n-1)];goToQuestion(s)}function nextQuestion(){const e=visibleQuestions(),t=currentQuestion(),n=e.findIndex(r=>r.id===t?.id),s=e[Math.min(e.length-1,n+1)];goToQuestion(s)}function goToQuestion(e){if(!e)return;const t=state.module.questions.findIndex(n=>n.id===e.id);t>=0&&(state.currentIndex=t,saveLastIndex(),renderAll())}function continueModule(){const e=state.module?.questions.find(t=>!getAnswer(t.id));goToQuestion(e||state.module?.questions[0])}function toggleWrongReview(){state.reviewWrongOnly=!state.reviewWrongOnly;const e=visibleQuestions();e.length&&goToQuestion(e[0]),renderAll(),showToast(state.reviewWrongOnly?"Revisando apenas erros.":"Mostrando m\xF3dulo completo.")}function visibleQuestions(){return state.module?state.reviewWrongOnly?state.module.questions.filter(e=>getAnswer(e.id)?.status==="wrong"):state.module.questions:[]}function currentQuestion(){return state.module?.questions[state.currentIndex]||visibleQuestions()[0]}function getQuestionsByArea(e){return state.module?.questions.filter(t=>t.area===e)||[]}function renderStats(){if(!state.module)return;const e=getModuleProgress(),t=Object.values(e.answers||{}),n=t.length,s=t.filter(i=>i.correct).length,r=n-s,o=n?Math.round(s/n*100):0,a=Math.round(n/state.module.totalQuestions*100);$("#statAccuracy").textContent=`${o}%`,$("#scoreAccuracy").textContent=`${o}%`,$("#scoreAnswered").textContent=n,$("#scoreCorrect").textContent=s,$("#scoreWrong").textContent=r,$("#sidebarProgress").style.width=`${a}%`,$("#sidebarProgressText").textContent=`${n} de ${state.module.totalQuestions} quest\xF5es respondidas.`}function renderAreaPerformance(){state.module&&($("#areaPerformance").innerHTML=state.module.structure.map(e=>{const t=getQuestionsByArea(e.area),n=t.filter(a=>getAnswer(a.id)).length,s=t.filter(a=>getAnswer(a.id)?.correct).length,r=n?Math.round(s/n*100):0,o=t.length?Math.round(n/t.length*100):0;return`
      <div class="area-performance-row">
        <header>
          <span>${areaLabels[e.area]}</span>
          <strong>${r}%</strong>
        </header>
        <div class="area-track" aria-hidden="true"><span style="width: ${o}%"></span></div>
        <small>${n}/${t.length} respondidas</small>
      </div>
    `}).join(""))}function saveLastIndex(){const e=getModuleProgress();e.lastIndex=state.currentIndex,state.progress[state.currentModuleId]=e,saveProgress()}function getAnswer(e){return getModuleProgress().answers?.[e]||null}function getModuleProgress(){return state.currentModuleId?getProgressForModule(state.currentModuleId):{answers:{},favorites:{},lastIndex:0}}function getProgressForModule(e){return state.progress[e]||(state.progress[e]={answers:{},favorites:{},lastIndex:0}),state.progress[e]}function saveProgress(){localStorage.setItem(progressKey,JSON.stringify(state.progress))}function readJson(e){try{return JSON.parse(localStorage.getItem(e))}catch{return null}}function showToast(e){$("#toastText").textContent=e,$("#toast").classList.add("show"),clearTimeout(showToast.timer),showToast.timer=setTimeout(()=>$("#toast").classList.remove("show"),2200)}function refreshIcons(){window.lucide&&window.lucide.createIcons()}
