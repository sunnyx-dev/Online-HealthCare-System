package com.aurahealth.util;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

/**
 * Cryptographic Password Hashing Utility.
 * <p>
 * Implements salted PBKDF2 (Password-Based Key Derivation Function 2) with HMAC-SHA256
 * without external dependencies, relying solely on standard Java Cryptography Architecture (JCA):
 * <ul>
 *   <li><b>Salt:</b> 128-bit (16-byte) cryptographically secure pseudorandom salt per password using {@link SecureRandom}.</li>
 *   <li><b>Work Factor:</b> 120,000 iterations to resist offline brute-force and GPU rainbow table attacks.</li>
 *   <li><b>Hash Key Length:</b> 256 bits.</li>
 *   <li><b>Constant-Time Comparison:</b> Uses {@link MessageDigest#isEqual(byte[], byte[])} to eliminate timing attack vectors.</li>
 *   <li><b>Storage Format:</b> {@code base64(salt) + ":" + base64(derivedKey)}.</li>
 * </ul>
 * </p>
 */
public final class PasswordUtil {

    private static final SecureRandom RNG = new SecureRandom();
    private static final int SALT_BYTES = 16;
    private static final int ITERATIONS = 120_000;
    private static final int KEY_LENGTH_BITS = 256;

    /**
     * Private constructor to prevent instantiation.
     */
    private PasswordUtil() {}

    /**
     * Hashes a raw plain-text password using a newly generated cryptographic salt and PBKDF2-HMAC-SHA256.
     *
     * @param password the plain-text password to hash
     * @return serialized hash string in the format {@code <base64-salt>:<base64-hash>}
     */
    public static String hash(String password) {
        byte[] salt = new byte[SALT_BYTES];
        RNG.nextBytes(salt);
        Base64.Encoder encoder = Base64.getEncoder();
        return encoder.encodeToString(salt) + ":" + encoder.encodeToString(pbkdf2(password, salt));
    }

    /**
     * Verifies whether a candidate plain-text password matches a stored salted hash.
     *
     * @param password the plain-text candidate password
     * @param stored the stored serialized hash string ({@code <base64-salt>:<base64-hash>})
     * @return true if password matches; false otherwise
     */
    public static boolean verify(String password, String stored) {
        if (stored == null || !stored.contains(":")) {
            return false;
        }
        String[] parts = stored.split(":");
        if (parts.length != 2) {
            return false;
        }

        try {
            byte[] salt = Base64.getDecoder().decode(parts[0]);
            byte[] expected = Base64.getDecoder().decode(parts[1]);
            byte[] actual = pbkdf2(password, salt);
            return MessageDigest.isEqual(expected, actual);
        } catch (IllegalArgumentException e) {
            // Malformed base64 input
            return false;
        }
    }

    /**
     * Derives a cryptographic key using PBKDF2WithHmacSHA256.
     *
     * @param password candidate password
     * @param salt byte array salt
     * @return derived key bytes
     */
    private static byte[] pbkdf2(String password, byte[] salt) {
        try {
            var spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH_BITS);
            return SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
        } catch (Exception e) {
            throw new IllegalStateException("Cryptographic algorithm PBKDF2WithHmacSHA256 unavailable: " + e.getMessage(), e);
        }
    }
}

