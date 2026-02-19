package com.unigov.dto;

import com.unigov.entity.ComplaintEnums.*;
import java.time.LocalDateTime;

public class ComplaintDtos {

    public static class ComplaintRequest {
        private String title;
        private String description;
        private String category;
        private String location;
        private ComplaintPriority priority;

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

        public ComplaintPriority getPriority() {
            return priority;
        }

        public void setPriority(ComplaintPriority priority) {
            this.priority = priority;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }
    }

    public static class ComplaintResponse {
        private String id;
        private String title;
        private String description;
        private String category;
        private String location;
        private ComplaintStatus status;
        private ComplaintPriority priority;
        private String studentName;
        private String studentDepartment;
        private String response;
        private String attachmentPath;
        private LocalDateTime createdAt;

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

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public ComplaintStatus getStatus() {
            return status;
        }

        public void setStatus(ComplaintStatus status) {
            this.status = status;
        }

        public ComplaintPriority getPriority() {
            return priority;
        }

        public void setPriority(ComplaintPriority priority) {
            this.priority = priority;
        }

        public String getStudentName() {
            return studentName;
        }

        public void setStudentName(String studentName) {
            this.studentName = studentName;
        }

        public String getStudentDepartment() {
            return studentDepartment;
        }

        public void setStudentDepartment(String studentDepartment) {
            this.studentDepartment = studentDepartment;
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

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private ComplaintResponse instance = new ComplaintResponse();

            public Builder id(String id) {
                instance.id = id;
                return this;
            }

            public Builder title(String title) {
                instance.title = title;
                return this;
            }

            public Builder description(String description) {
                instance.description = description;
                return this;
            }

            public Builder category(String category) {
                instance.category = category;
                return this;
            }

            public Builder location(String location) {
                instance.location = location;
                return this;
            }

            public Builder status(ComplaintStatus status) {
                instance.status = status;
                return this;
            }

            public Builder priority(ComplaintPriority priority) {
                instance.priority = priority;
                return this;
            }

            public Builder studentName(String studentName) {
                instance.studentName = studentName;
                return this;
            }

            public Builder studentDepartment(String studentDepartment) {
                instance.studentDepartment = studentDepartment;
                return this;
            }

            public Builder response(String response) {
                instance.response = response;
                return this;
            }

            public Builder attachmentPath(String attachmentPath) {
                instance.attachmentPath = attachmentPath;
                return this;
            }

            public Builder createdAt(LocalDateTime createdAt) {
                instance.createdAt = createdAt;
                return this;
            }

            public ComplaintResponse build() {
                return instance;
            }
        }
    }

    public static class ComplaintUpdate {
        private ComplaintStatus status;
        private String response;
        private ComplaintPriority priority;

        public ComplaintStatus getStatus() {
            return status;
        }

        public void setStatus(ComplaintStatus status) {
            this.status = status;
        }

        public String getResponse() {
            return response;
        }

        public void setResponse(String response) {
            this.response = response;
        }

        public ComplaintPriority getPriority() {
            return priority;
        }

        public void setPriority(ComplaintPriority priority) {
            this.priority = priority;
        }
    }
}
