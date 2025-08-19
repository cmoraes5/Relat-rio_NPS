"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Search,
  Star,
  TrendingUp,
  MessageSquare,
  User,
} from "lucide-react";
import Link from "next/link";
import { api, Company, Feedback, NPSData } from "@/lib/api";

export default function RelatoriosPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [npsData, setNPSData] = useState<NPSData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Carregar empresas
  useEffect(() => {
    const fetchCompanies = async () => {
      const data = await api.getCompanies();
      setCompanies(data);
    };

    fetchCompanies();
  }, []);

  // Carregar dados quando empresa é selecionada
  useEffect(() => {
    if (selectedCompany) {
      fetchCompanyData(selectedCompany);
    }
  }, [selectedCompany]);

  const fetchCompanyData = async (companyName: string) => {
    setIsLoading(true);
    try {
      // Buscar feedbacks
      const [feedbackData, npsDataResult] = await Promise.all([
        api.getFeedbacks(companyName),
        api.getNPSData(companyName),
      ]);

      setFeedbacks(feedbackData);
      setNPSData(npsDataResult);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setFeedbacks([]);
      setNPSData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getNPSColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getNPSBadgeVariant = (score: number) => {
    if (score >= 70) return "default";
    if (score >= 30) return "secondary";
    return "destructive";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Relatórios NPS</h1>
        <p className="text-muted-foreground mt-2">
          Visualize as métricas de satisfação por empresa
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Lista de Empresas */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Empresas
              </CardTitle>
              <CardDescription>
                Selecione uma empresa para ver os relatórios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Buscar empresa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredCompanies.map((company) => (
                  <Button
                    key={company.id}
                    variant={
                      selectedCompany === company.name ? "default" : "ghost"
                    }
                    className="w-full justify-start"
                    onClick={() => setSelectedCompany(company.name)}
                  >
                    {company.name}
                  </Button>
                ))}
                {filteredCompanies.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma empresa encontrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Relatórios */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedCompany ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Selecione uma empresa para visualizar os relatórios
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Carregando dados...</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Métricas NPS */}
              {npsData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      NPS - {npsData.companyName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold ${getNPSColor(
                            npsData.nps
                          )}`}
                        >
                          {npsData.nps}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Score NPS
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-foreground">
                          {npsData.totalResponses}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Total Respostas
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-red-500">
                          {npsData.detractors}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Detratores
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-yellow-500">
                          {npsData.neutrals}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Neutros
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-semibold text-green-500">
                          {npsData.promoters}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Promotores
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <Badge
                        variant={getNPSBadgeVariant(npsData.nps)}
                        className="text-lg px-4 py-2"
                      >
                        {npsData.nps >= 70
                          ? "Excelente"
                          : npsData.nps >= 30
                          ? "Bom"
                          : "Precisa Melhorar"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Lista de Feedbacks */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Feedbacks Recebidos
                  </CardTitle>
                  <CardDescription>
                    {feedbacks.length} avaliação(ões) encontrada(s)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {feedbacks.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhum feedback encontrado para esta empresa
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {feedbacks.map((feedback) => (
                        <div
                          key={feedback.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= feedback.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground"
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-medium">
                                {feedback.rating}/5
                              </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(feedback.createdAt).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>
                          </div>
                          {feedback.userName && (
                            <div className="flex items-center gap-1 mb-2">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {feedback.userName}
                              </span>
                            </div>
                          )}
                          {feedback.comment && (
                            <p className="text-sm text-muted-foreground">
                              "{feedback.comment}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
