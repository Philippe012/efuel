package com.efuel.efuel_dashboard.config;

import com.efuel.efuel_dashboard.Security.WebSocketAuthInterceptor;
import com.efuel.efuel_dashboard.config.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.socket.EnableWebSocketSecurity;
import org.springframework.security.messaging.web.csrf.CsrfChannelInterceptor;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketSecurity
public class WebSocketSecurityConfig implements WebSocketMessageBrokerConfigurer {

    private final WebSocketAuthInterceptor webSocketAuthInterceptor;

    public WebSocketSecurityConfig(WebSocketAuthInterceptor webSocketAuthInterceptor) {
        this.webSocketAuthInterceptor = webSocketAuthInterceptor;
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(
                csrfChannelInterceptor(),
                webSocketAuthInterceptor);
    }

    @Bean
    public CsrfChannelInterceptor csrfChannelInterceptor() {
        CsrfChannelInterceptor interceptor = new CsrfChannelInterceptor();
        interceptor.setCsrfTokenMatcher(message -> true);
        return interceptor;
    }
}