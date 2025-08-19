"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star, CheckCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"
// import { useToast } from "@/hooks/use-toast"

export default function FeedbackPage() {
  const [companyName, setCompanyName] = useState("")
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  // const { toast } = useToast()

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!companyName.trim() || rating === 0) {
      // toast({
      //   title: "Campos obrigatórios",
      //   description: "Por favor, preencha o nome da empresa e selecione uma avaliação.",
      //   variant: "destructive",
      // })
      alert("Campos obrigatórios.")
      return
    }

    setIsSubmitting(true)

    try {
      await api.createFeedback({
        companyName: companyName.trim(),
        rating,
        comment: comment.trim(),
      })

      setIsSubmitted(true)
      // toast({
      //   title: "Avaliação enviada!",
      //   description: "Obrigado pelo seu feedback.",
      // })
      alert("Avaliação enviada! Obrigado pelo seu feedback.")
    } catch (error) {
      console.error("Erro ao enviar feedback:", error)
      // toast({
      //   title: "Erro",
      //   description: "Não foi possível enviar sua avaliação. Tente novamente.",
      //   variant: "destructive",
      // })
      alert("Não foi possível enviar sua avaliação. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setCompanyName("")
    setRating(0)
    setComment("")
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4">
          <div className="absolute top-8 left-8">
            <Link href="/">
              <Button variant="ghost">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
          </div>
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Obrigado!</h2>
              <p className="text-muted-foreground mb-6">Sua avaliação foi enviada com sucesso.</p>
              <div className="space-y-2">
                <Button onClick={resetForm} className="w-full">
                  Fazer Nova Avaliação
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    Voltar ao Início
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Avaliar Empresa</h1>
        <p className="text-muted-foreground mt-2">Compartilhe sua experiência e ajude outros clientes</p>
      </div>

      {/* Formulário */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Nova Avaliação</CardTitle>
          <CardDescription>Preencha os campos abaixo para enviar sua avaliação</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome da Empresa */}
            <div className="space-y-2">
              <Label htmlFor="company">Nome da Empresa *</Label>
              <Input
                id="company"
                placeholder="Digite o nome da empresa"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            {/* Avaliação com Estrelas */}
            <div className="space-y-2">
              <Label>Avaliação *</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && <span className="ml-2 text-sm text-muted-foreground">{rating} de 5 estrelas</span>}
              </div>
            </div>

            {/* Comentário */}
            <div className="space-y-2">
              <Label htmlFor="comment">Comentário (opcional)</Label>
              <Textarea
                id="comment"
                placeholder="Conte-nos mais sobre sua experiência..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>

            {/* Botão de Envio */}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
