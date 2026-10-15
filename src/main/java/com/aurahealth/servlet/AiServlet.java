package com.aurahealth.servlet;

import com.aurahealth.dao.UserDAO;
import com.aurahealth.model.Doctor;
import com.aurahealth.service.SlotService;
import com.aurahealth.util.ApiException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.*;
import java.util.regex.*;
import java.util.stream.Collectors;

/**
 * Controller Servlet for Multilingual AI Symptom Assistant & Medical Lab Report Parser.
 * <p>
 * Supported Operations:
 * <ul>
 *   <li><b>POST /api/ai:</b> Processes user messages in English, Hindi, and Hinglish.
 *     Features:
 *     <ul>
 *       <li><b>Symptom Classification:</b> Maps user symptoms to appropriate clinical specialties
 *           (Cardiology, Dermatology, Orthopedics, General Physician) using regex pattern matching.</li>
 *       <li><b>Lab Report Interpretation:</b> Extracts and analyzes quantitative metrics
 *           (Hemoglobin, Blood Glucose/Sugar, Total Cholesterol, Blood Pressure BP systolic/diastolic).</li>
 *       <li><b>Doctor Schedule Recommender:</b> Looks up real-time available slots for recommended specialists.</li>
 *     </ul>
 *   </li>
 * </ul>
 * </p>
 */
@WebServlet("/api/ai")
public class AiServlet extends ApiServlet {

    private static final int CI = Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE;
    private static final Map<String, Pattern> SPECIALITY = new LinkedHashMap<>();

    static {
        SPECIALITY.put("Cardiology", Pattern.compile("chest|seene|seena|dil\\b|heart|dhadkan|सीने|दिल|palpit", CI));
        SPECIALITY.put("Dermatology", Pattern.compile("skin|rash|khujli|itch|daane|pimple|acne|baal|hair|त्वचा|खुजली", CI));
        SPECIALITY.put("Orthopedics", Pattern.compile("bone|haddi|joint|ghutn|knee|back pain|kamar|fracture|कमर|हड्डी|घुटने", CI));
        SPECIALITY.put("General Physician", Pattern.compile("fever|bukh?ar|cold|khansi|cough|headache|sir ?dard|pet\\b|stomach|thak|बुखार|खांसी|सिर|पेट", CI));
    }

    private static final Pattern HB = Pattern.compile("h(?:ae)?moglobin\\D{0,12}(\\d+\\.?\\d*)", CI);
    private static final Pattern SUGAR = Pattern.compile("(?:sugar|glucose)\\D{0,12}(\\d+\\.?\\d*)", CI);
    private static final Pattern CHOL = Pattern.compile("cholesterol\\D{0,12}(\\d+\\.?\\d*)", CI);
    private static final Pattern BP = Pattern.compile("(\\d{2,3})\\s*/\\s*(\\d{2,3})");
    private static final Pattern ASKS = Pattern.compile("khali|free|available|timing|slot|kab|when", CI);

    private final UserDAO users;
    private final SlotService slots;

    /**
     * Constructs AiServlet with UserDAO and SlotService dependencies.
     */
    public AiServlet() {
        this.users = new UserDAO();
        this.slots = new SlotService();
    }

    /**
     * Handles POST requests: analyzes symptoms or lab numbers and generates an intelligent triage reply.
     */
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "patient");
        String msg = str(body(req), "message");
        if (msg.isEmpty()) {
            throw new ApiException(400, "Please describe your symptoms or query first.");
        }
        send(resp, 200, Map.of("reply", reply(msg)));
    }

    /**
     * Synthesizes an intelligent response by evaluating lab reports, doctor name inquiries,
     * symptom keywords, or general doctor OPD availability.
     *
     * @param m incoming user message
     * @return generated conversational reply with specialist recommendations
     */
    private String reply(String m) {
        List<Doctor> doctors = users.findDoctors();
        String report = explain(m, doctors);
        if (report != null) {
            return report;
        }

        // Check if the user asked about a specific doctor by name (e.g. "Dr. Asha kab free hai?")
        for (Doctor d : doctors) {
            String first = d.getName().replaceFirst("(?i)^dr\\.?\\s*", "").split(" ")[0].toLowerCase();
            if (m.toLowerCase().contains(first)) {
                return slotText(d);
            }
        }

        // Check for recognized clinical symptoms
        for (var e : SPECIALITY.entrySet()) {
            if (!e.getValue().matcher(m).find()) {
                continue;
            }
            var matches = doctors.stream()
                .filter(d -> e.getKey().equalsIgnoreCase(d.getSpecialization()))
                .toList();
            if (matches.isEmpty()) {
                return e.getKey() + " ke liye abhi koi doctor available nahi hai. Kripya General Physician se consult karein.";
            }
            return "Aapke bataye gaye symptoms ke mutabiq " + e.getKey() + " specialist ko consult karna behtar rahega:\n\n"
                + matches.stream().map(this::slotText).collect(Collectors.joining("\n"))
                + "\n\nAap 'Book appointment' tab se instant slot book kar sakte hain.\n⚠️ Emergency ki sthiti me kripya turant hospital emergency room me jayein.";
        }

        // Check if patient inquired about general OPD slot timings
        if (ASKS.matcher(m).find()) {
            return "Swasthya Mitra Doctors OPD Availability:\n" +
                doctors.stream().map(this::slotText).collect(Collectors.joining("\n"));
        }

        return "Namaste! Main aapka Swasthya Mitra AI Assistant hoon. Aap mujhse Hindi, Hinglish ya English me apne symptoms bata sakte hain " +
               "(jaise: 'sir me dard hai', 'skin pe rashes', 'chest pain'), ya blood report ke numbers (jaise 'Hemoglobin 9.5, Sugar 145, BP 140/90').";
    }

    /**
     * Formats next free slots for a doctor into a readable text line.
     *
     * @param d doctor entity
     * @return formatted slot summary
     */
    private String slotText(Doctor d) {
        var next = slots.nextFree(d, 2);
        String s = next.isEmpty() ? "No open slots in the next 2 weeks"
            : next.stream().map(x -> x.date() + ": " + String.join(", ", x.times())).collect(Collectors.joining(" | "));
        return "• " + d.getName() + " (" + d.getSpecialization() + "): " + s;
    }

    /**
     * Matches a numerical pattern against text and extracts parsed Double.
     */
    private static Double find(Pattern p, String m) {
        Matcher x = p.matcher(m);
        return x.find() ? Double.valueOf(x.group(1)) : null;
    }

    /**
     * Parses quantitative medical report markers and generates clinical interpretation.
     *
     * @param m incoming message
     * @param doctors available doctor listings
     * @return interpretation text, or null if no lab indicators matched
     */
    private String explain(String m, List<Doctor> doctors) {
        List<String> out = new ArrayList<>();
        Double hb = find(HB, m);
        Double sugar = find(SUGAR, m);
        Double chol = find(CHOL, m);
        Matcher bp = BP.matcher(m);

        if (hb != null) {
            out.add(hb < 12.0
                ? "🔴 Hemoglobin " + hb + " g/dL: Low hai (khoon ki kami / Anemia indicate kar sakta hai)."
                : hb > 17.5
                ? "🟡 Hemoglobin " + hb + " g/dL: Thoda elevated hai."
                : "🟢 Hemoglobin " + hb + " g/dL: Normal aur healthy range me hai.");
        }

        if (sugar != null) {
            out.add(sugar >= 126.0
                ? "🔴 Blood Glucose " + sugar + " mg/dL: High hai (Diabetes range - physician evaluation needed)."
                : sugar >= 100.0
                ? "🟡 Blood Glucose " + sugar + " mg/dL: Borderline / Pre-diabetes range."
                : "🟢 Blood Glucose " + sugar + " mg/dL: Normal healthy range.");
        }

        if (chol != null) {
            out.add(chol >= 240.0
                ? "🔴 Cholesterol " + chol + " mg/dL: High range hai (Cardiovascular health ka dhyan rakhein)."
                : chol >= 200.0
                ? "🟡 Cholesterol " + chol + " mg/dL: Borderline high."
                : "🟢 Cholesterol " + chol + " mg/dL: Healthy desirable range.");
        }

        boolean heartFlag = chol != null && chol >= 200.0;
        if (bp.find()) {
            int sys = Integer.parseInt(bp.group(1));
            int dia = Integer.parseInt(bp.group(2));
            out.add(sys >= 140 || dia >= 90
                ? "🔴 Blood Pressure " + sys + "/" + dia + " mmHg: High BP / Hypertension."
                : sys < 120 && dia < 80
                ? "🟢 Blood Pressure " + sys + "/" + dia + " mmHg: Ideal normal BP."
                : "🟡 Blood Pressure " + sys + "/" + dia + " mmHg: Elevated BP.");
            heartFlag |= sys >= 120 || dia >= 80;
        }

        if (out.isEmpty()) {
            return null;
        }

        String want = heartFlag ? "Cardiology" : "General Physician";
        String docDetails = doctors.stream()
            .filter(d -> want.equalsIgnoreCase(d.getSpecialization()))
            .findFirst()
            .map(d -> "\n" + slotText(d))
            .orElse("");

        return "📊 Medical Lab Report Summary:\n" +
            String.join("\n", out) +
            "\n\n💡 Note: Ye preliminary guidance hai, official clinical diagnosis nahi. Kripya hamare specialist se consult karein:" +
            docDetails;
    }
}

