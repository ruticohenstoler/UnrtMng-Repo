package com.idi.ms.unrtmng.controller.rest.impl;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.FileCopyUtils;
import javax.annotation.PostConstruct;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ms/rest/unrtmng/admin")
public class AdminController {
    private static final String TABS_FILE = "tabs.json";
    private static final String USERS_FILE = "users.json";
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/tabs")
    public ResponseEntity<List<String>> getTabs() {
        try {
            File file = getOrCreateFile(TABS_FILE, "[\"חיים\",\"רכב\",\"דירה\"]");
            List<String> tabs = objectMapper.readValue(file, List.class);
            return ResponseEntity.ok(tabs);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/tabs")
    public ResponseEntity<Void> saveTabs(@RequestBody List<String> tabs) {
        try {
            objectMapper.writeValue(new File(TABS_FILE), tabs);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<String>> getUsers() {
        try {
            File file = getOrCreateFile(USERS_FILE, "[]");
            List<String> users = objectMapper.readValue(file, List.class);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/users")
    public ResponseEntity<Void> saveUsers(@RequestBody List<String> users) {
        try {
            objectMapper.writeValue(new File(USERS_FILE), users);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
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