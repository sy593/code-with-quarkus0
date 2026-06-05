function validateAndLogin() {
    let valid = true;

    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value;

    // 아이디: 4~20자 영문/숫자
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;

    if (!usernameRegex.test(username)) {
        showError("usernameInput", "usernameMsg", "아이디는 4~20자 영문/숫자만 가능합니다.");
        valid = false;
    } else {
        clearError("usernameInput", "usernameMsg");
    }

    // 패스워드: 8자 이상, 영문 + 숫자 + 특수문자 포함
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (!passwordRegex.test(password)) {
        showError("passwordInput", "passwordMsg", "8자 이상, 영문+숫자+특수문자를 포함해야 합니다.");
        valid = false;
    } else {
        clearError("passwordInput", "passwordMsg");
    }

    // 유효성 검사를 통과하면 암호화 후 로그인 실행
    if (valid) {
        submitLogin();
    }
}

function showError(inputId, msgId, message) {
    const input = document.getElementById(inputId);
    const msg = document.getElementById(msgId);

    if (input) {
        input.classList.add("is-invalid");
        input.classList.remove("is-valid");
    }

    if (msg) {
        msg.textContent = message;
        msg.style.display = "block";
    }
}

function clearError(inputId, msgId) {
    const input = document.getElementById(inputId);
    const msg = document.getElementById(msgId);

    if (input) {
        input.classList.remove("is-invalid");
        input.classList.remove("is-valid");
    }

    if (msg) {
        msg.textContent = "";
        msg.style.display = "none";
    }
}

async function submitLogin() {
    const password = document.getElementById("passwordInput").value;

    // 입력한 패스워드를 SHA-256 해시값으로 변환
    const hashed = await hashPassword(password);

    // 실제 서버로 전송되는 hidden input에 해시값 저장
    document.getElementById("password").value = hashed;

    // 로그인 폼 전송
    document.getElementById("loginForm").submit();
}

// 로그인 실패 시 URL의 error 값을 확인하여 오류 메시지 표시
window.addEventListener("load", function () {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error === "1") {
        showError(
            "passwordInput",
            "passwordMsg",
            "아이디 또는 패스워드가 올바르지 않습니다."
        );
    }
});