package org.practice.safecity.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AadhaarValidator.class)
@Documented
public @interface ValidAadhaar {
    String message() default "Invalid Aadhaar number format. Must be 12 digits and start with 2-9";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}