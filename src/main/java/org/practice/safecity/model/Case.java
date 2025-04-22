package org.practice.safecity.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.practice.safecity.model.enums.CasePriority;
import org.practice.safecity.model.enums.CaseStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "cases")
public class Case {
    @Id
    private String id;

    @Indexed(unique = true)
    private String caseNumber;

    private String title;

    private String description;

    private CaseStatus status;

    private CasePriority priority;

    private String location;

    private String district;

    private String assignedTo;

    private List<CaseNote> notes = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}