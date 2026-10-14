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
 * POST /api/ai {message} -> {reply}. Rule-based: symptom keywords -> speciality -> real doctors and free slots,
 * plus a simple lab-value explainer. To use a real LLM, replace reply() with an HTTP call to your model.
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

    private final UserDAO users = new UserDAO();
    private final SlotService slots = new SlotService();

    @Override protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        require(req, "patient");
        String msg = str(body(req), "message");
        if (msg.isEmpty()) throw new ApiException(400, "Write your problem first.");
        send(resp, 200, Map.of("reply", reply(msg)));
    }

    private String reply(String m) {
        List<Doctor> doctors = users.findDoctors();
        String report = explain(m, doctors);
        if (report != null) return report;

        for (Doctor d : doctors) {                        // "Dr. Asha kab free hai?"
            String first = d.getName().replaceFirst("(?i)^dr\\.?\\s*", "").split(" ")[0].toLowerCase();
            if (m.toLowerCase().contains(first)) return slotText(d);
        }
        for (var e : SPECIALITY.entrySet()) {
            if (!e.getValue().matcher(m).find()) continue;
            var matches = doctors.stream().filter(d -> e.getKey().equalsIgnoreCase(d.getSpecialization())).toList();
            if (matches.isEmpty()) return e.getKey() + " ke liye abhi doctor available nahi hai. General Physician se milein.";
            return "Aapke symptoms ke hisaab se " + e.getKey() + " specialist ko dikhana sahi rahega:\n"
                + matches.stream().map(this::slotText).collect(Collectors.joining("\n"))
                + "\n\nBook appointment tab se slot book karein. Emergency ho to turant hospital jayein.";
        }
        if (ASKS.matcher(m).find())
            return "Abhi ke free slots:\n" + doctors.stream().map(this::slotText).collect(Collectors.joining("\n"));
        return "Mujhe samajh nahi aaya. Apne symptoms batayein (jaise \"sir dard aur bukhar\", \"ghutne me dard\"), ya doctor ka naam puchein.";
    }

    private String slotText(Doctor d) {
        var next = slots.nextFree(d, 2);
        String s = next.isEmpty() ? "no free slots in 2 weeks"
            : next.stream().map(x -> x.date() + " " + String.join(", ", x.times())).collect(Collectors.joining(" | "));
        return d.getName() + " (" + d.getSpecialization() + "): " + s;
    }

    private static Double find(Pattern p, String m) { Matcher x = p.matcher(m); return x.find() ? Double.valueOf(x.group(1)) : null; }

    private String explain(String m, List<Doctor> doctors) {
        List<String> out = new ArrayList<>();
        Double hb = find(HB, m), sugar = find(SUGAR, m), chol = find(CHOL, m);
        Matcher bp = BP.matcher(m);
        if (hb != null) out.add(hb < 12 ? "Hemoglobin " + hb + " kam hai, anemia ho sakta hai." : hb > 17.5 ? "Hemoglobin " + hb + " zyada hai." : "Hemoglobin " + hb + " normal range me hai.");
        if (sugar != null) out.add(sugar >= 126 ? "Sugar " + sugar + " high hai (diabetes range)." : sugar >= 100 ? "Sugar " + sugar + " borderline hai (pre-diabetes range)." : "Sugar " + sugar + " normal hai.");
        if (chol != null) out.add(chol >= 240 ? "Cholesterol " + chol + " high hai." : chol >= 200 ? "Cholesterol " + chol + " borderline hai." : "Cholesterol " + chol + " theek hai.");
        boolean heartFlag = chol != null && chol >= 200;
        if (bp.find()) {
            int s = Integer.parseInt(bp.group(1)), d = Integer.parseInt(bp.group(2));
            out.add(s >= 140 || d >= 90 ? "BP " + s + "/" + d + " high hai." : s < 120 && d < 80 ? "BP " + s + "/" + d + " normal hai." : "BP " + s + "/" + d + " thoda elevated hai.");
            heartFlag |= s >= 120 || d >= 80;
        }
        if (out.isEmpty()) return null;
        String want = heartFlag ? "Cardiology" : "General Physician";
        String tail = doctors.stream().filter(d -> want.equalsIgnoreCase(d.getSpecialization())).findFirst().map(d -> ": " + slotText(d)).orElse(".");
        return String.join("\n", out) + "\n\nYe sirf general guidance hai, diagnosis nahi. Doctor se milna better rahega" + tail;
    }
}
