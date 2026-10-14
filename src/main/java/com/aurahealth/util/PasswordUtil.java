package com.aurahealth.util;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

/** Salted PBKDF2 password hashing using only the JDK. Stored as base64(salt):base64(hash). */
public final class PasswordUtil {
    private static final SecureRandom RNG = new SecureRandom();
    private PasswordUtil() {}

    public static String hash(String password) {
        byte[] salt = new byte[16];
        RNG.nextBytes(salt);
        Base64.Encoder b = Base64.getEncoder();
        return b.encodeToString(salt) + ":" + b.encodeToString(pbkdf2(password, salt));
    }

    public static boolean verify(String password, String stored) {
        if (stored == null || !stored.contains(":")) return false;
        String[] p = stored.split(":");
        byte[] salt = Base64.getDecoder().decode(p[0]);
        byte[] expected = Base64.getDecoder().decode(p[1]);
        return MessageDigest.isEqual(expected, pbkdf2(password, salt));
    }

    private static byte[] pbkdf2(String pw, byte[] salt) {
        try {
            var spec = new PBEKeySpec(pw.toCharArray(), salt, 120_000, 256);
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
        } catch (Exception e) { throw new IllegalStateException(e); }
    }
}
