package com.idi.ms.unrtmng.model;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Represents a document attached to an underwriting decision.
 * 
 * This class encapsulates document metadata including name, type,
 * upload date, and content reference.
 */
public class Document {
    
    private UUID id;
    private String fileName;
    private String fileType;
    private String description;
    private LocalDateTime uploadDate;
    private String uploadedBy;
    private String contentReference; // Reference to actual file content
    private Long fileSize;
    
    // Constructors
    public Document() {
        this.id = UUID.randomUUID();
        this.uploadDate = LocalDateTime.now();
    }
    
    public Document(String fileName, String fileType, String description) {
        this();
        this.fileName = fileName;
        this.fileType = fileType;
        this.description = description;
    }
    
    // Getters and Setters
    public UUID getId() {
        return id;
    }
    
    public void setId(UUID id) {
        this.id = id;
    }
    
    public String getFileName() {
        return fileName;
    }
    
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
    
    public String getFileType() {
        return fileType;
    }
    
    public void setFileType(String fileType) {
        this.fileType = fileType;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDateTime getUploadDate() {
        return uploadDate;
    }
    
    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
    
    public String getUploadedBy() {
        return uploadedBy;
    }
    
    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
    
    public String getContentReference() {
        return contentReference;
    }
    
    public void setContentReference(String contentReference) {
        this.contentReference = contentReference;
    }
    
    public Long getFileSize() {
        return fileSize;
    }
    
    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    
    @Override
    public String toString() {
        return "Document{" +
                "id=" + id +
                ", fileName='" + fileName + '\'' +
                ", fileType='" + fileType + '\'' +
                ", description='" + description + '\'' +
                ", uploadDate=" + uploadDate +
                ", uploadedBy='" + uploadedBy + '\'' +
                ", fileSize=" + fileSize +
                '}';
    }
} 