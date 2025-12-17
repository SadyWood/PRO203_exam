package com.ruby.pro203_exam.parent.repository;

import com.ruby.pro203_exam.parent.model.Parent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParentRepository extends JpaRepository<Parent, UUID> {

    Optional<Parent> findByEmail(String email);

    boolean existsByEmail(String email);

    // Joins parent -> parentChildRelationship -> child - To filter by kindergarten
    @Query("SELECT DISTINCT p FROM Parent p " +
            "JOIN ParentChildRelationship pcr ON pcr.parentId = p.id " +
            "JOIN Child c ON c.id = pcr.childId " +
            "WHERE c.kindergartenId = :kindergartenId")
    List<Parent> findByKindergartenId(@Param("kindergartenId") UUID kindergartenId);
}
