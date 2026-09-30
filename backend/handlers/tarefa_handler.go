package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/MarcosJose/projectflow/models"
)

func TarefasHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		switch r.Method {

		// =========================
		// GET - LISTAR TAREFAS
		// =========================

		case http.MethodGet:

			rows, err := db.Query(`
				SELECT id, titulo, descricao, projeto_id,
				       responsavel, prioridade, prazo, status
				FROM tarefas
				ORDER BY id DESC
			`)

			if err != nil {
				http.Error(
					w,
					"Erro ao buscar tarefas",
					http.StatusInternalServerError,
				)
				return
			}

			defer rows.Close()

			tarefas := []models.Tarefa{}

			for rows.Next() {

				var tarefa models.Tarefa
				var prazo sql.NullTime

				err := rows.Scan(
					&tarefa.ID,
					&tarefa.Titulo,
					&tarefa.Descricao,
					&tarefa.ProjetoID,
					&tarefa.Responsavel,
					&tarefa.Prioridade,
					&prazo,
					&tarefa.Status,
				)

				if err != nil {
					http.Error(
						w,
						"Erro ao processar tarefas",
						http.StatusInternalServerError,
					)
					return
				}

				if prazo.Valid {
					tarefa.Prazo = prazo.Time.Format("2006-01-02")
				}

				tarefas = append(tarefas, tarefa)
			}

			json.NewEncoder(w).Encode(tarefas)

		// =========================
		// POST - CRIAR TAREFA
		// =========================

		case http.MethodPost:

			var tarefa models.Tarefa

			err := json.NewDecoder(r.Body).Decode(&tarefa)

			if err != nil {
				http.Error(
					w,
					"Dados inválidos",
					http.StatusBadRequest,
				)
				return
			}

			err = db.QueryRow(`
				INSERT INTO tarefas
				(titulo, descricao, projeto_id, responsavel, prioridade, prazo, status)
				VALUES ($1, $2, $3, $4, $5, $6, $7)
				RETURNING id
			`,
				tarefa.Titulo,
				tarefa.Descricao,
				tarefa.ProjetoID,
				tarefa.Responsavel,
				tarefa.Prioridade,
				tarefa.Prazo,
				tarefa.Status,
			).Scan(&tarefa.ID)

			if err != nil {
				http.Error(
					w,
					"Erro ao cadastrar tarefa",
					http.StatusInternalServerError,
				)
				return
			}

			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(tarefa)

		// =========================
		// PUT - ATUALIZAR TAREFA
		// =========================

		case http.MethodPut:

			var tarefa models.Tarefa

			err := json.NewDecoder(r.Body).Decode(&tarefa)

			if err != nil {
				http.Error(
					w,
					"Dados inválidos",
					http.StatusBadRequest,
				)
				return
			}

			result, err := db.Exec(`
				UPDATE tarefas
				SET titulo = $1,
				    descricao = $2,
				    projeto_id = $3,
				    responsavel = $4,
				    prioridade = $5,
				    prazo = $6,
				    status = $7
				WHERE id = $8
			`,
				tarefa.Titulo,
				tarefa.Descricao,
				tarefa.ProjetoID,
				tarefa.Responsavel,
				tarefa.Prioridade,
				tarefa.Prazo,
				tarefa.Status,
				tarefa.ID,
			)

			if err != nil {
				http.Error(
					w,
					"Erro ao atualizar tarefa",
					http.StatusInternalServerError,
				)
				return
			}

			linhas, err := result.RowsAffected()

			if err != nil {
				http.Error(
					w,
					"Erro ao verificar atualização",
					http.StatusInternalServerError,
				)
				return
			}

			if linhas == 0 {
				http.Error(
					w,
					"Tarefa não encontrada",
					http.StatusNotFound,
				)
				return
			}

			json.NewEncoder(w).Encode(tarefa)

			// =========================
			// MÉTODO NÃO PERMITIDO
			// =========================
		case http.MethodDelete:

			var tarefa models.Tarefa

			err := json.NewDecoder(r.Body).Decode(&tarefa)

			if err != nil {
				http.Error(
					w,
					"Dados inválidos",
					http.StatusBadRequest,
				)
				return
			}

			result, err := db.Exec(
				"DELETE FROM tarefas WHERE id = $1",
				tarefa.ID,
			)

			if err != nil {
				http.Error(
					w,
					"Erro ao excluir tarefa",
					http.StatusInternalServerError,
				)
				return
			}

			linhas, err := result.RowsAffected()

			if err != nil {
				http.Error(
					w,
					"Erro ao verificar exclusão",
					http.StatusInternalServerError,
				)
				return
			}

			if linhas == 0 {
				http.Error(
					w,
					"Tarefa não encontrada",
					http.StatusNotFound,
				)
				return
			}

			w.WriteHeader(http.StatusNoContent)
			// codigo acima para deletar uma tarefa, caso queira deletar por id na url, posso alterar o codigo para isso.
		default:

			http.Error(
				w,
				"Método não permitido",
				http.StatusMethodNotAllowed,
			)
		}
	}
}
