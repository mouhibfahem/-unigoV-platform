package com.unigov.dto;

import java.time.LocalDateTime;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;

public class AnnouncementDtos {
    public static class AnnouncementRequest {
        @NotBlank
        private String title;
        @NotBlank
        private String content;
        private MultipartFile file;

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public MultipartFile getFile() {
            return file;
        }

        public void setFile(MultipartFile file) {
            this.file = file;
        }
    }

    public static class AnnouncementResponse {
        private Long id;
        private String title;
        private String content;
        private String attachmentUrl;
        private String delegateName;
        private LocalDateTime createdAt;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getAttachmentUrl() {
            return attachmentUrl;
        }

        public void setAttachmentUrl(String attachmentUrl) {
            this.attachmentUrl = attachmentUrl;
        }

        public String getDelegateName() {
            return delegateName;
        }

        public void setDelegateName(String delegateName) {
            this.delegateName = delegateName;
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
            private AnnouncementResponse instance = new AnnouncementResponse();

            public Builder id(Long id) {
                instance.id = id;
                return this;
            }

            public Builder title(String title) {
                instance.title = title;
                return this;
            }

            public Builder content(String content) {
                instance.content = content;
                return this;
            }

            public Builder attachmentUrl(String attachmentUrl) {
                instance.attachmentUrl = attachmentUrl;
                return this;
            }

            public Builder delegateName(String delegateName) {
                instance.delegateName = delegateName;
                return this;
            }

            public Builder createdAt(LocalDateTime createdAt) {
                instance.createdAt = createdAt;
                return this;
            }

            public AnnouncementResponse build() {
                return instance;
            }
        }
    }
}
