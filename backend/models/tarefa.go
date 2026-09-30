package models

type Tarefa struct {
	ID          int    `json:"id"`
	Titulo      string `json:"titulo"`
	Descricao   string `json:"descricao"`
	ProjetoID   int    `json:"projeto_id"`
	Responsavel string `json:"responsavel"`
	Prioridade  string `json:"prioridade"`
	Prazo       string `json:"prazo"`
	Status      string `json:"status"`
}
