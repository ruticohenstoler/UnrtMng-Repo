package com.idi.ms.unrtmng.bl.service.impl;

import com.idi.ms.unrtmng.model.ColumnDefinition;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * שירות לניהול הגדרות העמודות הדינמיות.
 * 
 * מאפשר הוספה, מחיקה ועדכון של עמודות הטבלה.
 */
@Service
public class ColumnDefinitionService {
    
    private final Map<UUID, ColumnDefinition> columns = new ConcurrentHashMap<>();
    
    public ColumnDefinitionService() {
        initializeDefaultColumns();
    }
    
    /**
     * יצירת עמודה חדשה.
     */
    public Mono<ColumnDefinition> createColumn(ColumnDefinition column) {
        return Mono.fromCallable(() -> {
            if (column.getId() == null) {
                column.setId(UUID.randomUUID());
            }
            columns.put(column.getId(), column);
            return column;
        });
    }
    
    /**
     * קבלת כל העמודות.
     */
    public Flux<ColumnDefinition> getAllColumns() {
        return Flux.fromIterable(columns.values());
    }
    
    /**
     * קבלת עמודה לפי ID.
     */
    public Mono<ColumnDefinition> getColumnById(UUID id) {
        return Mono.fromCallable(() -> columns.get(id));
    }
    
    /**
     * עדכון עמודה קיימת.
     */
    public Mono<ColumnDefinition> updateColumn(UUID id, ColumnDefinition column) {
        return Mono.fromCallable(() -> {
            if (columns.containsKey(id)) {
                column.setId(id);
                columns.put(id, column);
                return column;
            }
            return null;
        });
    }
    
    /**
     * מחיקת עמודה.
     */
    public Mono<Boolean> deleteColumn(UUID id) {
        return Mono.fromCallable(() -> columns.remove(id) != null);
    }
    
    /**
     * קבלת עמודות נראות בלבד.
     */
    public Flux<ColumnDefinition> getVisibleColumns() {
        return Flux.fromIterable(columns.values())
                .filter(ColumnDefinition::isVisible)
                .sort((c1, c2) -> Integer.compare(c1.getOrder(), c2.getOrder()));
    }
    
    /**
     * אתחול עמודות ברירת מחדל.
     */
    private void initializeDefaultColumns() {
        List<ColumnDefinition> defaultColumns = new ArrayList<>();
        
        defaultColumns.add(createColumn("decisionDate", "תאריך החלטה", "date", 1, true));
        defaultColumns.add(createColumn("underwritingRule", "כלל חיתומי/החלטה", "text", 2, true));
        defaultColumns.add(createColumn("reasonForDecision", "סיבת החלטה", "text", 3, true));
        defaultColumns.add(createColumn("approvingEntities", "גורמים מאשרים", "text", 4, false));
        defaultColumns.add(createColumn("decisionImplications", "משמעות החלטה", "text", 5, false));
        defaultColumns.add(createColumn("followUpReviewDate", "תאריך לבחינה חוזרת", "date", 6, false));
        defaultColumns.add(createColumn("businessTarget", "יעד", "text", 7, false));
        defaultColumns.add(createColumn("responsibleForFollowUp", "אחראי מעקב", "text", 8, false));
        defaultColumns.add(createColumn("lastUpdateDate", "תאריך עדכון", "date", 9, false));
        defaultColumns.add(createColumn("followUpOutcome", "החלטת מעקב", "text", 10, false));
        defaultColumns.add(createColumn("recurringReview", "בחינה חוזרת", "boolean", 11, false));
        defaultColumns.add(createColumn("notes", "הערות", "text", 12, false));
        
        defaultColumns.forEach(column -> columns.put(column.getId(), column));
    }
    
    private ColumnDefinition createColumn(String name, String displayName, String type, int order, boolean required) {
        ColumnDefinition column = new ColumnDefinition(name, displayName, type);
        column.setOrder(order);
        column.setRequired(required);
        return column;
    }
} 