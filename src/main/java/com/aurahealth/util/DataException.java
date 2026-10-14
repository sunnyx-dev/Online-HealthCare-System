package com.aurahealth.util;

/** Unchecked wrapper for SQLException so DAO methods stay simple. */
public class DataException extends RuntimeException {
    public DataException(Throwable cause) { super(cause); }
}
