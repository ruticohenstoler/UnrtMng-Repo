package com.idi.ms.unrtmng.controller.rest.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.idi.ms.unrtmng.bl.service.impl.ColumnDefinitionService;
import com.idi.ms.unrtmng.bl.service.impl.UnderwritingDecisionService;
import com.idi.ms.unrtmng.model.ColumnDefinition;
import com.idi.ms.unrtmng.model.UnderwritingDecision;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * REST controller for underwriting decision management.
 * 
 * Provides endpoints for managing underwriting decisions and a simple
 * hello endpoint for testing connectivity.
 */
@RestController
@RequestMapping("/")
//@CrossOrigin(origins = "http://localhost:4200") // Allow frontend to call backend
public class UnderwritingController {

    private final UnderwritingDecisionService decisionService;
    private final ColumnDefinitionService columnService;
    private final ObjectMapper objectMapper;

    @Autowired
    public UnderwritingController(UnderwritingDecisionService decisionService,
								  ColumnDefinitionService columnService,
								  ObjectMapper objectMapper) {
        this.decisionService = decisionService;
        this.columnService = columnService;
        this.objectMapper = objectMapper;
    }

    /**
     * Simple hello endpoint for testing connectivity.
     * 
     * @return a greeting message
     */
    @GetMapping("/hello")
    public ResponseEntity<Map<String, String>> hello() {
        return ResponseEntity.ok(Map.of(
            "message", "שלום ממערכת ניהול החלטות החיתום!",
            "timestamp", java.time.LocalDateTime.now().toString(),
            "status", "success"
        ));
    }

    /**
     * Get all underwriting decisions.
     * 
     * @return Flux of all decisions
     */
    @GetMapping("/decisions")
    public ResponseEntity<List<UnderwritingDecision>> getDecisions(@RequestParam(value = "tab", required = false) String tab) {
        try {
            String fileName = getDecisionsFileName(tab);
            File file = getOrCreateFile(fileName, "[]");
            List<UnderwritingDecision> decisions = objectMapper.readValue(file, new TypeReference<List<UnderwritingDecision>>(){});
            return ResponseEntity.ok(decisions);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }

    /**
     * Get a specific underwriting decision by ID.
     * 
     * @param id the decision ID
     * @return Mono containing the decision
     */
    @GetMapping("/decisions/{id}")
    public Mono<ResponseEntity<UnderwritingDecision>> getDecisionById(@PathVariable String id) {
        return decisionService.getDecisionById(UUID.fromString(id))
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * Create a new underwriting decision.
     * 
     * @param tab the tab for the decision
     * @param decision the decision to create
     * @return ResponseEntity indicating the result of the operation
     */
    @PostMapping("/decisions")
    public ResponseEntity<Void> addDecision(@RequestParam(value = "tab", required = false) String tab, @RequestBody UnderwritingDecision decision) {
        try {
            String fileName = getDecisionsFileName(tab);
            File file = getOrCreateFile(fileName, "[]");
            List<UnderwritingDecision> decisions = objectMapper.readValue(file, new TypeReference<List<UnderwritingDecision>>(){});
            decisions.add(decision);
            objectMapper.writeValue(file, decisions);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Update an existing underwriting decision.
     * 
     * @param id the decision ID
     * @param decision the updated decision data
     * @return Mono containing the updated decision
     */
    @PutMapping("/decisions/{id}")
    public Mono<ResponseEntity<UnderwritingDecision>> updateDecision(
            @PathVariable String id, 
            @RequestBody UnderwritingDecision decision) {
        return decisionService.updateDecision(UUID.fromString(id), decision)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * Delete an underwriting decision.
     * 
     * @param id the decision ID
     * @return Mono containing the deletion result
     */
    @DeleteMapping("/decisions/{id}")
    public Mono<ResponseEntity<Map<String, Boolean>>> deleteDecision(@PathVariable String id) {
        return decisionService.deleteDecision(UUID.fromString(id))
                .map(deleted -> ResponseEntity.ok(Map.of("deleted", deleted)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * Get decisions requiring follow-up review.
     * 
     * @return Flux of decisions requiring follow-up
     */
    @GetMapping("/decisions/follow-up")
    public Flux<UnderwritingDecision> getDecisionsRequiringFollowUp() {
        return decisionService.findDecisionsRequiringFollowUp();
    }

    /**
     * Get all columns.
     * 
     * @return Flux of all columns
     */
    @GetMapping("/columns")
    public Flux<ColumnDefinition> getAllColumns() {
        return columnService.getAllColumns();
    }

    /**
     * Get visible columns.
     * 
     * @return Flux of visible columns
     */
    @GetMapping("/columns/visible")
    public Flux<ColumnDefinition> getVisibleColumns() {
        return columnService.getVisibleColumns();
    }

    /**
     * Get a specific column by ID.
     * 
     * @param id the column ID
     * @return Mono containing the column
     */
    @GetMapping("/columns/{id}")
    public Mono<ResponseEntity<ColumnDefinition>> getColumnById(@PathVariable String id) {
        return columnService.getColumnById(UUID.fromString(id))
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * Create a new column.
     * 
     * @param column the column to create
     * @return Mono containing the created column
     */
    @PostMapping("/columns")
    public Mono<ResponseEntity<ColumnDefinition>> createColumn(@RequestBody ColumnDefinition column) {
        return columnService.createColumn(column)
                .map(ResponseEntity::ok);
    }

    /**
     * Update an existing column.
     * 
     * @param id the column ID
     * @param column the updated column data
     * @return Mono containing the updated column
     */
    @PutMapping("/columns/{id}")
    public Mono<ResponseEntity<ColumnDefinition>> updateColumn(
            @PathVariable String id, 
            @RequestBody ColumnDefinition column) {
        return columnService.updateColumn(UUID.fromString(id), column)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    /**
     * Delete a column.
     * 
     * @param id the column ID
     * @return Mono containing the deletion result
     */
    @DeleteMapping("/columns/{id}")
    public Mono<ResponseEntity<Map<String, Boolean>>> deleteColumn(@PathVariable String id) {
        return columnService.deleteColumn(UUID.fromString(id))
                .map(deleted -> ResponseEntity.ok(Map.of("deleted", deleted)))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    private String getDecisionsFileName(String tab) {
        if (tab == null || tab.isEmpty()) return "underwriting_decisions.json";
        return "underwriting_decisions_" + tab + ".json";
    }

    private File getOrCreateFile(String filename, String defaultContent) throws IOException {
        File file = new File(filename);
        if (!file.exists()) {
            try (FileWriter writer = new FileWriter(file)) {
                writer.write(defaultContent);
            }
        }
        return file;
    }
} 