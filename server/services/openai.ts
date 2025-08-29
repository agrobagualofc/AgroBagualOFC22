import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function chatWithAI(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
      messages: [
        {
          role: "system",
          content: `Você é a SemeIA, uma assistente especializada em agronegócio. Você deve responder perguntas sobre:
            - Agricultura (plantio, colheita, pragas, doenças)
            - Pecuária (manejo, alimentação, reprodução, saúde animal)
            - Mercado agrícola (preços, commodities, tendências)
            - Tecnologia agrícola (equipamentos, GPS, automação)
            - Sustentabilidade e práticas agrícolas
            
            Sempre forneça respostas práticas, técnicas e úteis. Seja concisa mas detalhada.
            Use linguagem profissional mas acessível. Foque em soluções práticas.`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "Desculpe, não consegui processar sua pergunta.";
  } catch (error) {
    console.error("OpenAI Chat Error:", error);
    throw new Error("Falha ao processar mensagem com IA");
  }
}

export async function analyzeImageWithAI(base64Image: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5", // the newest OpenAI model is "gpt-5" which was released August 7, 2025
      messages: [
        {
          role: "system",
          content: `Você é a SemeIA, especialista em análise visual agrícola. Analise esta imagem e identifique:
            - Plantas, culturas ou pragas presentes
            - Doenças ou problemas visíveis
            - Recomendações de tratamento ou prevenção
            - Identificação de equipamentos agrícolas
            - Condições do solo ou clima
            
            Forneça uma análise técnica detalhada com recomendações práticas.`
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analise esta imagem agrícola e forneça um diagnóstico detalhado com recomendações."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ],
        },
      ],
      max_tokens: 600,
    });

    return response.choices[0].message.content || "Não foi possível analisar a imagem.";
  } catch (error) {
    console.error("OpenAI Vision Error:", error);
    throw new Error("Falha na análise da imagem");
  }
}
