code:
```plantumlcode

@startuml
actor User as "Usuário"
rectangle "Plataforma Web" {
  User -> (Fazer Upload de Vídeo)
  User -> (Configurar Parâmetros da IA)
  (Fazer Upload de Vídeo) -> (Transcrever Vídeo)
  (Transcrever Vídeo) -> (Gerar Título e Descrição)
  (Configurar Parâmetros da IA) -> (Gerar Título e Descrição)
  (Gerar Título e Descrição) -> (Comunicar com a OpenAI)
  (Gerar Título e Descrição) -> (Exibir Resultados)
}
actor User as "Usuário"
@enduml

@enduml
```

output:
```plantumlcode

@startuml
User -> Fazer:Test
@enduml
```