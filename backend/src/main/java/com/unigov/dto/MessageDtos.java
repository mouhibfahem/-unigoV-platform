package com.unigov.dto;

import java.time.LocalDateTime;

public class MessageDtos {

    public static class MessageRequest {
        private String content;
        private Long recipientId;

        public MessageRequest() {
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public Long getRecipientId() {
            return recipientId;
        }

        public void setRecipientId(Long recipientId) {
            this.recipientId = recipientId;
        }
    }

    public static class MessageResponse {
        private Long id;
        private String content;
        private String senderUsername;
        private String recipientUsername;
        private Long senderId;
        private Long recipientId;
        private LocalDateTime timestamp;
        private boolean isRead;

        public MessageResponse() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }

        public String getSenderUsername() {
            return senderUsername;
        }

        public void setSenderUsername(String senderUsername) {
            this.senderUsername = senderUsername;
        }

        public String getRecipientUsername() {
            return recipientUsername;
        }

        public void setRecipientUsername(String recipientUsername) {
            this.recipientUsername = recipientUsername;
        }

        public Long getSenderId() {
            return senderId;
        }

        public void setSenderId(Long senderId) {
            this.senderId = senderId;
        }

        public Long getRecipientId() {
            return recipientId;
        }

        public void setRecipientId(Long recipientId) {
            this.recipientId = recipientId;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
        }

        public boolean isRead() {
            return isRead;
        }

        public void setRead(boolean read) {
            isRead = read;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private MessageResponse instance = new MessageResponse();

            public Builder id(Long id) {
                instance.id = id;
                return this;
            }

            public Builder content(String content) {
                instance.content = content;
                return this;
            }

            public Builder senderId(Long senderId) {
                instance.senderId = senderId;
                return this;
            }

            public Builder senderUsername(String senderUsername) {
                instance.senderUsername = senderUsername;
                return this;
            }

            public Builder recipientId(Long recipientId) {
                instance.recipientId = recipientId;
                return this;
            }

            public Builder recipientUsername(String recipientUsername) {
                instance.recipientUsername = recipientUsername;
                return this;
            }

            public Builder timestamp(LocalDateTime timestamp) {
                instance.timestamp = timestamp;
                return this;
            }

            public Builder isRead(boolean isRead) {
                instance.isRead = isRead;
                return this;
            }

            public MessageResponse build() {
                return instance;
            }
        }
    }

    public static class ConversationResponse {
        private Long otherUserId;
        private String otherUserName;
        private String lastMessage;
        private LocalDateTime lastTimestamp;
        private long unreadCount;

        public ConversationResponse() {
        }

        public Long getOtherUserId() {
            return otherUserId;
        }

        public void setOtherUserId(Long otherUserId) {
            this.otherUserId = otherUserId;
        }

        public String getOtherUserName() {
            return otherUserName;
        }

        public void setOtherUserName(String otherUserName) {
            this.otherUserName = otherUserName;
        }

        public String getLastMessage() {
            return lastMessage;
        }

        public void setLastMessage(String lastMessage) {
            this.lastMessage = lastMessage;
        }

        public LocalDateTime getLastTimestamp() {
            return lastTimestamp;
        }

        public void setLastTimestamp(LocalDateTime lastTimestamp) {
            this.lastTimestamp = lastTimestamp;
        }

        public long getUnreadCount() {
            return unreadCount;
        }

        public void setUnreadCount(long unreadCount) {
            this.unreadCount = unreadCount;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private ConversationResponse instance = new ConversationResponse();

            public Builder otherUserId(Long otherUserId) {
                instance.otherUserId = otherUserId;
                return this;
            }

            public Builder otherUserName(String otherUserName) {
                instance.otherUserName = otherUserName;
                return this;
            }

            public Builder lastMessage(String lastMessage) {
                instance.lastMessage = lastMessage;
                return this;
            }

            public Builder lastTimestamp(LocalDateTime lastTimestamp) {
                instance.lastTimestamp = lastTimestamp;
                return this;
            }

            public Builder unreadCount(long unreadCount) {
                instance.unreadCount = unreadCount;
                return this;
            }

            public ConversationResponse build() {
                return instance;
            }
        }
    }

    public static class ContactResponse {
        private Long id;
        private String username;
        private String fullName;
        private String role;
        private String profilePhoto;

        public ContactResponse() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getProfilePhoto() {
            return profilePhoto;
        }

        public void setProfilePhoto(String profilePhoto) {
            this.profilePhoto = profilePhoto;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private ContactResponse instance = new ContactResponse();

            public Builder id(Long id) {
                instance.id = id;
                return this;
            }

            public Builder username(String username) {
                instance.username = username;
                return this;
            }

            public Builder fullName(String fullName) {
                instance.fullName = fullName;
                return this;
            }

            public Builder role(String role) {
                instance.role = role;
                return this;
            }

            public Builder profilePhoto(String profilePhoto) {
                instance.profilePhoto = profilePhoto;
                return this;
            }

            public ContactResponse build() {
                return instance;
            }
        }
    }
}
