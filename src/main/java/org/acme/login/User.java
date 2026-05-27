package org.acme.login;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "users")
public class User extends PanacheEntity {

    public String username;

    public String password; // SHA-256 해시값 저장

    @Column(unique = true)
    public String email;

    public String phone;

    // 신규 추가: 프로필 사진 파일명
    public String profileImage;

    // 아이디로 조회
    public static User findByUsername(String username) {
        return find("username", username).firstResult();
    }

    // 이메일로 조회
    public static User findByEmail(String email) {
        return find("email", email).firstResult();
    }
}