package com.unigov.service;

import com.unigov.dto.MessageDtos.*;
import com.unigov.entity.Message;
import com.unigov.entity.Role;
import com.unigov.entity.User;
import com.unigov.repository.MessageRepository;
import com.unigov.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MessageService {

        @Autowired
        private MessageRepository messageRepository;

        @Autowired
        private UserRepository userRepository;

        @Transactional
        public MessageResponse sendMessage(MessageRequest request, String senderUsername) {
                User sender = userRepository.findByUsername(senderUsername)
                                .orElseThrow(() -> new RuntimeException("Sender not found"));
                User recipient = userRepository.findById(request.getRecipientId())
                                .orElseThrow(() -> new RuntimeException("Recipient not found"));

                // Business Rule: Students can only message Delegates or Admins
                if (sender.getRole() == Role.ROLE_STUDENT && recipient.getRole() == Role.ROLE_STUDENT) {
                        throw new RuntimeException("Students cannot message each other privately.");
                }

                Message message = new Message(sender, recipient, request.getContent());
                Message saved = messageRepository.save(message);

                return mapToResponse(saved);
        }

        @Transactional(readOnly = true)
        public List<MessageResponse> getConversation(Long otherUserId, String currentUsername) {
                User currentUser = userRepository.findByUsername(currentUsername)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                User otherUser = userRepository.findById(otherUserId)
                                .orElseThrow(() -> new RuntimeException("Other user not found"));

                List<Message> messages = messageRepository.findConversation(currentUser, otherUser);

                // Mark as read
                messages.stream()
                                .filter(m -> m.getRecipient().equals(currentUser) && !m.isRead())
                                .forEach(m -> m.setRead(true));
                messageRepository.saveAll(messages);

                return messages.stream().map(this::mapToResponse).collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<ConversationResponse> getConversations(String currentUsername) {
                User currentUser = userRepository.findByUsername(currentUsername)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                List<User> participants = messageRepository.findParticipantIdsInConversationWith(currentUser.getId());

                return participants.stream()
                                .map(otherUser -> {
                                        List<Message> conv = messageRepository.findConversation(currentUser, otherUser);
                                        if (conv.isEmpty())
                                                return null;

                                        Message lastMsg = conv.get(conv.size() - 1);
                                        long unreadCount = messageRepository.countByRecipientAndSenderAndIsReadFalse(
                                                        currentUser,
                                                        otherUser);

                                        return ConversationResponse.builder()
                                                        .otherUserId(otherUser.getId())
                                                        .otherUserName(
                                                                        otherUser.getFullName() != null
                                                                                        ? otherUser.getFullName()
                                                                                        : otherUser.getUsername())
                                                        .lastMessage(lastMsg.getContent())
                                                        .lastTimestamp(lastMsg.getTimestamp())
                                                        .unreadCount(unreadCount)
                                                        .build();
                                })
                                .filter(java.util.Objects::nonNull)
                                .sorted(Comparator.comparing(ConversationResponse::getLastTimestamp).reversed())
                                .collect(Collectors.toList());
        }

        @Transactional(readOnly = true)
        public List<ContactResponse> getAvailableContacts(String currentUsername) {
                System.out.println("DEBUG: Fetching contacts for user: " + currentUsername);
                User currentUser = userRepository.findByUsername(currentUsername)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                System.out.println("DEBUG: Current user role: " + currentUser.getRole());

                List<User> allUsers = userRepository.findAll();
                System.out.println("DEBUG: Total users in DB: " + allUsers.size());
                for (User u : allUsers) {
                        System.out.println("DEBUG: Found user: " + u.getUsername() + ", Role: " + u.getRole());
                }

                List<User> users;
                if (currentUser.getRole() == Role.ROLE_STUDENT) {
                        users = allUsers.stream()
                                        .filter(u -> u.getRole() == Role.ROLE_DELEGUE || u.getRole() == Role.ROLE_ADMIN)
                                        .collect(Collectors.toList());
                } else {
                        users = allUsers.stream()
                                        .filter(u -> !u.getUsername().equals(currentUser.getUsername()))
                                        .collect(Collectors.toList());
                }

                System.out.println("DEBUG: Returning " + users.size() + " filtered contacts");
                return users.stream().map(this::mapToContactResponse).collect(Collectors.toList());
        }

        private ContactResponse mapToContactResponse(User u) {
                return ContactResponse.builder()
                                .id(u.getId())
                                .username(u.getUsername())
                                .fullName(u.getFullName())
                                .role(u.getRole() != null ? u.getRole().name() : "ROLE_USER")
                                .profilePhoto(u.getProfilePhoto())
                                .build();
        }

        private MessageResponse mapToResponse(Message m) {
                return MessageResponse.builder()
                                .id(m.getId())
                                .content(m.getContent())
                                .senderId(m.getSender().getId())
                                .senderUsername(m.getSender().getUsername())
                                .recipientId(m.getRecipient().getId())
                                .recipientUsername(m.getRecipient().getUsername())
                                .timestamp(m.getTimestamp())
                                .isRead(m.isRead())
                                .build();
        }
}
