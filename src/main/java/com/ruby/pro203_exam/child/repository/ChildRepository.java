package com.ruby.pro203_exam.child.repository;

import com.ruby.pro203_exam.child.model.Child;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChildRepository extends CrudRepository<Child, UUID> {

    // Find all children in a group
    List<Child> findByGroupName(String groupName);

    // Find all checked in children
    List<Child> findByCheckedInTrue();

    // Find children by ParentID using JOIN with parent_child_relationships
    @Query("SELECT c FROM Child c " +
            "WHERE c.id IN (" +
            "  SELECT pcr.childId FROM ParentChildRelationship pcr " +
            "  WHERE pcr.parentId = :parentId" +
            ")")
    List<Child> findByParentId(@Param("parentId") UUID parentId);
}
