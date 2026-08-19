"use client";

import { FormEvent, useEffect, useState } from "react";
import { cases, modules, questions, type Question } from "./data";

type View = "home" | "modules" | "quiz" | "cases" | "progress";
type Progress = Record<string, number>;
const STORE = "efecto-polvo-pro-progress";
const ACCESS_STORE = "efecto-polvo-pro-access";
const ACCESS_PASSWORD = "efectopolvo2026";

const Icon = ({ name }: { name: "spark" | "book" | "chart" | "case" | "arrow" }) => {
  const paths = { spark: "M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z", book: "M4 5.5A2.5 2.5 0 016.5 3H11v16H6.5A2.5 2.5 0 004 21V5.5zM20 5.5A2.5 2.5 0 0017.5 3H13v16h4.5A2.5 2.5 0 0120 21V5.5z", chart: "M5 20V10m7 10V4m7 16v-7", case: "M4 7h16v13H4zM9 7V4h6v3", arrow: "M5 12h14m-5-5l5 5-5 5" };
  return <svg aria-hidden="true" viewBox="0 0 24 24"><path d={paths[name]} /></svg>;
};

export function StudyApp() {
  const [access, setAccess] = useState<boolean | null>(null);
  const [view, setView] = useState<View>("home");
  const [activeModule, setActiveModule] = useState<string>("global");
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState<Progress>({});

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { setProgress(JSON.parse(localStorage.getItem(STORE) || "{}")); } catch {}
      setAccess(localStorage.getItem(ACCESS_STORE) === "granted");
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const completed = Object.keys(progress).filter(k => k !== "global").length;
  const bestAverage = completed ? Math.round(Object.entries(progress).filter(([k]) => k !== "global").reduce((a, [,v]) => a + v, 0) / completed) : 0;

  const go = (next: View) => { setView(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const startQuiz = (moduleId: string) => {
    const pool = moduleId === "global" ? modules.flatMap(module => questions.filter(q => q.moduleId === module.id).slice(0, 3)) : questions.filter(q => q.moduleId === moduleId);
    setActiveModule(moduleId); setQuiz(pool); setIndex(0); setSelected(null); setScore(0); setFinished(false); go("quiz");
  };
  const answer = (choice: number) => { if (selected !== null) return; setSelected(choice); if (choice === quiz[index].answer) setScore(s => s + 1); };
  const next = () => {
    if (index + 1 < quiz.length) { setIndex(i => i + 1); setSelected(null); return; }
    const finalScore = Math.round(((score + (selected === quiz[index].answer ? 0 : 0)) / quiz.length) * 100);
    const updated = { ...progress, [activeModule]: Math.max(progress[activeModule] || 0, finalScore) };
    setProgress(updated); localStorage.setItem(STORE, JSON.stringify(updated)); setFinished(true);
  };
  const title = activeModule === "global" ? "Evaluación global" : modules.find(m => m.id === activeModule)?.title;

  if (access === null) return <div className="access-loading"><span className="brand-mark">EP</span></div>;
  if (!access) return <AccessScreen onSuccess={() => setAccess(true)} />;

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => go("home")} aria-label="Ir al inicio"><span className="brand-mark">EP</span><span><b>Efecto Polvo</b><em>PRO</em></span></button>
      <nav aria-label="Navegación principal">
        <button onClick={() => go("modules")}>Módulos</button><button onClick={() => go("cases")}>Casos</button><button onClick={() => go("progress")}>Progreso</button>
      </nav>
      <button className="header-cta" onClick={() => startQuiz("global")}>Evaluarme</button>
    </header>

    {view === "home" && <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Icon name="spark" /> Entrenamiento profesional PMU</div>
          <h1>De la técnica<br/>a la <i>maestría.</i></h1>
          <p className="lead">Pon a prueba tu criterio en cejas efecto polvo y convierte cada decisión técnica en un resultado consciente.</p>
          <p className="support">Una experiencia de estudio basada en la guía de Verónica Montaño: fundamentos, arte, piel, cicatrización, equipos y práctica profesional.</p>
          <div className="actions"><button className="primary" onClick={() => startQuiz("global")}>Comenzar evaluación <Icon name="arrow" /></button><button className="secondary" onClick={() => go("modules")}>Explorar módulos</button></div>
          <div className="micro-stats"><span><b>8</b> módulos</span><span><b>64</b> preguntas</span><span><b>100%</b> práctico</span></div>
        </div>
        <div className="hero-art" aria-label="Representación artística de un degradado efecto polvo">
          <div className="orb orb-one"/><div className="orb orb-two"/><div className="brow"><span/><span/><span/></div>
          <div className="art-card"><small>Principio clave</small><b>La intensidad no se impone.</b><p>Se construye punto a punto.</p></div>
        </div>
      </section>
      <section className="path-section"><div className="section-heading"><span>Tu recorrido</span><h2>Aprende a leer cada decisión</h2><p>Avanza desde la percepción visual hasta el dominio consciente del equipo.</p></div>
        <div className="path-grid">{modules.slice(0,4).map(m => <button key={m.id} className="path-card" onClick={() => startQuiz(m.id)}><span>{m.number}</span><h3>{m.title}</h3><p>{m.short}</p><em>Entrenar ahora →</em></button>)}</div>
      </section>
      <section className="quote"><span>“</span><p>La micropigmentación no se construye únicamente con técnica, sino con la suma de cientos de pequeños detalles.</p><small>VERÓNICA MONTAÑO · APRENDE PMU</small></section>
    </main>}

    {view === "modules" && <main className="inner"><div className="page-intro"><span>Ruta de aprendizaje</span><h1>Ocho módulos para afinar tu criterio</h1><p>Cada evaluación ofrece retroalimentación inmediata y conserva tu mejor resultado en este dispositivo.</p></div>
      <div className="module-grid">{modules.map(m => <article className="module-card" key={m.id}><div className="module-top"><span>{m.number}</span><em>{m.level}</em></div><h2>{m.title}</h2><p>{m.short}</p><div className="module-meta"><span>{questions.filter(q=>q.moduleId===m.id).length} preguntas</span><span>{m.minutes} min</span></div>{progress[m.id] !== undefined && <div className="best">Mejor resultado <b>{progress[m.id]}%</b></div>}<button onClick={() => startQuiz(m.id)}>Comenzar módulo <Icon name="arrow" /></button></article>)}</div>
    </main>}

    {view === "quiz" && <main className="quiz-wrap">{!finished ? <>
      <div className="quiz-head"><button onClick={() => go(activeModule === "global" ? "home" : "modules")}>← Salir</button><div><span>{title}</span><b>{index + 1} / {quiz.length}</b></div></div>
      <div className="progress-track"><span style={{width:`${((index + 1)/quiz.length)*100}%`}}/></div>
      <section className="question-card"><div className="question-tag">Pregunta {index + 1}</div><h1>{quiz[index]?.prompt}</h1><div className="options">{quiz[index]?.options.map((option,i) => <button key={option} className={selected === null ? "" : i === quiz[index].answer ? "correct" : i === selected ? "wrong" : "muted"} onClick={() => answer(i)}><span>{String.fromCharCode(65+i)}</span>{option}</button>)}</div>
      {selected !== null && <div className={`feedback ${selected === quiz[index].answer ? "good" : "review"}`}><b>{selected === quiz[index].answer ? "¡Correcto!" : "Revisemos este concepto"}</b><p>{quiz[index].explanation}</p><button onClick={next}>{index + 1 === quiz.length ? "Ver resultado" : "Siguiente pregunta"} <Icon name="arrow" /></button></div>}</section>
    </> : <section className="result-card"><div className="score-ring" style={{"--score": `${Math.round(score/quiz.length*100)*3.6}deg`} as React.CSSProperties}><span><b>{Math.round(score/quiz.length*100)}%</b><small>{score} de {quiz.length}</small></span></div><span className="result-label">Evaluación completada</span><h1>{score/quiz.length >= .8 ? "Criterio sólido" : score/quiz.length >= .6 ? "Vas por buen camino" : "Hay una gran oportunidad de práctica"}</h1><p>{score/quiz.length >= .8 ? "Demuestras una comprensión consistente de los principios evaluados." : "Repasa la retroalimentación y vuelve a intentarlo para consolidar las decisiones técnicas."}</p><div className="actions centered"><button className="primary" onClick={() => startQuiz(activeModule)}>Repetir evaluación</button><button className="secondary" onClick={() => go("modules")}>Ver módulos</button></div></section>}
    </main>}

    {view === "cases" && <main className="inner"><div className="page-intro"><span>Aplicación profesional</span><h1>Casos para entrenar la mirada</h1><p>Lee la situación, formula tu diagnóstico y descubre una actuación razonada.</p></div><div className="case-grid">{cases.map((c,i)=><CaseCard key={c.title} index={i+1} {...c}/>)}</div></main>}

    {view === "progress" && <main className="inner"><div className="page-intro"><span>Tu avance</span><h1>Progreso local</h1><p>Tus mejores resultados se guardan en este dispositivo para que puedas volver y seguir practicando.</p></div><section className="progress-summary"><div><small>Módulos completados</small><b>{completed}<em>/ 8</em></b></div><div><small>Promedio de dominio</small><b>{bestAverage}<em>%</em></b></div><div><small>Mejor global</small><b>{progress.global || 0}<em>%</em></b></div></section><div className="progress-list">{modules.map(m=><div key={m.id}><span>{m.number}</span><div><b>{m.title}</b><div className="mini-track"><i style={{width:`${progress[m.id] || 0}%`}}/></div></div><strong>{progress[m.id] ?? "—"}{progress[m.id] !== undefined && "%"}</strong><button onClick={()=>startQuiz(m.id)}>Practicar</button></div>)}</div></main>}

    <footer><div className="brand"><span className="brand-mark">EP</span><span><b>Efecto Polvo</b><em>PRO</em></span></div><p>Herramienta complementaria de estudio · Aprende PMU</p><small>Contenido educativo basado en “Efecto Polvo: Técnica y Maestría”.</small></footer>
  </div>;
}

function AccessScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.trim() === ACCESS_PASSWORD) {
      localStorage.setItem(ACCESS_STORE, "granted");
      onSuccess();
      return;
    }
    setError("Contraseña incorrecta. Revisa la clave incluida con tu guía.");
  }
  return <main className="access-screen">
    <div className="access-decoration"><span/><span/><span/></div>
    <section className="access-card">
      <div className="access-brand"><span className="brand-mark">EP</span><span><b>Efecto Polvo</b><em>PRO</em></span></div>
      <div className="lock-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 10V7a5 5 0 0110 0v3M5 10h14v11H5z"/></svg></div>
      <span className="access-label">Acceso exclusivo</span>
      <h1>Ingresa con la clave de tu guía</h1>
      <p>Esta herramienta complementaria está disponible para estudiantes de Efecto Polvo: Técnica y Maestría.</p>
      <form onSubmit={submit}>
        <label htmlFor="access-password">Contraseña de la guía</label>
        <input id="access-password" autoFocus type="password" placeholder="Escribe tu clave" value={password} onChange={e => { setPassword(e.target.value); setError(""); }} />
        {error && <div className="access-error" role="alert">{error}</div>}
        <button type="submit">Acceder a Efecto Polvo PRO <Icon name="arrow" /></button>
      </form>
      <small>El acceso se guardará en este dispositivo. No necesitas crear una cuenta.</small>
    </section>
  </main>;
}

function CaseCard({ index, title, situation, diagnosis, action }: { index:number; title:string; situation:string; diagnosis:string; action:string }) {
  const [open,setOpen]=useState(false);
  return <article className="case-card"><span>Caso {String(index).padStart(2,"0")}</span><h2>{title}</h2><p>{situation}</p><button onClick={()=>setOpen(!open)}>{open ? "Ocultar análisis" : "Revelar análisis"}</button>{open && <div className="case-answer"><b>Lectura profesional</b><p>{diagnosis}</p><b>Actuación sugerida</b><p>{action}</p></div>}</article>;
}
