package com.ruby.pro203_exam.group.repository;

import com.ruby.pro203_exam.group.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GroupRepository extends JpaRepository<Group, UUID> {
    List<Group> findByKindergartenId(UUID kindergartenId);

    Optional<Group> findByNameAndKindergartenId(String name, UUID kindergartenId);

    boolean existsByNameAndKindergartenId(String name, UUID kindergartenId);
}
