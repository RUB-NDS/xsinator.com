//go:build benchmark
// +build benchmark

package main

import (
	"flag"
	"fmt"
	"sync"
	"sync/atomic"
	"time"

	"github.com/gorilla/websocket"
)

func benchmarkConcurrent(wsURL string, numConns int, concurrency int, keepOpen bool) (time.Duration, int64, int64) {
	var successCount int64
	var failCount int64
	conns := make([]*websocket.Conn, 0, numConns)
	var connsMu sync.Mutex

	// Semaphore for concurrency limit
	sem := make(chan struct{}, concurrency)
	var wg sync.WaitGroup

	start := time.Now()

	for i := 0; i < numConns; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			sem <- struct{}{}        // Acquire
			defer func() { <-sem }() // Release

			ws, _, err := websocket.DefaultDialer.Dial(wsURL, nil)
			if err != nil {
				atomic.AddInt64(&failCount, 1)
				return
			}
			atomic.AddInt64(&successCount, 1)
			if keepOpen {
				connsMu.Lock()
				conns = append(conns, ws)
				connsMu.Unlock()
			} else {
				ws.Close()
			}
		}(i)
	}

	wg.Wait()
	elapsed := time.Since(start)

	// Close all connections if we kept them open
	if keepOpen {
		for _, ws := range conns {
			ws.Close()
		}
	}

	return elapsed, successCount, failCount
}

func main() {
	wsURL := flag.String("url", "wss://ws.xsinator.com", "WebSocket URL to benchmark")
	numConns := flag.Int("n", 255, "Number of connections to open")
	iterations := flag.Int("i", 5, "Number of iterations")
	keepOpen := flag.Bool("keep", true, "Keep connections open during benchmark")
	concurrency := flag.Int("c", 0, "Concurrency limit (0 = unlimited)")
	flag.Parse()

	concurrencyStr := "unlimited"
	if *concurrency > 0 {
		concurrencyStr = fmt.Sprintf("%d", *concurrency)
	}
	fmt.Printf("Benchmarking %s with %d connections, %d iterations, keepOpen=%v, concurrency=%s\n\n",
		*wsURL, *numConns, *iterations, *keepOpen, concurrencyStr)

	var totalDuration time.Duration
	var totalSuccess, totalFail int64

	for i := 1; i <= *iterations; i++ {
		var elapsed time.Duration
		var success, fail int64

		if *concurrency > 0 {
			elapsed, success, fail = benchmarkConcurrent(*wsURL, *numConns, *concurrency, *keepOpen)
		} else {
			elapsed, success, fail = benchmarkConcurrent(*wsURL, *numConns, *numConns, *keepOpen)
		}

		totalDuration += elapsed
		totalSuccess += success
		totalFail += fail

		fmt.Printf("Iteration %d: %v - %d success, %d failed (%.0f conn/s)\n",
			i, elapsed, success, fail, float64(success)/elapsed.Seconds())

		// Small delay between iterations
		time.Sleep(500 * time.Millisecond)
	}

	avgDuration := totalDuration / time.Duration(*iterations)
	avgSuccess := totalSuccess / int64(*iterations)
	avgFail := totalFail / int64(*iterations)

	fmt.Printf("\n=== Summary ===\n")
	fmt.Printf("Average: %v - %d success, %d failed\n", avgDuration, avgSuccess, avgFail)
	fmt.Printf("Average throughput: %.0f connections/second\n", float64(avgSuccess)/avgDuration.Seconds())
}
