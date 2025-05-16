package com.efuel.efuel_dashboard.config;

import com.efuel.efuel_dashboard.Security.WebSocketAuthInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.messaging.web.csrf.CsrfChannelInterceptor;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.lang.NonNull;

@Configuration
@EnableWebSocketSecurity
public class WebSocketSecurityConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    public WebSocketSecurityConfig(WebSocketAuthInterceptor webSocketAuthInterceptor) {
        this.webSocketAuthInterceptor = webSocketAuthInterceptor;
    }

    @Override
    public void configureClientInboundChannel(@NonNull ChannelRegistration registration) {
        registration.interceptors(
                csrfChannelInterceptor(),
                webSocketAuthInterceptor);
    }

    @Bean
    public CsrfChannelInterceptor csrfChannelInterceptor() {
        CsrfChannelInterceptor interceptor = new CsrfChannelInterceptor();
        return interceptor;
    }
}