package com.ruby.pro203_exam.auth.service;

import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.model.UserRole;
import com.ruby.pro203_exam.auth.repository.UserRepository;
import com.ruby.pro203_exam.child.model.Child;
import com.ruby.pro203_exam.child.repository.ChildRepository;
import com.ruby.pro203_exam.child.repository.ParentChildRelationshipRepository;
import com.ruby.pro203_exam.staff.model.Staff;
import com.ruby.pro203_exam.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.UUID;

// Handles permission checks for what users can do
@RequiredArgsConstructor
@Service
@Slf4j
public class AuthorizationService {

    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final ChildRepository childRepository;
    private final ParentChildRelationshipRepository parentChildRepo;


    // Check if user is boss at a kindergarten
    public boolean isBossAt(UUID userId, UUID kindergartenId) {
        User user = getUser(userId);

        if (user.getRole() != UserRole.BOSS) {
            return false;
        }

        Staff staff = getStaffProfile(user.getProfileId());
        return kindergartenId.equals(staff.getKindergartenId());
    }

    // Check if user is staff at any kindergarten
    public boolean isStaffAt(UUID userId, UUID kindergartenId) {
        User user = getUser(userId);

        if (user.getRole() != UserRole.STAFF && user.getRole() != UserRole.BOSS) {
            return false;
        }

        Staff staff = getStaffProfile(user.getProfileId());
        return kindergartenId.equals(staff.getKindergartenId());
    }

    // Check if user is boss or privileged staff - admin rights
    public boolean isPrivilegedAt(UUID userId, UUID kindergartenId) {
        User user = getUser(userId);

        if (user.getRole() == UserRole.BOSS) {
            Staff staff = getStaffProfile(user.getProfileId());
            return kindergartenId.equals(staff.getKindergartenId());
        }

        if (user.getRole() == UserRole.STAFF) {
            Staff staff = getStaffProfile(user.getProfileId());
            return staff.getIsAdmin() && kindergartenId.equals(staff.getKindergartenId());
        }

        return false;
    }


    // Check if user can view a child
    public boolean canViewChild(UUID userId, UUID childId) {
        User user = getUser(userId);
        Child child = getChild(childId);

        if (user.getRole() == UserRole.PARENT) {
            return isParentOfChild(user.getProfileId(), childId);
        }

        if (user.getRole() == UserRole.STAFF || user.getRole() == UserRole.BOSS) {
            return isStaffAt(userId, child.getKindergartenId());
        }

        return false;
    }

    // Check if a user can edit a child
    public boolean canEditChild(UUID userId, UUID childId) {
        User user = getUser(userId);
        Child child = getChild(childId);

        if (user.getRole() == UserRole.PARENT) {
            return false;
        }

        return isPrivilegedAt(userId, child.getKindergartenId());
    }

    // Check if a user can add a child to a kindergarten
    public boolean canAddChild(UUID userId, UUID kindergartenId) {
        User user = getUser(userId);

        if (user.getRole() == UserRole.PARENT) {
            return true;
        }

        return isPrivilegedAt(userId, kindergartenId);
    }


    // Check if a user can view health data of a child
    public boolean canViewHealthData(UUID userId, UUID childId) {
        return canViewChild(userId, childId);
    }

    // Check if a user can edit health data
    public boolean canEditHealthData(UUID userId, UUID childId) {
        User user = getUser(userId);
        Child child = getChild(childId);

        if (user.getRole() == UserRole.PARENT) {
            return isParentOfChild(user.getProfileId(), childId);
        }

        if (user.getRole() == UserRole.BOSS) {
            return isBossAt(userId, child.getKindergartenId());
        }

        return false;
    }


    // Check if a user can check in
    public boolean canCheckIn(UUID userId, UUID childId) {
        return canViewChild(userId, childId);
    }

    // Check if a user can check out
    public boolean canCheckOut(UUID userId, UUID childId) {
        User user = getUser(userId);
        Child child = getChild(childId);

        if (user.getRole() == UserRole.PARENT) {
            return false;
        }

        return isStaffAt(userId, child.getKindergartenId());
    }


    // Check if a user can manage groups
    public boolean canManageGroups(UUID userId, UUID kindergartenId) {
        return isPrivilegedAt(userId, kindergartenId);
    }

    // Check if a user can assign staff to groups
    public boolean canAssignStaff(UUID userId, UUID kindergartenId) {
        return isBossAt(userId, kindergartenId);
    }


    // Check if a user can manage staff
    public boolean canManageStaff(UUID userId, UUID kindergartenId) {
        return isBossAt(userId, kindergartenId);
    }


    // Check if a user can edit kindergarten settings - Boss
    public boolean canEditKindergarten(UUID userId, UUID kindergartenId) {
        return isBossAt(userId, kindergartenId);
    }


   // Check if a user can add notes
    public boolean canAddNotes(UUID userId, UUID kindergartenId) {
        return isStaffAt(userId, kindergartenId);
    }

    // ------------------------------------- HELPER METHODS ------------------------------------- //

    private User getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
    }

    private Staff getStaffProfile(UUID profileId) {
        return staffRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Staff profile not found: " + profileId));
    }

    private Child getChild(UUID childId) {
        return childRepository.findById(childId)
                .orElseThrow(() -> new RuntimeException("Child not found: " + childId));
    }

    private boolean isParentOfChild(UUID parentId, UUID childId) {
        return parentChildRepo.existsByParentIdAndChildId(parentId, childId);
    }
}