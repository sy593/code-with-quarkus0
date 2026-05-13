package org.acme.login;

import io.vertx.core.Vertx;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.SessionHandler;
import io.vertx.ext.web.sstore.LocalSessionStore;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;

public class SessionConfig {

    @Inject // 컨테이너 자동 주입
    Vertx vertx; // 세션 저장소 관리

    public void init(@Observes Router router) {
        router.route().handler(
                SessionHandler
                        .create(LocalSessionStore.create(vertx))
                        .setSessionTimeout(60 * 60 * 1000L) // 1시간
                        .setCookieHttpOnlyFlag(true)
        );
    }
}