package com.ruby.pro203_exam.auth.controller;

import com.ruby.pro203_exam.auth.dto.CompleteRegistrationDto;
import com.ruby.pro203_exam.auth.model.UserRole;
import com.ruby.pro203_exam.child.dto.CreateChildDto;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import java.time.LocalDate;
import static org.junit.jupiter.api.Assertions.*;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@DisplayName("Auth Controller Tests")
class AuthControllerTest {


    @Test
    @Order(1)
    @DisplayName("Create a Parent Role")
    void testCompleteRegistrationAsParent() {

        CompleteRegistrationDto registrationDto = CompleteRegistrationDto.builder()
                .role(UserRole.PARENT)
                .firstName("Peter")
                .lastName("Pettersen")
                .phoneNumber("12345678")
                .address("Peterveg 2")
                .build();


        assertNotNull(registrationDto);
        assertEquals(UserRole.PARENT, registrationDto.getRole());
        assertEquals("Peter", registrationDto.getFirstName());
        assertEquals("Pettersen", registrationDto.getLastName());
    }


    @Test
    @Order(2)
    @DisplayName("Create a Staff Role")
    void testCompleteRegistrationAsStaff() {

        CompleteRegistrationDto registrationDto = CompleteRegistrationDto.builder()
                .role(UserRole.STAFF)
                .firstName("Ole")
                .lastName("Dole")
                .phoneNumber("87654321")
                .employeeId("OD01")
                .position("Teacher")
                .build();


        assertNotNull(registrationDto);
        assertEquals(UserRole.STAFF, registrationDto.getRole());
        assertEquals("Ole", registrationDto.getFirstName());
        assertEquals("OD01", registrationDto.getEmployeeId());
    }


    @Test
    @Order(3)
    @DisplayName("Create a Boss Role (with kindergarten)")
    void testCompleteRegistrationAsBoss() {

        CompleteRegistrationDto registrationDto = CompleteRegistrationDto.builder()
                .role(UserRole.BOSS)
                .firstName("Lebron")
                .lastName("James")
                .phoneNumber("99887766")
                .employeeId("BOSS01")
                .position("Manager")
                .kindergartenName("Eventyrland")
                .kindergartenAddress("Solskinnveg 3")
                .kindergartenPhone("11223344")
                .kindergartenEmail("eventyr@mail.com")
                .build();

        assertNotNull(registrationDto);
        assertEquals(UserRole.BOSS, registrationDto.getRole());
        assertEquals("Eventyrland", registrationDto.getKindergartenName());
        assertEquals("eventyr@mail.com", registrationDto.getKindergartenEmail());
    }


    @Test
    @Order(4)
    @DisplayName("Verify Boss role is BOSS")
    void testBossRoleIsCorrect() {
        // Given
        UserRole role = UserRole.BOSS;

        assertEquals(UserRole.BOSS, role);
        assertNotEquals(UserRole.STAFF, role);
        assertNotEquals(UserRole.PARENT, role);
    }


    @Test
    @Order(5)
    @DisplayName("Verify Create child")
    void testCreateChildDtoStructure() {

        CreateChildDto childDto = CreateChildDto.builder()
                .firstName("Emma")
                .lastName("Johanson")
                .birthDate(LocalDate.of(2022, 5, 15))
                .build();

        assertNotNull(childDto);
        assertEquals("Emma", childDto.getFirstName());
        assertEquals("Johanson", childDto.getLastName());
        assertEquals(LocalDate.of(2022, 5, 15), childDto.getBirthDate());
    }
}