package com.aurahealth.util;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;

/**
 * Verifies the ID token the browser gets from Firebase "Sign in with Google".
 * Set GOOGLE_APPLICATION_CREDENTIALS to your Firebase service-account JSON path.
 */
public final class FirebaseVerifier {
    private static boolean ready;
    private FirebaseVerifier() {}

    private static synchronized void init() throws Exception {
        if (ready) return;
        FirebaseApp.initializeApp(FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.getApplicationDefault()).build());
        ready = true;
    }

    public static FirebaseToken verify(String idToken) {
        try { init(); return FirebaseAuth.getInstance().verifyIdToken(idToken); }
        catch (Exception e) { throw new ApiException(401, "Google sign-in could not be verified."); }
    }
}
