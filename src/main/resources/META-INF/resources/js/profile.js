window.onload = function () {
    fetch('/profile/info')
        .then(res => res.json())
        .then(data => {
            const usernameEl = document.getElementById('infoUsername');
            const emailEl = document.getElementById('infoEmail');
            const phoneEl = document.getElementById('infoPhone');
            const profileImg = document.getElementById('profileImg');

            if (usernameEl) usernameEl.textContent = data.username;
            if (emailEl) emailEl.textContent = data.email;
            if (phoneEl) phoneEl.textContent = data.phone;

            if (profileImg) {
                if (data.profileImage && data.profileImage !== "") {
                    profileImg.src = '/uploads/profile/' + data.profileImage;
                } else {
                    profileImg.src = '/uploads/profile/default.png';
                }
            }

            // 수정 폼에 기존 값 자동 채우기
            const updateEmail = document.getElementById('updateEmail');
            const updatePhone = document.getElementById('updatePhone');

            if (updateEmail) updateEmail.value = data.email;
            if (updatePhone) updatePhone.value = data.phone;

            // Tooltip으로 사용자명 표시
            const profileLink = document.getElementById('profileNavLink');

            if (profileLink) {
                profileLink.setAttribute('data-bs-title', '👋 ' + data.username);
                new bootstrap.Tooltip(profileLink);
            }
        });

    // URL 파라미터 확인
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const success = params.get("success");

    // 업로드 오류 메시지 처리
    const uploadErrorMsg = document.getElementById("uploadErrorMsg");

    if (uploadErrorMsg && error) {
        if (error === "invalid_type") {
            uploadErrorMsg.classList.remove("d-none");
            uploadErrorMsg.textContent = "jpg, png, gif, webp 파일만 가능합니다.";
        } else if (error === "too_large") {
            uploadErrorMsg.classList.remove("d-none");
            uploadErrorMsg.textContent = "파일 크기는 5MB 이하여야 합니다.";
        } else if (error === "upload_fail") {
            uploadErrorMsg.classList.remove("d-none");
            uploadErrorMsg.textContent = "업로드 실패. 다시 시도해주세요.";
        }
    }

    // 회원정보 수정 결과 메시지 처리
    const updateMsg = document.getElementById("updateMsg");
    const updateFormArea = document.getElementById("updateFormArea");

    if (updateMsg) {
        if (success === "updated") {
            updateMsg.classList.remove("d-none");
            updateMsg.classList.remove("alert-danger");
            updateMsg.classList.add("alert-success");
            updateMsg.textContent = "✅ 개인정보가 수정되었습니다.";

            if (updateFormArea) {
                updateFormArea.classList.add("show");
            }
        }

        if (error === "duplicate_email") {
            updateMsg.classList.remove("d-none");
            updateMsg.classList.remove("alert-success");
            updateMsg.classList.add("alert-danger");
            updateMsg.textContent = "이미 사용 중인 이메일입니다.";

            if (updateFormArea) {
                updateFormArea.classList.add("show");
            }
        }
    }

    // 비밀번호 변경 결과 메시지 처리
    const pwMsg = document.getElementById("pwMsg");

    if (pwMsg) {
        if (error === "wrong_password") {
            pwMsg.classList.remove("d-none");
            pwMsg.classList.remove("alert-success");
            pwMsg.classList.add("alert-danger");
            pwMsg.textContent = "현재 비밀번호가 올바르지 않습니다.";
        }

        if (success === "password_changed") {
            showToast(
                "✅ 비밀번호가 변경되었습니다. 잠시 후 로그인 페이지로 이동합니다.",
                "success"
            );

            setTimeout(function () {
                window.location.href = "/logout?next=login";
            }, 3500);
        }
    }
};


// ===============================
// 개인정보 수정 유효성 검사
// ===============================
function validateAndUpdate() {
    let valid = true;

    const email = document.getElementById('updateEmail').value.trim();
    const phone = document.getElementById('updatePhone').value.trim();

    // ① 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        showFieldError(
            'updateEmail',
            'updateEmailMsg',
            '올바른 이메일 형식이 아닙니다.'
        );
        valid = false;
    } else {
        clearFieldError('updateEmail', 'updateEmailMsg');
    }

    // ② 연락처 형식 검사
    const phoneRegex = /^010-\d{4}-\d{4}$/;

    if (!phoneRegex.test(phone)) {
        showFieldError(
            'updatePhone',
            'updatePhoneMsg',
            '010-0000-0000 형식으로 입력해주세요.'
        );
        valid = false;
    } else {
        clearFieldError('updatePhone', 'updatePhoneMsg');
    }

    if (valid) {
        document.getElementById('updateForm').submit();
    }
}


// ===============================
// 비밀번호 변경 유효성 검사 + 해시 처리
// ===============================
async function validateAndChangePassword() {
    let valid = true;

    const currentPw = document.getElementById('currentPwInput').value;
    const newPw = document.getElementById('newPwInput').value;
    const newPwConfirm = document.getElementById('newPwConfirm').value;

    // ① 현재 비밀번호 빈 값 체크
    if (!currentPw) {
        showFieldError(
            'currentPwInput',
            'currentPwMsg',
            '현재 비밀번호를 입력해주세요.'
        );
        valid = false;
    } else {
        clearFieldError('currentPwInput', 'currentPwMsg');
    }

    // ② 새 비밀번호 정규식 검사
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

    if (!pwRegex.test(newPw)) {
        showFieldError(
            'newPwInput',
            'newPwMsg',
            '8자 이상, 영문+숫자+특수문자를 포함해야 합니다.'
        );
        valid = false;
    } else {
        clearFieldError('newPwInput', 'newPwMsg');
    }

    // ③ 새 비밀번호 확인 일치
    if (newPw !== newPwConfirm) {
        showFieldError(
            'newPwConfirm',
            'newPwConfirmMsg',
            '새 비밀번호가 일치하지 않습니다.'
        );
        valid = false;
    } else {
        clearFieldError('newPwConfirm', 'newPwConfirmMsg');
    }

    if (!valid) return;

    // ④ 현재/새 비밀번호 SHA-256 해시 생성
    const hashedCurrent = await hashPassword(currentPw);
    const hashedNew = await hashPassword(newPw);

    document.getElementById('currentPassword').value = hashedCurrent;
    document.getElementById('newPassword').value = hashedNew;

    // F12 콘솔 확인용
    console.log('현재 PW 해시:', hashedCurrent);
    console.log('새 PW 해시:', hashedNew);

    document.getElementById('pwForm').submit();
}


// 입력 필드 오류 표시 함수
function showFieldError(fieldId, msgId, message) {
    const field = document.getElementById(fieldId);
    const msg = document.getElementById(msgId);

    if (field) {
        field.classList.add('is-invalid');
        field.classList.remove('is-valid');
    }

    if (msg) {
        msg.textContent = message;
    }
}

function clearFieldError(fieldId, msgId) {
    const field = document.getElementById(fieldId);
    const msg = document.getElementById(msgId);

    if (field) {
        field.classList.remove('is-invalid');
        field.classList.remove('is-valid');
    }

    if (msg) {
        msg.textContent = "";
    }
}


function showToast(message, type = 'success') {
    const toastEl = document.getElementById('liveToast');
    const toastBody = document.getElementById('toastBody');

    if (!toastEl || !toastBody) return;

    toastEl.className =
        `toast align-items-center text-white bg-${type} border-0`;

    toastBody.textContent = message;

    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}