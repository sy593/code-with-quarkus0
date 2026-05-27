window.onload = function () {
    fetch('/profile/info')
        .then(res => res.json())
        .then(data => {
            // 프로필 페이지 정보 표시
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

            // 네비바 프로필 툴팁 표시
            const profileLink = document.getElementById('profileNavLink');

            if (profileLink) {
                profileLink.setAttribute('data-bs-title', '👋 ' + data.username);
                new bootstrap.Tooltip(profileLink);
            }
        });
};