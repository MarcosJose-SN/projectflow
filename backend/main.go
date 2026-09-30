package main

import (
	"database/sql"
	"fmt"
	"net/http"

	_ "github.com/lib/pq"

	"github.com/MarcosJose/projectflow/handlers"
)

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {

	connStr := "host=postgres port=5432 user=postgres password=123456 dbname=tasks sslmode=disable"
	db, err := sql.Open("postgres", connStr)

	if err != nil {
		fmt.Println("Erro ao conectar ao PostgreSQL:", err)
		return
	}

	defer db.Close()

	err = db.Ping()

	if err != nil {
		fmt.Println("Erro ao conectar ao PostgreSQL:", err)
		return
	}

	fmt.Println("PostgreSQL conectado com sucesso!")

	http.HandleFunc("/projetos", handlers.ProjetosHandler(db))
	http.HandleFunc("/tarefas", handlers.TarefasHandler(db))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "ProjectFlow API funcionando!")
	})

	fmt.Println("ProjectFlow API rodando em http://localhost:8081")

	err = http.ListenAndServe(":8081", enableCORS(http.DefaultServeMux))

	if err != nil {
		fmt.Println("Erro ao iniciar servidor:", err)
	}
}
