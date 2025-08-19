import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, BarChart3, MessageSquare } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Sistema de NPS</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Colete e analise o Net Promoter Score da sua empresa de forma simples e eficiente
        </p>
      </div>

      {/* Cards de Ação */}
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Avaliar Empresa</CardTitle>
            <CardDescription className="text-base">Deixe sua avaliação e comentário sobre uma empresa</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/feedback">
              <Button size="lg" className="w-full">
                Fazer Avaliação
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-secondary/10 rounded-full w-fit">
              <BarChart3 className="h-8 w-8 text-secondary-foreground" />
            </div>
            <CardTitle className="text-2xl">Relatórios NPS</CardTitle>
            <CardDescription className="text-base">Visualize os relatórios e métricas de satisfação</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/relatorios">
              <Button variant="secondary" size="lg" className="w-full">
                Ver Relatórios
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Informações sobre NPS */}
      <div className="mt-16 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />O que é NPS?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              O Net Promoter Score (NPS) é uma métrica que mede a satisfação e lealdade dos clientes.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-4 bg-red-500/10 rounded-lg">
                <div className="font-semibold text-red-400">Detratores</div>
                <div className="text-muted-foreground">1 - 2 estrelas</div>
              </div>
              <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                <div className="font-semibold text-yellow-400">Neutros</div>
                <div className="text-muted-foreground">3 estrelas</div>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <div className="font-semibold text-green-400">Promotores</div>
                <div className="text-muted-foreground">4 - 5 estrelas</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
