package org.acme.login;

import io.vertx.ext.web.RoutingContext;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.InputStream;
import java.net.URI;

import jakarta.transaction.Transactional;



@Path("/")
public class AuthResource {

    @Inject
    RoutingContext context;

    // GET /login → 로그인 HTML 페이지 반환
    @GET
    @Path("/login")
    @Produces(MediaType.TEXT_HTML)
    public Response loginPage() {

        InputStream html = getClass()
                .getClassLoader()
                .getResourceAsStream("META-INF/resources/login/login.html");

        return Response.ok(html).build();
    }

    // POST /login_check → 로그인 처리
    @POST
    @Path("/login_check")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response loginCheck(
            @FormParam("username") String username,
            @FormParam("password") String password) {

        User user = User.findByUsername(username);

        // 아이디가 없거나 비밀번호가 틀린 경우
        if (user == null || !user.password.equals(password)) {
            return Response
                    .seeOther(URI.create("/login?error=1"))
                    .build();
        }

        // 세션에 로그인 정보 저장
        context.session().put("loginUser", username);

        return Response
                .seeOther(URI.create("/after_login"))
                .build();
    }

// GET / → 세션 유무에 따라 메인 페이지 분기
@GET
@Produces(MediaType.TEXT_HTML)
public Response mainPage() {
String loginUser = context.session().get("loginUser");
System.out.println("=== [GET /] 세션 ID : " +
context.session().id());
System.out.println("=== [GET /] loginUser : " + loginUser);
String htmlPath = (loginUser != null)
? "META-INF/resources/login/main_after_login.html"
: "META-INF/resources/main_index.html";
InputStream html =
getClass().getClassLoader().getResourceAsStream(htmlPath);
return Response.ok(html).build();
}




    // GET /after_login → 로그인 후 페이지 반환
    @GET
    @Path("/after_login")
    @Produces(MediaType.TEXT_HTML)
    public Response afterLogin() {

        // 세션 체크: 로그인 안 한 사용자 차단
        String loginUser = context.session().get("loginUser");

        // 세션 내용 로그 출력
        System.out.println("=== 세션 ID : " + context.session().id());
        System.out.println("=== loginUser : " + loginUser);

        if (loginUser == null) {
            // 세션 없음 → 로그인 페이지로 강제 이동
            return Response
                    .seeOther(URI.create("/login"))
                    .build();
        }

        // 세션 있음 → 로그인 후 HTML 반환
        InputStream html = getClass()
                .getClassLoader()
                .getResourceAsStream("META-INF/resources/login/main_after_login.html");

        return Response.ok(html).build();
    }

    // GET /logout → 로그아웃 처리
    @GET
    @Path("/logout")
    public Response logout() {

        // 로그아웃 전 세션 정보 출력
        System.out.println("=== 로그아웃 전 세션 ID : " + context.session().id());
        System.out.println("=== 로그아웃 전 loginUser : " + context.session().get("loginUser"));

        // 세션 전체 삭제
        context.session().destroy();

        // 로그아웃 후 세션 정보 출력
        System.out.println("=== 로그아웃 후 세션 ID : " + context.session().id());
        System.out.println("=== 로그아웃 후 loginUser : " + context.session().get("loginUser"));

        return Response
                .seeOther(URI.create("/"))
                .build();
    }

    // AuthResource.java 아래 새로 추가
        @GET
        @Path("/register")
        @Produces(MediaType.TEXT_HTML)
        public Response registerPage() {
        InputStream html = getClass()
        .getClassLoader()
        .getResourceAsStream(
        "META-INF/resources/login/register.html");
        return Response.ok(html).build();
        }

        // POST /register_check → 회원가입 처리
@POST
@Path("/register_check")
@Transactional
@Consumes(MediaType.APPLICATION_FORM_URLENCODED)
@Produces(MediaType.TEXT_HTML)
public Response registerCheck(
        @FormParam("username") String username,
        @FormParam("password") String password,   // SHA-256 해시값
        @FormParam("email") String email,
        @FormParam("phone") String phone) {

    // ① 아이디 중복 체크
    if (User.findByUsername(username) != null) {
        return Response
                .seeOther(URI.create("/register?error=duplicate_username"))
                .build();
    }

    // ② 이메일 중복 체크
    if (User.findByEmail(email) != null) {
        return Response
                .seeOther(URI.create("/register?error=duplicate_email"))
                .build();
    }

    // ③ DB 삽입
    User newUser = new User();
    newUser.username = username;
    newUser.password = password;  // 해시값 저장
    newUser.email = email;
    newUser.phone = phone;

    newUser.persist();

    // ④ 가입 완료 페이지로 이동
    return Response
            .seeOther(URI.create("/register_success"))
            .build();
    }

    @GET
@Path("/register_success")
@Produces(MediaType.TEXT_HTML)
public Response registerSuccess() {
InputStream html = getClass()
.getClassLoader()
.getResourceAsStream(
"META-INF/resources/login/register_success.html");
return Response.ok(html).build();
}


}