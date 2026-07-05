"use client";

import { FormEvent, useMemo, useState } from "react";

type Challenge = {
  level: string;
  title: string;
  prompt: string;
  hint: string;
  answer: string[];
};

const finalLocation = "Abre la puerta de entrada de la casa";

const challenges: Challenge[] = [
  {
    level: "LEVEL 01",
    title: "Trace Analysis",
    prompt:
      "Necesitas inspeccionar el historial de cambios sin modificar archivos, sin cambiar de rama y sin alterar el estado actual del proyecto. ¿Qué comando usarías?",
    hint: "Pista: muestra el historial de commits.",
    answer: ["git log"],
  },
  {
    level: "LEVEL 02",
    title: "Encoded Payload",
    prompt:
      "El sistema devolvió este payload: cmVsZWFzZQ==. Decodifica el contenido para continuar.",
    hint: "Pista: está codificado en Base64.",
    answer: ["release"],
  },
  {
    level: "LEVEL 03",
    title: "Environment Lock",
    prompt:
      "La versión ya pasó revisión, pruebas y aprobación. No está en local, no está en staging y no es un mock. ¿Cuál es el entorno final?",
    hint: "Pista: es el ambiente donde vive lo que ya está listo para usuarios reales.",
    answer: ["production", "produccion", "producción"],
  },
  {
    level: "BOSS FIGHT",
    title: "Version Gate",
    prompt:
      "Encontraste el historial, descifraste la release y llegaste a producción. Pero la compuerta final no se abre con una frase: necesita el nombre exacto del punto de control que marca una versión lista para salir. ¿Qué palabra buscas?",
    hint: "Pista: en Git se usa para marcar versiones como v1.0.0, v2.1.0, etc.",
    answer: ["tag", "git tag"],
  },
];

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function Home() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

  const [playerName, setPlayerName] = useState("");
  const [nameSubmitted, setNameSubmitted] = useState(false);

  const progress = useMemo(() => {
    return Math.round((step / challenges.length) * 100);
  }, [step]);

  const current = challenges[step];

  function handleNameSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!playerName.trim()) {
      setError("Debes ingresar tu nombre para iniciar la sesión.");
      return;
    }

    setError("");
    setNameSubmitted(true);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const userAnswer = normalize(input);
    const isCorrect = current.answer.some(
      (answer) => normalize(answer) === userAnswer,
    );

    if (!isCorrect) {
      setError("Access denied. Validación fallida. Intenta de nuevo.");
      return;
    }

    setError("");
    setInput("");
    setShowHint(false);

    if (step + 1 === challenges.length) {
      setAccessGranted(true);
      return;
    }

    setStep((previous) => previous + 1);
  }

  function restart() {
    setStep(0);
    setInput("");
    setError("");
    setShowHint(false);
    setAccessGranted(false);
    setPlayerName("");
    setNameSubmitted(false);
  }

  return (
    <main className="portal-shell">
      <div className="grid-bg" />

      <section className="portal-card">
        {!nameSubmitted ? (
          <section className="challenge-card">
            <p className="eyebrow">PRIVATE RELEASE PROTOCOL</p>
            <h1>Iniciar sesión</h1>

            <p className="prompt">
              Para comenzar la misión, introduce tu nombre.
            </p>

            <form onSubmit={handleNameSubmit} className="answer-form">
              <input
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
                placeholder="Escribe tu nombre..."
                autoFocus
              />
              <button type="submit">Start</button>
            </form>

            {error && <p className="error">{error}</p>}
          </section>
        ) : !accessGranted ? (
          <>
            <div className="top-bar">
              <span className="status-dot" />
              <span>PRIVATE RELEASE PROTOCOL</span>
              <span className="terminal-id">ID: CLASSIFIED</span>
            </div>

            <div className="hero-copy">
              <p className="eyebrow">SESSION ASSIGNED TO</p>
              <h1>{playerName.toUpperCase()}</h1>

              <p>
                Hay algo pendiente por desbloquear. Para acceder al siguiente
                paso, deberás completar esta secuencia.
              </p>

              <p>
                Responde correctamente cada reto y al final sabrás dónde empieza
                la misión.
              </p>
            </div>

            <div className="progress-wrapper" aria-label="progress">
              <div className="progress-info">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <article className="challenge-card">
              <p className="level">{current.level}</p>
              <h2>{current.title}</h2>
              <p className="prompt">{current.prompt}</p>

              {showHint && <p className="hint">{current.hint}</p>}

              <form onSubmit={handleSubmit} className="answer-form">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Escribe la respuesta..."
                  autoFocus
                />
                <button type="submit">Unlock</button>
              </form>

              {error && <p className="error">{error}</p>}

              <button
                className="hint-button"
                type="button"
                onClick={() => setShowHint(true)}
              >
                Solicitar pista
              </button>
            </article>
          </>
        ) : (
          <section className="success-card">
            <p className="eyebrow">ACCESS GRANTED</p>
            <h1>Mission complete</h1>

            <p>
              El protocolo fue completado correctamente. La última instrucción
              ya está disponible.
            </p>

            <div className="location-box">{finalLocation}</div>

            <p className="love-note">
              Ejecución completada. El código ya no es necesario; ahora la
              misión continúa fuera de esta pantalla.
            </p>

            <button type="button" onClick={restart}>
              Reiniciar misión
            </button>
          </section>
        )}
      </section>
    </main>
  );
}