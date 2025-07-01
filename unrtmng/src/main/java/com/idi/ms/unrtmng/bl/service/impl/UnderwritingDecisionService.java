package com.idi.ms.unrtmng.bl.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.idi.ms.unrtmng.model.UnderwritingDecision;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * שירות לניהול החלטות החיתום.
 * 
 * תומך בעמודות דינמיות ושמירה לקובץ JSON.
 */
@Service
public class UnderwritingDecisionService {
    
    private final Map<UUID, UnderwritingDecision> decisions = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper;
    private static final String DATA_FILE = "underwriting_decisions.json";
    
    public UnderwritingDecisionService() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        loadDataFromFile();
    }
    
    /**
     * יצירת החלטת חיתום חדשה.
     */
    public Mono<UnderwritingDecision> createDecision(UnderwritingDecision decision) {
        return Mono.fromCallable(() -> {
            if (decision.getId() == null) {
                decision.setId(UUID.randomUUID());
            }
            decision.setLastUpdateDate(java.time.LocalDateTime.now());
            decisions.put(decision.getId(), decision);
            saveDataToFile();
            return decision;
        });
    }
    
    /**
     * קבלת החלטה לפי ID.
     */
    public Mono<UnderwritingDecision> getDecisionById(UUID id) {
        return Mono.fromCallable(() -> decisions.get(id));
    }
    
    /**
     * קבלת כל ההחלטות.
     */
    public Flux<UnderwritingDecision> getAllDecisions() {
        return Flux.fromIterable(decisions.values());
    }
    
    /**
     * עדכון החלטה קיימת.
     */
    public Mono<UnderwritingDecision> updateDecision(UUID id, UnderwritingDecision decision) {
        return Mono.fromCallable(() -> {
            if (decisions.containsKey(id)) {
                decision.setId(id);
                decision.setLastUpdateDate(java.time.LocalDateTime.now());
                decisions.put(id, decision);
                saveDataToFile();
                return decision;
            }
            return null;
        });
    }
    
    /**
     * מחיקת החלטה.
     */
    public Mono<Boolean> deleteDecision(UUID id) {
        return Mono.fromCallable(() -> {
            boolean removed = decisions.remove(id) != null;
            if (removed) {
                saveDataToFile();
            }
            return removed;
        });
    }
    
    /**
     * מציאת החלטות לפי טווח תאריכים.
     */
    public Flux<UnderwritingDecision> findDecisionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return Flux.fromIterable(decisions.values())
                .filter(decision -> {
                    LocalDate decisionDate = decision.getDecisionDate();
                    return decisionDate != null && 
                           !decisionDate.isBefore(startDate) && 
                           !decisionDate.isAfter(endDate);
                });
    }
    
    /**
     * מציאת החלטות הדורשות מעקב.
     */
    public Flux<UnderwritingDecision> findDecisionsRequiringFollowUp() {
        LocalDate today = LocalDate.now();
        return Flux.fromIterable(decisions.values())
                .filter(decision -> {
                    LocalDate followUpDate = decision.getFollowUpReviewDate();
                    return followUpDate != null && !followUpDate.isAfter(today);
                });
    }
    
    /**
     * מציאת החלטות לפי כלל חיתומי.
     */
    public Flux<UnderwritingDecision> findDecisionsByRule(String rule) {
        return Flux.fromIterable(decisions.values())
                .filter(decision -> rule.equalsIgnoreCase(decision.getUnderwritingRule()));
    }
    
    /**
     * שמירת נתונים לקובץ JSON.
     */
    private void saveDataToFile() {
        try {
            objectMapper.writeValue(new File(DATA_FILE), new ArrayList<>(decisions.values()));
        } catch (IOException e) {
            System.err.println("שגיאה בשמירת נתונים לקובץ: " + e.getMessage());
        }
    }
    
    /**
     * טעינת נתונים מקובץ JSON.
     */
    private void loadDataFromFile() {
        File file = new File(DATA_FILE);
        if (file.exists()) {
            try {
                List<UnderwritingDecision> loadedDecisions = objectMapper.readValue(
                    file, 
                    new TypeReference<List<UnderwritingDecision>>() {}
                );
                loadedDecisions.forEach(decision -> decisions.put(decision.getId(), decision));
                System.out.println("נטענו " + loadedDecisions.size() + " החלטות מקובץ");
            } catch (IOException e) {
                System.err.println("שגיאה בטעינת נתונים מקובץ: " + e.getMessage());
                initializeSampleData();
            }
        } else {
            initializeSampleData();
        }
    }
    
    /**
     * אתחול נתוני דוגמה.
     */
    public void initializeSampleData() {
        List<UnderwritingDecision> sampleDecisions = createSampleDecisions();
        sampleDecisions.forEach(decision -> decisions.put(decision.getId(), decision));
        saveDataToFile();
        System.out.println("אותחלו " + sampleDecisions.size() + " החלטות לדוגמה");
    }
    
    private List<UnderwritingDecision> createSampleDecisions() {
        List<UnderwritingDecision> samples = new ArrayList<>();
        
        // החלטה לדוגמה 1
        Map<String, Object> values1 = new HashMap<>();
        values1.put("decisionDate", LocalDate.now().minusDays(30));
        values1.put("underwritingRule", "פוליסת רכב סטנדרטית");
        values1.put("reasonForDecision", "אושר בתנאים סטנדרטיים");
        values1.put("followUpReviewDate", LocalDate.now().plusDays(90));
        values1.put("businessTarget", "רכב פרטי");
        values1.put("responsibleForFollowUp", "יוסי כהן");
        values1.put("recurringReview", true);
        values1.put("notes", "החלטה ראשונית");
        
        UnderwritingDecision decision1 = new UnderwritingDecision(values1);
        samples.add(decision1);
        
        // החלטה לדוגמה 2
        Map<String, Object> values2 = new HashMap<>();
        values2.put("decisionDate", LocalDate.now().minusDays(15));
        values2.put("underwritingRule", "נכס מסחרי");
        values2.put("reasonForDecision", "אושר עם דרישות אבטחה נוספות");
        values2.put("followUpReviewDate", LocalDate.now().plusDays(60));
        values2.put("businessTarget", "נכס מסחרי");
        values2.put("responsibleForFollowUp", "שרה לוי");
        values2.put("recurringReview", false);
        values2.put("notes", "נדרש מעקב נוסף");
        
        UnderwritingDecision decision2 = new UnderwritingDecision(values2);
        samples.add(decision2);
        
        return samples;
    }
} 