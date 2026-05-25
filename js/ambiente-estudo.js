const settingsKey="saasEnemSettingsV1",lessonProgressKey="saasEnemStudyLessonProgressV1",libraryProgressKey="saasEnemLibraryProgressV1",state={index:[],lessonFile:null,booklet:null,flatLessons:[],currentIndex:0,progress:{},libraryProgress:{},settings:{}},$=t=>document.querySelector(t),$$=t=>[...document.querySelectorAll(t)];document.addEventListener("DOMContentLoaded",init);async function init(){state.settings=readJson(settingsKey)||{},state.progress=readJson(lessonProgressKey)||{},state.libraryProgress=readJson(libraryProgressKey)||{},applySettings(),bindEvents(),await loadStudyContent(),renderStudyPage(),refreshIcons()}function bindEvents(){$("#mobileMenuButton").addEventListener("click",()=>document.body.classList.toggle("menu-open")),$("#markLessonButton").addEventListener("click",markCurrentLessonDone),$("#previousLessonButton").addEventListener("click",previousLesson),$("#nextLessonButton").addEventListener("click",nextLesson)}async function loadStudyContent(){const t=new URLSearchParams(window.location.search),e=t.get("id");state.index=await fetchJson("data/aulas/aulas-index.json");const n=state.index.find(s=>s.id===e)||state.index[0];if(!n)throw new Error("Nenhuma aula encontrada.");state.lessonFile=n.file,state.booklet=await fetchJson(n.file),state.flatLessons=state.booklet.chapters.flatMap((s,i)=>s.lessons.map((r,o)=>({...r,chapterTitle:s.title,chapterIndex:i,lessonIndex:o,globalIndex:0}))).map((s,i)=>({...s,globalIndex:i})),state.currentIndex=getInitialLessonIndex(t)}async function fetchJson(t){return window.AprovaiContent.getJson(t)}function renderStudyPage(){const t=state.booklet,e=getCompletedCount(),n=state.flatLessons.length,s=n?Math.round(e/n*100):0;$("#sidebarTitle").textContent=t.title,$("#sidebarProgress").style.width=`${s}%`,$("#sidebarProgressText").textContent=`${e} de ${n} t\xF3picos conclu\xEDdos.`,$("#areaLabel").textContent=`${t.areaLabel} / ${t.subject}`,$("#bookletTitle").textContent=t.title,$("#bookletSummary").textContent=t.summary,$("#heroMeta").innerHTML=`
    <span class="meta-pill"><i data-lucide="book-open"></i>${n} aulas</span>
    <span class="meta-pill"><i data-lucide="clock-3"></i>${t.estimatedMinutes} min</span>
    <span class="meta-pill"><i data-lucide="check-circle-2"></i>${s}% conclu\xEDdo</span>
  `,$("#beforeStudy").innerHTML=t.beforeStudy.map(i=>`<li>${i}</li>`).join(""),$("#studyPromise").textContent=t.studyPromise,$("#finalReviewSummary").textContent=t.finalReview.summary,$("#finalReviewChecklist").innerHTML=t.finalReview.checklist.map(i=>`<li>${i}</li>`).join(""),renderLessonNav(),renderCurrentLesson()}function renderLessonNav(){const t=state.flatLessons[state.currentIndex],e=state.booklet.chapters.map((i,r)=>`
    <div class="lesson-picker-group">
      <strong>${escapeHtml(i.title)}</strong>
      ${i.lessons.map((o,c)=>{const a=getGlobalIndex(r,c),l=isLessonDone(a);return`
          <button class="lesson-picker-option ${a===state.currentIndex?"active":""}" type="button" data-lesson-index="${a}">
            <span>${l?"OK":a+1}</span>
            <strong>${escapeHtml(o.title)}</strong>
          </button>
        `}).join("")}
    </div>
  `).join(""),n=state.booklet.chapters.map((i,r)=>`
    <div class="nav-chapter">
      <strong>${i.title}</strong>
      ${i.lessons.map((o,c)=>{const a=getGlobalIndex(r,c),l=isLessonDone(a);return`
          <button class="lesson-link ${a===state.currentIndex?"active":""} ${l?"done":""}" type="button" data-lesson-index="${a}">
            <span>${l?"OK":a+1}</span>
            ${o.title}
          </button>
        `}).join("")}
    </div>
  `).join("");$("#lessonNav").innerHTML=`
    <div class="lesson-picker">
      <button class="lesson-picker-toggle" id="lessonPickerToggle" type="button" aria-expanded="false">
        <span>Topico atual</span>
        <strong>${state.currentIndex+1}. ${escapeHtml(t.title)}</strong>
        <i data-lucide="chevron-down"></i>
      </button>
      <div class="lesson-picker-menu" id="lessonPickerMenu">${e}</div>
    </div>
    <div class="lesson-button-list">${n}</div>
  `;const s=$("#lessonPickerToggle");s&&s.addEventListener("click",()=>{const r=s.closest(".lesson-picker").classList.toggle("open");s.setAttribute("aria-expanded",String(r))}),$$(".lesson-picker-option").forEach(i=>{i.addEventListener("click",()=>{state.currentIndex=Number(i.dataset.lessonIndex),renderCurrentLesson(),renderLessonNav(),refreshIcons(),document.body.classList.remove("menu-open")})}),$$(".lesson-link").forEach(i=>{i.addEventListener("click",()=>{state.currentIndex=Number(i.dataset.lessonIndex),renderCurrentLesson(),renderLessonNav(),refreshIcons(),document.body.classList.remove("menu-open")})})}function renderCurrentLesson(){const t=state.flatLessons[state.currentIndex];t&&($("#chapterLabel").textContent=t.chapterTitle,$("#lessonCounter").textContent=`T\xF3pico ${state.currentIndex+1} de ${state.flatLessons.length}`,$("#lessonTitle").textContent=t.title,$("#plainSummary").textContent=t.plainSummary,$("#lessonExplanation").innerHTML=t.explanation.map(e=>`<p class="lesson-explanation-paragraph">${e}</p>`).join(""),$("#formulaCards").innerHTML=renderFormulaCards(t.formulaCards||[]),$("#visualModels").innerHTML=renderVisualModels(t.visualModels||[]),$("#howItAppears").innerHTML=t.howItAppears.map(e=>`<li>${e}</li>`).join(""),$("#stepByStep").innerHTML=t.stepByStep.map(e=>`<li>${e}</li>`).join(""),$("#exampleSituation").textContent=t.example.situation,$("#exampleAnalysis").textContent=t.example.analysis,$("#exampleAnswer").textContent=t.example.answerModel,$("#workedExamples").innerHTML=renderWorkedExamples(t.workedExamples||[]),$("#enemQuestions").innerHTML=renderEnemQuestions(t.enemStyleQuestions||[]),$("#studyScript").innerHTML=renderStudyScript(t.studyScript),$("#commonMistakes").innerHTML=t.commonMistakes.map(e=>`<li>${e}</li>`).join(""),$("#quickReview").innerHTML=t.quickReview.map(e=>`<li>${e}</li>`).join(""),$("#glossaryGrid").innerHTML=renderGlossary(t.glossary||[]),$("#masteryRubric").innerHTML=renderMasteryRubric(t.masteryRubric||[]),$("#practicePrompt").textContent=t.miniPractice.prompt,$("#practiceFeedback").textContent="",$("#practiceOptions").innerHTML=t.miniPractice.options.map((e,n)=>`
    <button class="practice-option" type="button" data-option-index="${n}">${e}</button>
  `).join(""),$$(".practice-option").forEach(e=>{e.addEventListener("click",()=>answerPractice(Number(e.dataset.optionIndex)))}),$("#previousLessonButton").disabled=state.currentIndex===0,$("#nextLessonButton").innerHTML=state.currentIndex===state.flatLessons.length-1?'Finalizar apostila <i data-lucide="check-circle-2"></i>':'Pr\xF3ximo t\xF3pico <i data-lucide="arrow-right"></i>',refreshIcons())}function renderFormulaCards(t){return t.map(e=>`
    <article class="formula-card">
      <strong>${e.name}</strong>
      <code>${e.expression}</code>
      <p>${e.explanation}</p>
      <small>${e.useWhen}</small>
    </article>
  `).join("")}function renderVisualModels(t){return t.map(e=>{if(e.type==="function-graph"){const n=e.points||[],s=n.map(i=>`${i.x},${i.y}`).join(" ");return`
        <article class="visual-card visual-card-wide">
          <h4>${e.title}</h4>
          <p>${e.description||""}</p>
          <div class="function-graph" role="img" aria-label="${e.title}">
            <svg viewBox="0 0 320 210" preserveAspectRatio="none">
              <line x1="34" y1="176" x2="300" y2="176" class="axis"></line>
              <line x1="34" y1="18" x2="34" y2="176" class="axis"></line>
              <polyline points="${s}" class="graph-line"></polyline>
              ${n.map(i=>`<circle cx="${i.x}" cy="${i.y}" r="4" class="graph-point"></circle>`).join("")}
            </svg>
            <div class="graph-caption">${e.caption||""}</div>
            <div class="graph-update-note">Se o grafico parecer cortado no celular, atualize a pagina ou gire a tela.</div>
          </div>
        </article>
      `}if(e.type==="bar-chart"){const n=Math.max(...(e.bars||[]).map(s=>Number(s.value)||0),1);return`
        <article class="visual-card">
          <h4>${e.title}</h4>
          <p>${e.description||""}</p>
          <div class="study-bar-chart">
            ${(e.bars||[]).map(s=>`
                <div class="study-bar-item">
                  <span class="study-bar" style="--bar-height: ${Math.max(12,Math.round((Number(s.value)||0)/n*100))}%"></span>
                  <strong>${s.value}</strong>
                  <small>${s.label}</small>
                </div>
              `).join("")}
          </div>
        </article>
      `}return e.type==="timeline"?`
        <article class="visual-card">
          <h4>${e.title}</h4>
          <p>${e.description||""}</p>
          <ol class="study-timeline">
            ${(e.events||[]).map(n=>`
              <li>
                <strong>${n.label}</strong>
                <span>${n.text}</span>
              </li>
            `).join("")}
          </ol>
        </article>
      `:e.type==="quote-card"?`
        <article class="visual-card quote-visual">
          <h4>${e.title}</h4>
          <blockquote>${e.quote}</blockquote>
          <p>${e.explanation||""}</p>
          <small>${e.author||""}</small>
        </article>
      `:e.type==="cycle-diagram"?`
        <article class="visual-card">
          <h4>${e.title}</h4>
          <p>${e.description||""}</p>
          <div class="cycle-diagram">
            ${(e.steps||[]).map((n,s)=>`
              <span style="--step-index: ${s}">${n}</span>
            `).join("")}
          </div>
        </article>
      `:e.type==="concept-board"?`
        <article class="visual-card">
          <h4>${e.title}</h4>
          <p>${e.description||""}</p>
          <div class="concept-board">
            ${(e.items||[]).map(n=>`
              <section>
                <strong>${n.label}</strong>
                <span>${n.text}</span>
              </section>
            `).join("")}
          </div>
        </article>
      `:e.type==="comparison-table"?`
        <article class="visual-card">
          <h4>${e.title}</h4>
          <div class="mini-table">
            <div class="mini-table-row mini-table-head">
              ${e.columns.map(n=>`<span>${n}</span>`).join("")}
            </div>
            ${e.rows.map(n=>`
              <div class="mini-table-row">
                ${n.map(s=>`<span>${s}</span>`).join("")}
              </div>
            `).join("")}
          </div>
        </article>
      `:e.type==="mental-map"?`
        <article class="visual-card">
          <h4>${e.title}</h4>
          <div class="mental-map">
            <strong>${e.center}</strong>
            ${e.branches.map(n=>`<span>${n}</span>`).join("")}
          </div>
        </article>
      `:`
      <article class="visual-card">
        <h4>${e.title}</h4>
        <p>${e.description||""}</p>
        <div class="flow-model">
          ${e.nodes.map(n=>`<span>${n}</span>`).join("")}
        </div>
      </article>
    `}).join("")}function renderWorkedExamples(t){return t.map(e=>`
    <article class="worked-card">
      <h4>${e.title}</h4>
      <p>${e.prompt}</p>
      <div class="data-list">
        ${e.data.map(n=>`<span>${n}</span>`).join("")}
      </div>
      <ol>
        ${e.solutionSteps.map(n=>`<li>${n}</li>`).join("")}
      </ol>
      <strong>${e.finalAnswer}</strong>
    </article>
  `).join("")}function renderEnemQuestions(t){return t.map((e,n)=>`
    <article class="question-card">
      <h4>${e.title}</h4>
      <p>${e.prompt}</p>
      <div class="answer-list">
        ${e.alternatives.map((s,i)=>`
          <span class="${i===e.answer?"correct-answer":""}">${String.fromCharCode(65+i)}. ${s}</span>
        `).join("")}
      </div>
      <strong>Gabarito: ${String.fromCharCode(65+e.answer)}</strong>
      <p>${e.explanation}</p>
    </article>
  `).join("")}function renderStudyScript(t){return t?`
    <p>${t.opening}</p>
    ${t.middle.map(e=>`<p>${e}</p>`).join("")}
    <strong>${t.closing}</strong>
  `:""}function renderGlossary(t){return t.map(e=>`
    <article class="glossary-card">
      <strong>${e.term}</strong>
      <p>${e.meaning}</p>
      <small>${e.inPlainWords}</small>
    </article>
  `).join("")}function renderMasteryRubric(t){return t.map(e=>`
    <article class="rubric-card">
      <strong>${e.level}</strong>
      <p>${e.evidence}</p>
      <small>${e.nextStep}</small>
    </article>
  `).join("")}function answerPractice(t){const e=state.flatLessons[state.currentIndex],n=t===e.miniPractice.answer;$$(".practice-option").forEach(s=>{const i=Number(s.dataset.optionIndex);s.classList.toggle("correct",i===e.miniPractice.answer),s.classList.toggle("wrong",i===t&&!n)}),$("#practiceFeedback").textContent=n?`Boa. ${e.miniPractice.explanation}`:`Quase. ${e.miniPractice.explanation}`}function markCurrentLessonDone(){const t=getLessonKey(state.currentIndex);state.progress[t]={done:!0,updatedAt:new Date().toISOString()},saveJson(lessonProgressKey,state.progress),updateLibraryProgress(),renderStudyPage(),showToast("T\xF3pico conclu\xEDdo.")}function previousLesson(){state.currentIndex!==0&&(state.currentIndex-=1,renderCurrentLesson(),renderLessonNav())}function nextLesson(){if(markCurrentLessonDone(),state.currentIndex<state.flatLessons.length-1){state.currentIndex+=1,renderCurrentLesson(),renderLessonNav(),window.scrollTo({top:0,behavior:"smooth"});return}showToast("Apostila finalizada.")}function updateLibraryProgress(){const t=getCompletedCount(),e=state.flatLessons.length,n=e?Math.round(t/e*100):0;state.libraryProgress[state.booklet.id]={...state.libraryProgress[state.booklet.id]||{},status:n>=100?"done":"reading",percent:n,updatedAt:new Date().toISOString()},saveJson(libraryProgressKey,state.libraryProgress)}function getCompletedCount(){return state.flatLessons.filter((t,e)=>isLessonDone(e)).length}function isLessonDone(t){return!!state.progress[getLessonKey(t)]?.done}function getLessonKey(t){return`${state.booklet.id}:${state.flatLessons[t].id}`}function getGlobalIndex(t,e){return state.flatLessons.findIndex(n=>n.chapterIndex===t&&n.lessonIndex===e)}function getInitialLessonIndex(t){if(t.has("lesson")){const e=Number(t.get("lesson"));if(Number.isInteger(e)&&e>=0&&e<state.flatLessons.length)return e}if(t.has("chapter")){const e=Number(t.get("chapter"));if(Number.isInteger(e)&&e>=0){const n=state.flatLessons.find(s=>s.chapterIndex===e);if(n)return n.globalIndex}}return 0}function applySettings(){state.settings.theme==="dark"&&(state.settings.theme="light",saveJson(settingsKey,state.settings)),document.body.dataset.theme="light",document.body.dataset.motion=state.settings.motion?"reduced":"full"}function showToast(t){$("#toastText").textContent=t,$("#toast").classList.add("show"),refreshIcons(),window.clearTimeout(showToast.timer),showToast.timer=window.setTimeout(()=>{$("#toast").classList.remove("show")},2400)}function readJson(t){try{return JSON.parse(localStorage.getItem(t))}catch{return null}}function saveJson(t,e){localStorage.setItem(t,JSON.stringify(e))}function escapeHtml(t=""){return String(t).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}function escapeAttr(t=""){return escapeHtml(t)}function refreshIcons(){window.lucide&&window.lucide.createIcons()}
