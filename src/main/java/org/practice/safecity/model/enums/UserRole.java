package org.practice.safecity.model.enums;

public enum UserRole {
    USER,
    OFFICER,
    ADMIN;

    public String toUpperCase() {
        return this.name().toUpperCase();
    }
}