package com.unigov;

import com.unigov.entity.Role;
import com.unigov.entity.User;
import com.unigov.repository.UserRepository;
import com.unigov.repository.ComplaintRepository;
import com.unigov.repository.PollRepository;
import com.unigov.repository.EventRepository;
import com.unigov.repository.DecisionRepository;
import com.unigov.repository.PollOptionRepository;
import com.unigov.repository.AnnouncementRepository;
import com.unigov.entity.Announcement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.ArrayList;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ComplaintRepository complaintRepository;
    private final PollRepository pollRepository;
    private final EventRepository eventRepository;
    private final DecisionRepository decisionRepository;
    private final PollOptionRepository pollOptionRepository;
    private final AnnouncementRepository announcementRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
            ComplaintRepository complaintRepository,
            PollRepository pollRepository,
            EventRepository eventRepository,
            DecisionRepository decisionRepository,
            PollOptionRepository pollOptionRepository,
            AnnouncementRepository announcementRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.complaintRepository = complaintRepository;
        this.pollRepository = pollRepository;
        this.eventRepository = eventRepository;
        this.decisionRepository = decisionRepository;
        this.pollOptionRepository = pollOptionRepository;
        this.announcementRepository = announcementRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAllData();
    }

    public void seedAllData() {
        // 1. Initialize Users
        logger.info("Checking for default users...");

        // Admin
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@unigov.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Administrator");
            admin.setDepartment("Direction Générale");
            admin.setRole(Role.ROLE_ADMIN);
            userRepository.save(admin);
            logger.info("Admin account created.");
        }

        // Delegate 1: Mouhib Fahem
        if (userRepository.findByUsername("mouhib_fahem").isEmpty()) {
            User delegue1 = new User();
            delegue1.setUsername("mouhib_fahem");
            delegue1.setEmail("mouhib.fahem28@gmail.com");
            delegue1.setPassword(passwordEncoder.encode("mouhib"));
            delegue1.setFullName("Mouhib Fahem");
            delegue1.setDepartment("Informatique");
            delegue1.setRole(Role.ROLE_DELEGUE);
            userRepository.save(delegue1);
            logger.info("Delegate 'mouhib_fahem' created.");
        }

        // Delegate 2: Wiem Tamboura
        if (userRepository.findByUsername("wiem_tamboura").isEmpty()) {
            User delegue2 = new User();
            delegue2.setUsername("wiem_tamboura");
            delegue2.setEmail("wiem.tamboura@unigov.com");
            delegue2.setPassword(passwordEncoder.encode("wiem"));
            delegue2.setFullName("Wiem Tamboura");
            delegue2.setDepartment("Génie Industriel");
            delegue2.setRole(Role.ROLE_DELEGUE);
            userRepository.save(delegue2);
            logger.info("Delegate 'wiem_tamboura' created.");
        }

        // Student
        if (userRepository.findByUsername("etudiant1").isEmpty()) {
            User student = new User();
            student.setUsername("etudiant1");
            student.setEmail("etudiant@unigov.com");
            student.setPassword(passwordEncoder.encode("etudiant123"));
            student.setFullName("Etudiant Amri Mahmoud");
            student.setDepartment("Génie Mécatronique");
            student.setRole(Role.ROLE_STUDENT);
            userRepository.save(student);
            logger.info("Student account created.");
        }

        logger.info("=== User Initialization Complete ===");

        // Seed Complaints if none exist
        if (complaintRepository.count() == 0) {
            User student = userRepository.findByUsername("etudiant1").orElse(null);

            if (student != null) {
                // Cafeteria Complaint
                com.unigov.entity.Complaint c1 = new com.unigov.entity.Complaint();
                c1.setTitle("État de la buvette annexe");
                c1.setDescription(
                        "L'état de la buvette de l'annexe est déplorable. Hygiène douteuse et manque de choix.");
                c1.setCategory("Infrastructure");
                c1.setLocation("Annexe, Buvette");
                c1.setPriority(com.unigov.entity.ComplaintEnums.ComplaintPriority.HIGH);
                c1.setStatus(com.unigov.entity.ComplaintEnums.ComplaintStatus.PENDING);
                c1.setStudent(student);
                complaintRepository.save(c1);

                // Exam Results Complaint
                com.unigov.entity.Complaint c2 = new com.unigov.entity.Complaint();
                c2.setTitle("Retard affichage notes examens");
                c2.setDescription(
                        "Les notes devaient être affichées le 25/02 comme prévu par le règlement. Le retard est inacceptable.");
                c2.setCategory("Exams");
                c2.setLocation("Bloc Central, Salle 5");
                c2.setPriority(com.unigov.entity.ComplaintEnums.ComplaintPriority.URGENT);
                c2.setStatus(com.unigov.entity.ComplaintEnums.ComplaintStatus.IN_PROGRESS);
                c2.setStudent(student);
                complaintRepository.save(c2);

                logger.info("=== Demo Complaints created ===");
            }
        }

        // Seed Polls
        User delegue = userRepository.findByUsername("mouhib_fahem").orElse(null);
        if (delegue != null) {
            // Poll 1: Revision Week
            String q1 = "Êtes-vous favorables à une semaine de révision supplémentaire avant les rattrapages ?";
            if (pollRepository.findByQuestion(q1).isEmpty()) {
                com.unigov.entity.Poll p1 = new com.unigov.entity.Poll();
                p1.setQuestion(q1);
                p1.setCreator(delegue);
                p1.setOptions(new ArrayList<>());
                pollRepository.save(p1);

                com.unigov.entity.PollOption p1o1 = new com.unigov.entity.PollOption();
                p1o1.setText("Oui, c'est indispensable");
                p1o1.setPoll(p1);
                p1o1.setVotes(45);
                pollOptionRepository.save(p1o1);

                com.unigov.entity.PollOption p1o2 = new com.unigov.entity.PollOption();
                p1o2.setText("Non, je préfère finir plus tôt");
                p1o2.setPoll(p1);
                p1o2.setVotes(12);
                pollOptionRepository.save(p1o2);

                p1.getOptions().add(p1o1);
                p1.getOptions().add(p1o2);
                pollRepository.save(p1);
                logger.info("Poll 'Revision Week' seeded.");
            }

            // Poll 2: Cafeteria Services
            String q2 = "Quel nouveau service souhaiteriez-vous à la buvette annexe ?";
            if (pollRepository.findByQuestion(q2).isEmpty()) {
                com.unigov.entity.Poll p2 = new com.unigov.entity.Poll();
                p2.setQuestion(q2);
                p2.setCreator(delegue);
                p2.setOptions(new ArrayList<>());
                pollRepository.save(p2);

                String[] p2opts = { "Plus de choix de plats", "Paiement mobile", "Micro-ondes", "Autre" };
                for (String opt : p2opts) {
                    com.unigov.entity.PollOption o = new com.unigov.entity.PollOption();
                    o.setText(opt);
                    o.setPoll(p2);
                    o.setVotes((int) (Math.random() * 30));
                    pollOptionRepository.save(o);
                    p2.getOptions().add(o);
                }
                pollRepository.save(p2);
                logger.info("Poll 'Cafeteria' seeded.");
            }

            // Poll 3: Satisfaction
            String q3 = "Globalement, comment jugez-vous la réactivité de l'administration ce semestre ?";
            if (pollRepository.findByQuestion(q3).isEmpty()) {
                com.unigov.entity.Poll p3 = new com.unigov.entity.Poll();
                p3.setQuestion(q3);
                p3.setCreator(delegue);
                p3.setOptions(new ArrayList<>());
                pollRepository.save(p3);

                String[] p3opts = { "Excellente", "Bonne", "Passable", "Mauvaise" };
                for (String opt : p3opts) {
                    com.unigov.entity.PollOption o = new com.unigov.entity.PollOption();
                    o.setText(opt);
                    o.setPoll(p3);
                    o.setVotes((int) (Math.random() * 25));
                    pollOptionRepository.save(o);
                    p3.getOptions().add(o);
                }
                pollRepository.save(p3);
                logger.info("Poll 'Satisfaction' seeded.");
            }
        }

        // Seed Events
        if (eventRepository.count() == 0) {
            java.time.LocalDateTime now = java.time.LocalDateTime.now();
            eventRepository.save(new com.unigov.entity.Event(
                    "Réunion de Coordination",
                    "Session de travail hebdomadaire entre les délégués et l'administration.",
                    "Bloc A - Salle 102",
                    now.plusDays(1).withHour(14).withMinute(0),
                    now.plusDays(1).withHour(16).withMinute(0),
                    com.unigov.entity.Event.EventType.MEETING));

            eventRepository.save(new com.unigov.entity.Event(
                    "Fin des Inscriptions PFE",
                    "Dernier délai pour soumettre les formulaires de stage et PFE.",
                    "Portail Etudiant",
                    now.plusDays(3).withHour(23).withMinute(59),
                    now.plusDays(3).withHour(23).withMinute(59),
                    com.unigov.entity.Event.EventType.ACADEMIC));

            eventRepository.save(new com.unigov.entity.Event(
                    "Soirée d'intégration",
                    "Événement festif pour accueillir les nouveaux arrivants.",
                    "Club Etudiants",
                    now.plusDays(5).withHour(19).withMinute(0),
                    now.plusDays(6).withHour(0).withMinute(0),
                    com.unigov.entity.Event.EventType.SOCIAL));

            logger.info("=== Events seeded ===");
        }

        // Seed Decisions
        if (decisionRepository.count() == 0) {
            decisionRepository.save(new com.unigov.entity.Decision(
                    "Nouveaux Horaires de la Bibliothèque",
                    "À partir du lundi prochain, la bibliothèque sera ouverte de 08h00 à 20h00 sans interruption.",
                    "Infrastructure"));
            decisionRepository.save(new com.unigov.entity.Decision(
                    "Report des Examens de TP",
                    "Les examens de travaux pratiques prévus pour mardi sont reportés à une date ultérieure.",
                    "Académique"));
            logger.info("=== Decisions seeded ===");
        }

        // Seed Announcements
        if (delegue != null) {
            String t1 = "Bienvenue sur la plateforme UniGov !";
            if (announcementRepository.findAll().stream().noneMatch(a -> a.getTitle().equals(t1))) {
                Announcement a1 = new Announcement();
                a1.setTitle(t1);
                a1.setContent(
                        "Nous sommes ravis de lancer ce nouvel espace de communication pour tous les étudiants. Explorez les sondages et exprimez-vous !");
                a1.setDelegate(delegue);
                announcementRepository.save(a1);
                logger.info("Announcement 'Bienvenue' seeded.");
            }

            String t2 = "Rappel : Inscriptions aux Clubs";
            if (announcementRepository.findAll().stream().noneMatch(a -> a.getTitle().equals(t2))) {
                Announcement a2 = new Announcement();
                a2.setTitle(t2);
                a2.setContent(
                        "Le délai pour s'inscrire aux différents clubs de l'ENICarthage est fixé à vendredi prochain. Ne tardez pas !");
                a2.setDelegate(delegue);
                announcementRepository.save(a2);
                logger.info("Announcement 'Clubs' seeded.");
            }

            String t3 = "Maintenance prévue du Portail";
            if (announcementRepository.findAll().stream().noneMatch(a -> a.getTitle().equals(t3))) {
                Announcement a3 = new Announcement();
                a3.setTitle(t3);
                a3.setContent(
                        "Le portail subira une courte maintenance ce dimanche à 22h pour améliorer les performances du système de messagerie.");
                a3.setDelegate(delegue);
                announcementRepository.save(a3);
                logger.info("Announcement 'Maintenance' seeded.");
            }
        }
    }
}
