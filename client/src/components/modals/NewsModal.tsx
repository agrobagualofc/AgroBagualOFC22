import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  publishedAt: string;
  category: string;
  content?: string;
}

interface NewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  news: NewsItem;
}

export default function NewsModal({ open, onOpenChange, news }: NewsModalProps) {
  const formatPublishTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFullContent = () => {
    if (news.content) {
      return news.content;
    }
    
    // Generate expanded content based on the category and title
    switch (news.category) {
      case 'tecnologia':
        return `${news.summary}

A nova tecnologia promete revolucionar o setor agrícola brasileiro com soluções inovadoras que aumentam significativamente a produtividade das fazendas. O equipamento utiliza inteligência artificial e sensores avançados para otimizar o plantio, irrigação e colheita.

Os primeiros testes realizados em fazendas do interior de São Paulo mostraram resultados impressionantes, com aumentos de produtividade que variam entre 25% e 35%, dependendo da cultura cultivada.

"Esta é uma revolução que estava esperando há anos", comenta João Silva, produtor rural de Ribeirão Preto. "A tecnologia não só aumentou nossa produção, mas também reduziu drasticamente os custos operacionais."

O investimento necessário para implementar a nova tecnologia varia entre R$ 150.000 e R$ 300.000, dependendo do tamanho da propriedade rural. O retorno do investimento é estimado em até 18 meses.`;

      case 'mercado':
        return `${news.summary}

O mercado do boi gordo apresenta alta expressiva nesta semana, impulsionado pela forte demanda interna e externa. A arroba do boi gordo atingiu R$ 320 na região de São Paulo, representando alta de 8% em relação à semana anterior.

Especialistas apontam que o cenário favorável deve se manter pelos próximos meses, principalmente devido ao aumento das exportações para países asiáticos e à estabilidade da economia brasileira.

"A demanda está aquecida tanto no mercado interno quanto externo", explica Maria Santos, analista de mercado da Consultoria AgroBrasil. "Os frigoríficos estão pagando preços premium pela qualidade do gado brasileiro."

A expectativa é que os preços se mantenham em patamares elevados até o final do ano, beneficiando diretamente os produtores rurais da região.`;

      case 'agricultura':
        return `${news.summary}

A safra de trigo 2025 bateu recorde histórico no Brasil, superando todas as expectativas iniciais. Com uma produção estimada em 9,2 milhões de toneladas, o país registra crescimento de 18% em relação ao ano anterior.

As condições climáticas favoráveis na região Sul, principal produtora de trigo do país, contribuíram decisivamente para este resultado excepcional. Chuvas bem distribuídas e temperaturas adequadas durante o ciclo de desenvolvimento da cultura foram fatores determinantes.

"Nunca vimos uma safra tão boa quanto esta", celebra Carlos Oliveira, presidente da Federação dos Produtores de Trigo do Rio Grande do Sul. "A qualidade dos grãos também está excelente, o que garante melhores preços no mercado."

A expectativa é que esta safra recorde contribua para reduzir a dependência brasileira de importações de trigo, fortalecendo a segurança alimentar do país.`;

      default:
        return `${news.summary}

Este é um desenvolvimento importante no setor agrícola brasileiro que merece atenção de todos os produtores rurais. As mudanças no cenário agropecuário têm impacto direto na economia nacional e na vida dos agricultores.

Especialistas recomendam que os produtores acompanhem de perto essas informações para tomar decisões estratégicas em suas propriedades. O agronegócio brasileiro continua sendo um dos pilares da economia nacional.

Para mais informações detalhadas, recomendamos consultar as principais associações do setor e manter-se atualizado através dos canais oficiais de comunicação do agronegócio.`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl max-h-[80vh] overflow-y-auto" data-testid="news-modal">
        <DialogHeader>
          <img 
            src={news.imageUrl} 
            alt={news.title}
            className="w-full h-48 rounded-lg object-cover mb-4"
            data-testid="modal-news-image"
          />
          <DialogTitle className="text-xl font-bold text-left leading-tight" data-testid="modal-news-title">
            {news.title}
          </DialogTitle>
          <div className="flex items-center space-x-3 pt-2">
            <Badge variant="secondary" className="text-sm" data-testid="modal-news-category">
              {news.category}
            </Badge>
            <span className="text-sm text-muted-foreground flex items-center" data-testid="modal-news-time">
              <Clock className="w-4 h-4 mr-1" />
              {formatPublishTime(news.publishedAt)}
            </span>
          </div>
        </DialogHeader>
        
        <div className="mt-4" data-testid="modal-news-content">
          <p className="text-base leading-relaxed whitespace-pre-line">
            {getFullContent()}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}