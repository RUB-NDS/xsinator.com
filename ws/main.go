//go:build !benchmark
// +build !benchmark

package main

import (
	"log"
	"net/http"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}

// connectedCount is an atomic counter for current active connections.
var connectedCount int64

func wsHandler(w http.ResponseWriter, r *http.Request) {
	// Upgrade the HTTP connection to a WebSocket.
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}

	// Increment the counter for a new connection.
	atomic.AddInt64(&connectedCount, 1)

	go func(c *websocket.Conn) {
		defer func() {
			c.Close()
			// Decrement the counter when the connection is closed.
			atomic.AddInt64(&connectedCount, -1)
		}()

		// Outlive a full pool exhaustion run, but do not hold abandoned ones.
		c.SetReadDeadline(time.Now().Add(2 * time.Minute))

		// Read until the client goes away: gorilla answers the close frame from
		// inside ReadMessage, so the browser frees the socket slot right away
		// instead of waiting for the deadline.
		for {
			if _, _, err := c.ReadMessage(); err != nil {
				return
			}
		}
	}(conn)
}

func main() {
	http.HandleFunc("/", wsHandler)
	log.Println("WebSocket server listening on :8080")

	// Launch a goroutine that outputs the connection status every 10 seconds.
	go func() {
		ticker := time.NewTicker(10 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			log.Printf("Status: %d active connections", atomic.LoadInt64(&connectedCount))
		}
	}()

	// Start HTTP server (Traefik handles TLS termination)
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe error:", err)
	}
}
