package com.unigov.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Document(collection = "complaints")
public class Complaint {
    @Id
    private String id;

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    private String category;

    private ComplaintEnums.ComplaintStatus status;

    private ComplaintEnums.ComplaintPriority priority;

    @DBRef
    private User student;

    private String response;

    private String attachmentPath;

    private String location;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Complaint() {
    }

    public Complaint(String id, String title, String description, String category, String location,
            ComplaintEnums.ComplaintStatus status,
            ComplaintEnums.ComplaintPriority priority, User student, String response, String attachmentPath,
            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.location = location;
        this.status = status;
        this.priority = priority;
        this.student = student;
        this.response = response;
        this.attachmentPath = attachmentPath;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public ComplaintEnums.ComplaintStatus getStatus() {
        return status;
    }

    public void setStatus(ComplaintEnums.ComplaintStatus status) {
        this.status = status;
    }

    public ComplaintEnums.ComplaintPriority getPriority() {
        return priority;
    }

    public void setPriority(ComplaintEnums.ComplaintPriority priority) {
        this.priority = priority;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getAttachmentPath() {
        return attachmentPath;
    }

    public void setAttachmentPath(String attachmentPath) {
        this.attachmentPath = attachmentPath;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }
}
