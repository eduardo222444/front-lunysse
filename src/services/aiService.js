import { InferenceClient } from "@huggingface/inference";
 
const client = new InferenceClient(import.meta.env.VITE_HF_TOKEN);
 
export async function enviarParaIA(mensagemUsuario, historicoConversa = []) {

  if (!mensagemUsuario?.trim()) {

    throw new Error("Mensagem vazia");

  }
 
  try {

    const mensagensContexto = [

      {

        role: "system",

        content: `Você é um assistente de IA especializado em psicologia clínica. Suas características:
 
- Forneça orientações baseadas em evidências científicas

- Mantenha um tom profissional e empático

- Sugira técnicas terapêuticas apropriadas

- Considere aspectos éticos da prática psicológica

- Lembre-se do contexto da conversa anterior

- Seja específico em suas recomendações

- Quando apropriado, mencione referências teóricas
 
FORMATAÇÃO DAS RESPOSTAS:

- Use markdown para estruturar suas respostas

- Organize com títulos (##), subtítulos (###) e listas (-)

- Use **negrito** para destacar conceitos importantes

- Separe seções claramente

- Inclua técnicas específicas em listas numeradas quando apropriado

- Termine com uma pergunta de acompanhamento quando relevante
 
Você está auxiliando psicólogos em sua prática clínica.`

      }

    ];
 
    const historicoRecente = historicoConversa.slice(-10);

    historicoRecente.forEach(msg => {

      if (msg.type === 'user') {

        mensagensContexto.push({ role: "user", content: msg.content });

      } else if (msg.type === 'bot') {

        mensagensContexto.push({ role: "assistant", content: msg.content });

      }

    });
 
    mensagensContexto.push({ role: "user", content: mensagemUsuario });
 
    const resposta = await client.chatCompletion({

      provider: "novita",

      model: "zai-org/GLM-4.5",

      messages: mensagensContexto,

      max_tokens: 1500,

      temperature: 0.7,

      top_p: 0.9,

      frequency_penalty: 0.1,

      presence_penalty: 0.1

    });
 
    const conteudo = resposta.choices?.[0]?.message?.content?.trim();

    if (!conteudo) {

      throw new Error("Resposta vazia da IA");

    }
 
    return conteudo.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  } catch (error) {

    console.error("Erro na API Hugging Face:", error);

    if (error.message?.includes("401") || error.message?.includes("unauthorized")) {

      throw new Error("Token de API inválido");

    }

    if (error.message?.includes("429") || error.message?.includes("rate limit")) {

      throw new Error("Muitas requisições. Tente novamente em alguns segundos");

    }

    if (error.message?.includes("network") || error.message?.includes("fetch")) {

      throw new Error("Erro de conexão. Verifique sua internet");

    }

    throw new Error("Erro inesperado ao conectar com a IA");

  }

}
 