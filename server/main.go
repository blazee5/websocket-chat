package main

import (
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	Type     string `json:"type"`
	Username string `json:"username"`
	Message  string `json:"message"`
}

type Server struct {
	clients map[*websocket.Conn]struct{}
}

func NewServer() *Server {
	return &Server{clients: make(map[*websocket.Conn]struct{})}
}

func (s *Server) handleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
		return
	}
	defer conn.Close()

	s.clients[conn] = struct{}{}

	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			return
		}

		var mes Message

		err = json.Unmarshal(p, &mes)

		if err != nil {
			log.Println(err)
		}

		for client := range s.clients {
			err = client.WriteJSON(mes)
			if err != nil {
				log.Println(err)
				return
			}
		}
	}
}

func main() {
	server := NewServer()

	http.HandleFunc("/ws", server.handleConnections)

	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("Error starting server: ", err)
	}
}
