package com.aurahealth.util;

/**
 * Application-Level REST API Exception.
 * <p>
 * Represents a client-visible operational error (e.g. 400 Bad Request, 401 Unauthorized,
 * 403 Forbidden, 404 Not Found, 409 Conflict). The presentation/servlet layer catches
 * this exception and transforms it into a standardized JSON error response body:
 * <pre>{@code
 *   {"error": "Descriptive message here"}
 * }</pre>
 * with the corresponding HTTP status code.
 * </p>
 */
public class ApiException extends RuntimeException {

    /** HTTP response status code to return to the client. */
    public final int status;

    /**
     * Constructs a new ApiException with a status code and message.
     *
     * @param status HTTP response status code (e.g. 400, 401, 403, 404, 409)
     * @param message human-readable error description
     */
    public ApiException(int status, String message) {
        super(message);
        this.status = status;
    }

    /**
     * Constructs a new ApiException with status, message, and root cause.
     *
     * @param status HTTP response status code
     * @param message human-readable error description
     * @param cause underlying cause
     */
    public ApiException(int status, String message, Throwable cause) {
        super(message, cause);
        this.status = status;
    }
}

