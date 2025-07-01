package com.idi.ms.unrtmng.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * מודל מייצג החלטת חיתום.
 * 
 * המודל תומך בעמודות דינמיות באמצעות Map של ערכים.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class UnderwritingDecision {
    
    private UUID id;
    private Map<String, Object> values;
    private LocalDateTime lastUpdateDate;
    private String tab;
    
    // Constructors
    public UnderwritingDecision() {
        this.id = UUID.randomUUID();
        this.lastUpdateDate = LocalDateTime.now();
        this.values = new HashMap<>();
    }
    
    public UnderwritingDecision(Map<String, Object> values) {
        this();
        this.values = values;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public Map<String, Object> getValues() {
        return values;
    }
    
    public void setValues(Map<String, Object> values) {
        this.values = values;
    }
    
    public LocalDateTime getLastUpdateDate() {
        return lastUpdateDate;
    }
    
    public void setLastUpdateDate(LocalDateTime lastUpdateDate) {
        this.lastUpdateDate = lastUpdateDate;
    }
    
    public String getTab() {
        return tab;
    }
    
    public void setTab(String tab) {
        this.tab = tab;
    }
    
    // Helper methods for common fields
    public LocalDate getDecisionDate() {
        Object value = values.get("decisionDate");
        return value instanceof LocalDate ? (LocalDate) value : null;
    }
    
    public void setDecisionDate(LocalDate decisionDate) {
        values.put("decisionDate", decisionDate);
    }
    
    public String getUnderwritingRule() {
        Object value = values.get("underwritingRule");
        return value instanceof String ? (String) value : null;
    }
    
    public void setUnderwritingRule(String underwritingRule) {
        values.put("underwritingRule", underwritingRule);
    }
    
    public String getReasonForDecision() {
        Object value = values.get("reasonForDecision");
        return value instanceof String ? (String) value : null;
    }
    
    public void setReasonForDecision(String reasonForDecision) {
        values.put("reasonForDecision", reasonForDecision);
    }
    
    public String getApprovingEntities() {
        Object value = values.get("approvingEntities");
        return value instanceof String ? (String) value : null;
    }
    
    public void setApprovingEntities(String approvingEntities) {
        values.put("approvingEntities", approvingEntities);
    }
    
    public String getDecisionImplications() {
        Object value = values.get("decisionImplications");
        return value instanceof String ? (String) value : null;
    }
    
    public void setDecisionImplications(String decisionImplications) {
        values.put("decisionImplications", decisionImplications);
    }
    
    public LocalDate getFollowUpReviewDate() {
        Object value = values.get("followUpReviewDate");
        return value instanceof LocalDate ? (LocalDate) value : null;
    }
    
    public void setFollowUpReviewDate(LocalDate followUpReviewDate) {
        values.put("followUpReviewDate", followUpReviewDate);
    }
    
    public String getBusinessTarget() {
        Object value = values.get("businessTarget");
        return value instanceof String ? (String) value : null;
    }
    
    public void setBusinessTarget(String businessTarget) {
        values.put("businessTarget", businessTarget);
    }
    
    public String getResponsibleForFollowUp() {
        Object value = values.get("responsibleForFollowUp");
        return value instanceof String ? (String) value : null;
    }
    
    public void setResponsibleForFollowUp(String responsibleForFollowUp) {
        values.put("responsibleForFollowUp", responsibleForFollowUp);
    }
    
    public String getFollowUpOutcome() {
        Object value = values.get("followUpOutcome");
        return value instanceof String ? (String) value : null;
    }
    
    public void setFollowUpOutcome(String followUpOutcome) {
        values.put("followUpOutcome", followUpOutcome);
    }
    
    public Boolean isRecurringReview() {
        Object value = values.get("recurringReview");
        return value instanceof Boolean ? (Boolean) value : null;
    }
    
    public void setRecurringReview(Boolean recurringReview) {
        values.put("recurringReview", recurringReview);
    }
    
    public String getNotes() {
        Object value = values.get("notes");
        return value instanceof String ? (String) value : null;
    }
    
    public void setNotes(String notes) {
        values.put("notes", notes);
    }
    
    @Override
    public String toString() {
        return "UnderwritingDecision{" +
                "id=" + id +
                ", values=" + values +
                ", lastUpdateDate=" + lastUpdateDate +
                '}';
    }
} 