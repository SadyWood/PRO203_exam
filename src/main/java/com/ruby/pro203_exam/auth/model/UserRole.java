package com.ruby.pro203_exam.auth.model;

// TODO: UPDATE ADMIN ROLE TO BE IMPLEMENTED AND USED IN SYSTEM
public enum UserRole {
    PARENT, // View own child/ren only, check in/out own child, check own child health data
    STAFF, // View all children, check out any child, update child information, view health data
    BOSS // Everything Staff can do, create/delete users, manage staff accounts, access audit logs, system configuration
}
