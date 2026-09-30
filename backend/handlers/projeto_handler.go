package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"github.com/MarcosJose/projectflow/models"
)

func ProjetosHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Content-Type", "application/json")

		switch r.Method {

		// =========================
		// GET - LISTAR PROJETOS
		// =========================

		case http.MethodGet:

			rows, err := db.Query(`
				SELECT id, nome, descricao, status,
				       prioridade, prazo, responsavel, progresso
				FROM projetos
				ORDER BY id DESC
			`)

			if err != nil {
				http.Error(
					w,
					"Erro ao buscar projetos",
					http.StatusInternalServerError,
				)
				return
			}

			defer rows.Close()

			projetos := []models.Projeto{}

			for rows.Next() {

				var projeto models.Projeto
				var prazo sql.NullTime

				err := rows.Scan(
					&projeto.ID,
					&projeto.Nome,
					&projeto.Descricao,
					&projeto.Status,
					&projeto.Prioridade,
					&prazo,
					&projeto.Responsavel,
					&projeto.Progresso,
				)

				if err != nil {
					http.Error(
						w,
						"Erro ao processar projetos",
						http.StatusInternalServerError,
					)
					return
				}

				if prazo.Valid {
					projeto.Prazo = prazo.Time.Format("2006-01-02")
				}

				projetos = append(projetos, projeto)
			}

			json.NewEncoder(w).Encode(projetos)

		// =========================
		// POST - CRIAR PROJETO
		// =========================

		case http.MethodPost:

			var projeto models.Projeto

			err := json.NewDecoder(r.Body).Decode(&projeto)

			if err != nil {
				http.Error(
					w,
					"Dados inválidos",
					http.StatusBadRequest,
				)
				return
			}

			err = db.QueryRow(`
				INSERT INTO projetos
				(nome, descricao, status, prioridade, prazo, responsavel, progresso)
				VALUES ($1, $2, $3, $4, $5, $6, $7)
				RETURNING id
			`,
				projeto.Nome,
				projeto.Descricao,
				projeto.Status,
				projeto.Prioridade,
				projeto.Prazo,
				projeto.Responsavel,
				projeto.Progresso,
			).Scan(&projeto.ID)

			if err != nil {
				http.Error(
					w,
					"Erro ao cadastrar projeto",
					http.StatusInternalServerError,
				)
				return
			}

			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(projeto)

		// =========================
		// PUT - ATUALIZAR PROJETO
		// =========================

		case http.MethodPut:

			var projeto models.Projeto

			err := json.NewDecoder(r.Body).Decode(&projeto)

			if err != nil {
				http.Error(
					w,
					"Dados inválidos",
					http.StatusBadRequest,
				)
				return
			}

			result, err := db.Exec(`
				UPDATE projetos
				SET nome = $1,
				    descricao = $2,
				    status = $3,
				    prioridade = $4,
				    prazo = $5,
				    responsavel = $6,
				    progresso = $7
				WHERE id = $8
			`,
				projeto.Nome,
				projeto.Descricao,
				projeto.Status,
				projeto.Prioridade,
				projeto.Prazo,
				projeto.Responsavel,
				projeto.Progresso,
				projeto.ID,
			)

			if err != nil {
				http.Error(
					w,
					"Erro ao atualizar projeto",
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
					"Projeto não encontrado",
					http.StatusNotFound,
				)
				return
			}

			json.NewEncoder(w).Encode(projeto)

		// =========================
		// DELETE - EXCLUIR PROJETO
		// =========================

		case http.MethodDelete:

			var projeto models.Projeto

			err := json.NewDecoder(r.Body).Decode(&projeto)

			if err != nil {
				http.Error(
					w,
					"Dados inválidos",
					http.StatusBadRequest,
				)
				return
			}

			result, err := db.Exec(
				"DELETE FROM projetos WHERE id = $1",
				projeto.ID,
			)

			if err != nil {
				http.Error(
					w,
					"Erro ao excluir projeto",
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
					"Projeto não encontrado",
					http.StatusNotFound,
				)
				return
			}

			w.WriteHeader(http.StatusNoContent)

		// =========================
		// MÉTODO NÃO PERMITIDO
		// =========================

		default:

			http.Error(
				w,
				"Método não permitido",
				http.StatusMethodNotAllowed,
			)
		}
	}
}
