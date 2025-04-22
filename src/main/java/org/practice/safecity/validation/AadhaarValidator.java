package org.practice.safecity.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class AadhaarValidator implements ConstraintValidator<ValidAadhaar, String> {
    private static final String AADHAAR_PATTERN = "^[2-9]{1}[0-9]{11}$";
    private static final Pattern pattern = Pattern.compile(AADHAAR_PATTERN);

    @Override
    public boolean isValid(String aadhaarNumber, ConstraintValidatorContext context) {
        if (aadhaarNumber == null) {
            return false;
        }
        return pattern.matcher(aadhaarNumber).matches();
    }
}