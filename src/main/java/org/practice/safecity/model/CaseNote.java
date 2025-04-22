package org.practice.safecity.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CaseNote {
    private String id;
    private String content;
    private String createdBy;
    private LocalDateTime createdAt;
}