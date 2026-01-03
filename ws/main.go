//go:build !testclient
// +build !testclient

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
	// log.Printf("New connection, active connections: %d", atomic.LoadInt64(&connectedCount))

	// Keep the connection open for 60 seconds, then close it.
	go func(c *websocket.Conn) {
		defer func() {
			// Decrement the counter when the connection is closed.
			atomic.AddInt64(&connectedCount, -1)
			// log.Printf("Connection closed, active connections: %d", atomic.LoadInt64(&connectedCount))
		}()
		time.Sleep(60 * time.Second)
		c.Close()
	}(conn)
}

func main() {
	http.HandleFunc("/", wsHandler)
	log.Println("WebSocket TLS server listening on :8080")

	// Launch a goroutine that outputs the connection status every 10 seconds.
	go func() {
		ticker := time.NewTicker(10 * time.Second)
		defer ticker.Stop()
		for range ticker.C {
			log.Printf("Status: %d active connections", atomic.LoadInt64(&connectedCount))
		}
	}()

	const certFile = "/etc/letsencrypt/live/xsinator.com/fullchain.pem"
	const keyFile = "/etc/letsencrypt/live/xsinator.com/privkey.pem"

	// Start the HTTPS server using TLS.
	err := http.ListenAndServeTLS(":8080", certFile, keyFile, nil)
	if err != nil {
		log.Fatal("ListenAndServeTLS error:", err)
	}
}
