package com.kalpanaa.education.repository;

import com.kalpanaa.education.model.User;
import com.kalpanaa.education.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByIdentifier(String identifier);
    Boolean existsByEmail(String email);
    List<User> findByRole(Role role);
}
