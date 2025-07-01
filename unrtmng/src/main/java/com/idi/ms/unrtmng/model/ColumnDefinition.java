package com.idi.ms.unrtmng.model;

import java.util.UUID;

/**
 * מודל להגדרת עמודה בטבלת החלטות החיתום.
 * מאפשר הגדרה דינמית של עמודות הטבלה.
 */
public class ColumnDefinition {
    
    private UUID id;
    private String name;
    private String displayName;
    private String type; // text, date, number, boolean, select
    private boolean required;
    private boolean visible;
    private int order;
    private String options; // JSON string for select type
    
    // Constructors
    public ColumnDefinition() {
        this.id = UUID.randomUUID();
        this.visible = true;
    }
    
    public ColumnDefinition(String name, String displayName, String type) {
        this();
        this.name = name;
        this.displayName = displayName;
        this.type = type;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDisplayName() {
        return displayName;
    }
    
    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }
    
    public String getType() {
        return type;
    }
    
    public void setType(String type) {
        this.type = type;
    }
    
    public boolean isRequired() {
        return required;
    }
    
    public void setRequired(boolean required) {
        this.required = required;
    }
    
    public boolean isVisible() {
        return visible;
    }
    
    public void setVisible(boolean visible) {
        this.visible = visible;
    }
    
    public int getOrder() {
        return order;
    }
    
    public void setOrder(int order) {
        this.order = order;
    }
    
    public String getOptions() {
        return options;
    }
    
    public void setOptions(String options) {
        this.options = options;
    }
    
    @Override
    public String toString() {
        return "ColumnDefinition{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", displayName='" + displayName + '\'' +
                ", type='" + type + '\'' +
                ", required=" + required +
                ", visible=" + visible +
                ", order=" + order +
                '}';
    }
} 