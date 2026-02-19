package com.unigov.controller;

import com.unigov.dto.ComplaintDtos.*;
import com.unigov.entity.ComplaintEnums.ComplaintPriority;
import com.unigov.service.ComplaintService;
import com.unigov.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {
    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(consumes = { "multipart/form-data" })
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ComplaintResponse> createComplaint(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "priority", defaultValue = "MEDIUM") ComplaintPriority priority,
            @RequestPart(value = "file", required = false) MultipartFile file,
            Principal principal) {

        ComplaintRequest request = new ComplaintRequest();
        request.setTitle(title);
        request.setDescription(description);
        request.setCategory(category);
        request.setLocation(location);
        request.setPriority(priority);

        String attachmentPath = null;
        if (file != null && !file.isEmpty()) {
            attachmentPath = fileStorageService.storeFile(file);
        }
        return ResponseEntity.ok(complaintService.createComplaint(request, principal.getName(), attachmentPath));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(Principal principal) {
        return ResponseEntity.ok(complaintService.getMyComplaints(principal.getName()));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DELEGUE', 'ADMIN')")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'DELEGUE', 'ADMIN')")
    public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable String id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DELEGUE', 'ADMIN')")
    public ResponseEntity<ComplaintResponse> updateComplaint(@PathVariable String id,
            @RequestBody ComplaintUpdate update) {
        return ResponseEntity.ok(complaintService.updateComplaint(id, update));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DELEGUE', 'ADMIN')")
    public ResponseEntity<?> deleteComplaint(@PathVariable String id) {
        complaintService.deleteComplaint(id);
        return ResponseEntity.ok().build();
    }
}
