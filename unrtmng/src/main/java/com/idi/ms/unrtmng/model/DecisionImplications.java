package com.idi.ms.unrtmng.model;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Represents the quantitative implications of an underwriting decision.
 * 
 * This class encapsulates various numerical values that result from
 * an underwriting decision such as premiums, limits, and other quantities.
 */
public class DecisionImplications {
    
    private UUID id;
    private BigDecimal premiumAmount;
    private BigDecimal coverageLimit;
    private BigDecimal deductible;
    private Integer policyTerm;
    private String currency;
    private String additionalNotes;
    
    // Constructors
    public DecisionImplications() {
        this.id = UUID.randomUUID();
    }
    
    public DecisionImplications(BigDecimal premiumAmount, BigDecimal coverageLimit) {
        this();
        this.premiumAmount = premiumAmount;
        this.coverageLimit = coverageLimit;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public BigDecimal getPremiumAmount() {
        return premiumAmount;
    }
    
    public void setPremiumAmount(BigDecimal premiumAmount) {
        this.premiumAmount = premiumAmount;
    }
    
    public BigDecimal getCoverageLimit() {
        return coverageLimit;
    }
    
    public void setCoverageLimit(BigDecimal coverageLimit) {
        this.coverageLimit = coverageLimit;
    }
    
    public BigDecimal getDeductible() {
        return deductible;
    }
    
    public void setDeductible(BigDecimal deductible) {
        this.deductible = deductible;
    }
    
    public Integer getPolicyTerm() {
        return policyTerm;
    }
    
    public void setPolicyTerm(Integer policyTerm) {
        this.policyTerm = policyTerm;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public String getAdditionalNotes() {
        return additionalNotes;
    }
    
    public void setAdditionalNotes(String additionalNotes) {
        this.additionalNotes = additionalNotes;
    }
    
    @Override
    public String toString() {
        return "DecisionImplications{" +
                "id=" + id +
                ", premiumAmount=" + premiumAmount +
                ", coverageLimit=" + coverageLimit +
                ", deductible=" + deductible +
                ", policyTerm=" + policyTerm +
                ", currency='" + currency + '\'' +
                '}';
    }
} 