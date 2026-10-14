package com.aurahealth.util;

/** Thrown for client-visible errors; the servlet layer turns it into a JSON error with this status. */
public class ApiException extends RuntimeException {
    public final int status;
    public ApiException(int status, String message) { super(message); this.status = status; }
}
