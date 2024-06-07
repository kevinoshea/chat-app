package com.chat.demo;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

public class ChatWebSocketHandler extends TextWebSocketHandler {

	private final Map<String, WebSocketSession> sessions = new HashMap<>();

	@Override
	public void afterConnectionEstablished(final WebSocketSession session) throws Exception {
		System.out.println("Connected: " + session.getId());
		this.sessions.put(session.getId(), session);
	}

	@Override
	protected void handleTextMessage(final WebSocketSession session, final TextMessage message) throws Exception {
		final String payload = message.getPayload();
		System.out.println("Received: " + payload);

		// Send message to all other clients:
		for (final Entry<String, WebSocketSession> entry : this.sessions.entrySet()) {
			final String sessionId = entry.getKey();
			if (!session.getId().equals(sessionId)) {
				final WebSocketSession sessionToSend = entry.getValue();
				sessionToSend.sendMessage(new TextMessage(payload));
			}
		}
	}

	@Override
	public void afterConnectionClosed(final WebSocketSession session, final CloseStatus status) throws Exception {
		System.out.println("Disconnected: " + session.getId());
		this.sessions.remove(session.getId());
	}
}