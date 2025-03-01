package main

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/go-chi/chi/v5"
)

const (
	port           = 5000
	requestTimeout = 5 * time.Second
)

func main() {
	r := chi.NewRouter()

	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", port),
		Handler:      r,
		ReadTimeout:  requestTimeout,
		WriteTimeout: requestTimeout,
		IdleTimeout:  requestTimeout,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			slog.Error("Failed to run server", "error", err)
		}
	}()

	slog.Info("Server running...")

	done := make(chan os.Signal, 1)
	signal.Notify(done, os.Interrupt)

	<-done

	ctx, cancel := context.WithTimeout(context.Background(), requestTimeout)
	defer cancel()

	server.Shutdown(ctx)
	slog.Info("Server shutdown gracefully")
}
