package com.aurahealth.util;

/**
 * Unchecked Data Access Exception.
 * <p>
 * Wraps low-level checked {@link java.sql.SQLException} instances thrown by JDBC drivers.
 * Decouples business services, controllers, and domain components from JDBC implementation details,
 * adhering to clean architecture and modern Java exception handling practices.
 * </p>
 */
public class DataException extends RuntimeException {

    /**
     * Constructs a new DataException with a root cause.
     *
     * @param cause the underlying checked exception (typically SQLException)
     */
    public DataException(Throwable cause) {
        super(cause);
    }

    /**
     * Constructs a new DataException with a detail message and root cause.
     *
     * @param message human-readable error description
     * @param cause the underlying checked exception
     */
    public DataException(String message, Throwable cause) {
        super(message, cause);
    }
}

