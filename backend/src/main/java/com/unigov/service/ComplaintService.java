package com.unigov.service;

import com.unigov.dto.ComplaintDtos.*;
import com.unigov.entity.Complaint;
import com.unigov.entity.ComplaintEnums.*;
import com.unigov.entity.User;
import com.unigov.repository.ComplaintRepository;
import com.unigov.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintService {
    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    private static final Logger logger = LoggerFactory.getLogger(ComplaintService.class);

    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request, String username, String attachmentPath) {
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(request.getCategory());
        complaint.setLocation(request.getLocation());
        complaint.setPriority(request.getPriority() != null ? request.getPriority() : ComplaintPriority.MEDIUM);
        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setStudent(student);
        complaint.setAttachmentPath(attachmentPath);

        Complaint saved = complaintRepository.save(complaint);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getMyComplaints(String username) {
        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return complaintRepository.findByStudent(student).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintById(String id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        return mapToResponse(complaint);
    }

    @Transactional
    public ComplaintResponse updateComplaint(String id, ComplaintUpdate update) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (update.getStatus() != null)
            complaint.setStatus(update.getStatus());
        if (update.getResponse() != null)
            complaint.setResponse(update.getResponse());
        if (update.getPriority() != null)
            complaint.setPriority(update.getPriority());

        complaint.setUpdatedAt(LocalDateTime.now());

        Complaint saved = complaintRepository.save(complaint);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteComplaint(String id) {
        logger.info("Attempting to delete complaint with ID: {}", id);
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        // Delete attachment if exists
        if (complaint.getAttachmentPath() != null) {
            try {
                java.nio.file.Path rootLocation = java.nio.file.Paths.get(uploadDir).toAbsolutePath().normalize();
                java.nio.file.Path filePath = rootLocation.resolve(complaint.getAttachmentPath()).normalize();
                logger.info("Deleting attachment file: {}", filePath);
                java.nio.file.Files.deleteIfExists(filePath);
            } catch (java.io.IOException e) {
                logger.error("Failed to delete attachment: {}", e.getMessage());
            }
        }

        complaintRepository.delete(complaint);
        logger.info("Complaint with ID: {} deleted successfully", id);
    }

    private ComplaintResponse mapToResponse(Complaint complaint) {
        return ComplaintResponse.builder()
                .id(complaint.getId())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .category(complaint.getCategory())
                .location(complaint.getLocation())
                .status(complaint.getStatus())
                .priority(complaint.getPriority())
                .studentName(complaint.getStudent().getFullName())
                .studentDepartment(complaint.getStudent().getDepartment())
                .response(complaint.getResponse())
                .attachmentPath(complaint.getAttachmentPath())
                .createdAt(complaint.getCreatedAt())
                .build();
    }
}
