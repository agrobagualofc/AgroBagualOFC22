import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  publishedAt: string;
  category: string;
}

export default function NewsSection() {
  const { data: news = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ["/api/news"],
  });

  const formatPublishTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours === 0) {
      return "Agora";
    } else if (diffInHours < 24) {
      return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) {
        return "Ontem";
      }
      return `Há ${diffInDays} dias`;
    }
  };

  return (
    <Card className="bg-white" data-testid="news-section">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold text-card-foreground" data-testid="news-title">
          Notícias do Dia
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4" data-testid="news-list">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex space-x-3 animate-pulse">
                  <div className="w-20 h-20 bg-muted rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            news.map((article) => (
              <div 
                key={article.id} 
                className="flex space-x-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                data-testid={`news-item-${article.id}`}
              >
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  data-testid={`img-news-${article.id}`}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-card-foreground text-sm leading-tight line-clamp-2" data-testid={`text-news-title-${article.id}`}>
                    {article.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary" className="text-xs" data-testid={`badge-news-category-${article.id}`}>
                      {article.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center" data-testid={`text-news-time-${article.id}`}>
                      <Clock className="w-3 h-3 mr-1" />
                      {formatPublishTime(article.publishedAt)}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-primary text-xs font-medium mt-1 p-0 h-auto"
                    data-testid={`button-read-more-${article.id}`}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    Ver mais
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
