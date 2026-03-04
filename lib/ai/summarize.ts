const OPENAI_URL = "https://api.openai.com/v1/responses";

function getOpenAiApiKey() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error("Falta OPENAI_API_KEY");
  }
  return key;
}

export async function summarizeInSpanish(sourceText: string) {
  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getOpenAiApiKey()}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.2,
      input: [
        {
          role: "system",
          content:
            "Eres un asistente documental. Resume textos en español en 1 o 2 párrafos, tono neutral y claro. No inventes datos, no agregues hechos externos y si falta información mantente literal al texto recibido."
        },
        {
          role: "user",
          content: `Resume el siguiente texto en español:\n\n${sourceText}`
        }
      ]
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as { output_text?: string };
  const summary = data.output_text?.trim();

  if (!summary) {
    throw new Error("No se pudo generar el resumen.");
  }

  return summary;
}
