package org.practice.safecity.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Getter
@Setter
@Document(collection = "alerts")
public class Alert {
    @Id
    private String id;

    @NotBlank
    private String type;

    @NotBlank
    private String title;

    @NotBlank
    private String message;

    @NotBlank
    private String location;

    @NotNull
    private LocalDateTime timestamp = LocalDateTime.now();

    private boolean isRead = false;

    private String userId;
}