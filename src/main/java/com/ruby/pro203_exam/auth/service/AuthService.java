package com.ruby.pro203_exam.auth.service;

import com.ruby.pro203_exam.auth.dto.CompleteRegistrationDto;
import com.ruby.pro203_exam.auth.dto.OpenIdCallbackDto;
import com.ruby.pro203_exam.auth.dto.UserResponseDto;
import com.ruby.pro203_exam.auth.model.User;
import com.ruby.pro203_exam.auth.model.UserRole;
import com.ruby.pro203_exam.auth.repository.UserRepository;
import com.ruby.pro203_exam.parent.model.Parent;
import com.ruby.pro203_exam.parent.repository.ParentRepository;
import com.ruby.pro203_exam.staff.model.Staff;
import com.ruby.pro203_exam.staff.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

// Service for authentication and user management - handles the OpenID login flow and profile creation
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final ParentRepository parentRepository;
    private final StaffRepository staffRepository;
    // TODO: Add JwtService when we implement JWT

    // Handle openId Callback - called after user authenticates with OpenID provider
    // FLOW: Check if user exists by openidSubject -> if exists return existing user -> if not exists create user record without profile yet
    @Transactional(transactionManager = "authTransactionManager")
    public UserResponseDto handleOpenIdCallback(OpenIdCallbackDto dto) {
        log.info("handle openId callback for email: {}", dto.getEmail());

        // Check if user already exists
        User user = userRepository.findByOpenIdSubject(dto.getOpenidSubject())
                .orElseGet(() -> createNewUser(dto));

        return toResponseDto(user);
    }

    // Complete user registration - After login user chooses role and provides additional info, creates parent or staff profile
    // FLOW: Find user by ID -> check if user exists -> Create parent or staff entity based on role -> link profileID in user entity -> Return updated user
    public UserResponseDto completeRegistration(UUID userId, CompleteRegistrationDto dto) {
        log.info("complete registration for user: {}", userId);

        // Find user in auth db
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user has already a profile
        if (user.getProfileId() != null) {
            throw new RuntimeException("User already has profile");
        }
        // Set role
        user.setRole(dto.getRole());

        // Create a profile based on role
        UUID profileId;
        if (dto.getRole() == UserRole.PARENT) {
            profileId = createParentProfile(user, dto);
        } else if (dto.getRole() == UserRole.STAFF) {
            profileId = createStaffProfile(user, dto);
        } else {
            throw new RuntimeException("Invalid role for registration");
        }

        // Link profile to user
        user.setProfileId(profileId);
        User savedUser = userRepository.save(user);

        log.info("Completed registration for user: {} as {}", userId, dto.getRole());
        return toResponseDto(savedUser);
        }

    // Get user by ID
    public UserResponseDto getUserById(UUID id) {
        log.info("Fetching user: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponseDto(user);
    }

    // Get user by email
    public UserResponseDto getUserByEmail(String email) {
        log.info("Fetching user by email: {}", email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toResponseDto(user);
    }

    // ------------------------------------- HELPER METHODS ------------------------------------- //

    // Create new user record in auth database
    private User createNewUser(OpenIdCallbackDto dto) {
        log.info("Creating new user for email: {}", dto.getEmail());

        User user = User.builder()
                .openIdSubject(dto.getOpenidSubject())
                .email(dto.getEmail())
                .name(dto.getName())
                .role(null) // Will be set during registration completion
                .profileId(null) // Will be set when profile created
                .build();

        return userRepository.save(user);
    }

    // Create parent profile in app db
    private UUID createParentProfile(User user, CompleteRegistrationDto dto) {
        log.info("Creating parent profile for user: {}", user.getId());

        Parent parent = Parent.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(user.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .canPickup(true)
                .build();

        Parent saved = parentRepository.save(parent);
        log.info("Created parent profile: {}", saved.getId());
        return saved.getId();
    }

    // Create staff profile in app db
    private UUID createStaffProfile(User user, CompleteRegistrationDto dto) {
        log.info("Creating staff profile for user: {}", user.getId());

        Staff staff = Staff.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .email(user.getEmail())
                .phoneNumber(dto.getPhoneNumber())
                .employeeId(dto.getEmployeeId())
                .position(dto.getPosition())
                .build();

        Staff saved = staffRepository.save(staff);
        log.info("Created staff profile: {}", saved.getId());
        return saved.getId();
    }

    // Convert user entity to DTO
    private UserResponseDto toResponseDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .profileId(user.getProfileId())
                .build();
    }
}
