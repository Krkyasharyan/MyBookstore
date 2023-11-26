package com.example.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Users")
public class User{
        @Id
        @GeneratedValue(strategy = GenerationType.AUTO)
        private Long id;
        @Column(name = "username")
        private String username;
        @Column(name = "password")
        private String password;
        @Column(name = "email")
        private String email;
        @Column(name = "address")
        private String address;
        @Column(name = "phone_number")
        private String phoneNumber;
        @Column(name = "is_admin")
        private Boolean isAdmin;
        @Column(name = "is_disabled")
        private Boolean isDisabled;       

        @OneToOne(cascade = CascadeType.ALL, mappedBy = "user")
        @JsonManagedReference
        private Cart cart;

        @OneToMany(cascade = CascadeType.ALL, mappedBy = "user")
        @JsonManagedReference
        private List<Order> orders;

        @Override
        public String toString() {
                return "User{" +
                        "id=" + id +
                        ", username='" + username + '\'' +
                        ", password='" + password + '\'' +
                        ", email='" + email + '\'' +
                        ", address='" + address + '\'' +
                        ", phoneNumber='" + phoneNumber + '\'' +
                        ", isAdmin=" + isAdmin +
                        ", isDisabled=" + isDisabled +
                        '}';
        }
}
