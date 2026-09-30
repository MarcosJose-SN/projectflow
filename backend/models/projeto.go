package models

type Projeto struct {
	ID          int    `json:"id"`
	Nome        string `json:"nome"`
	Descricao   string `json:"descricao"`
	Status      string `json:"status"`
	Prioridade  string `json:"prioridade"`
	Prazo       string `json:"prazo"`
	Responsavel string `json:"responsavel"`
	Progresso   int    `json:"progresso"`
}
