//go:build testclient
// +build testclient

package main

import (
	"fmt"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const wsURL = "wss://xsinator.com:8080"

func testConnections(iteration, numConns int) {
	var wg sync.WaitGroup
	wg.Add(numConns)
	start := time.Now()
	for i := 0; i < numConns; i++ {
		go func(i int) {
			defer wg.Done()
			// Dial the websocket endpoint using gorilla/websocket
			ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
			if err != nil {
				log.Printf("Iteration %d - Connection %d error: %v", iteration, i, err)
				return
			}
			ws.Close()
		}(i)
	}
	wg.Wait()
	elapsed := time.Since(start)
	fmt.Printf("Iteration %d: %s elapsed for %d connections\n", iteration, elapsed, numConns)
}

func main() {
	iterations := 3
	numConns := 100
	for i := 1; i <= iterations; i++ {
		fmt.Printf("Starting iteration %d...\n", i)
		testConnections(i, numConns)
	}
}
