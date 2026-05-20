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

    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    if (msg) {
        msg.textContent = message;
    }
}

function clearError(inputId, msgId) {
    const input = document.getElementById(inputId);
    const msg = document.getElementById(msgId);

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");

    if (msg) {
        msg.textContent = "";
    }
}

async function submitLogin() {
    const password = document.getElementById("passwordInput").value;

    const hashed = await hashPassword(password);

    document.getElementById("password").value = hashed;

    document.getElementById("loginForm").submit();
}