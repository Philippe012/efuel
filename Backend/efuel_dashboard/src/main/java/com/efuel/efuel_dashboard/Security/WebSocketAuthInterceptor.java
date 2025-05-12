package com.efuel.efuel_dashboard.Security;

import org.springframework.lang.NonNull;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    @Override
    public Message<?> preSend(@NonNull Message<?> message, @NonNull MessageChannel channel) {
        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.wrap(message);

        // Get message type from headers instead of deprecated getCommand()
        String messageType = accessor.getFirstNativeHeader("simpMessageType");

        if (messageType == null) {
            return message;
        }

        // For CONNECT messages, verify authentication
        if ("CONNECT".equals(messageType)) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated()) {
                throw new SecurityException("WebSocket connection requires authentication");
            }
        }

        // For SUBSCRIBE messages, verify authorization
        if ("SUBSCRIBE".equals(messageType)) {
            String destination = accessor.getDestination();
            if (destination != null && destination.startsWith("/topic/dashboard/private")) {
                // Add your custom authorization logic here
                // Example: check if user has access to this dashboard data
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth == null || !auth.isAuthenticated()) {
                    throw new SecurityException("Subscription to private channel requires authentication");
                }
            }
        }

        return message;
    }
}