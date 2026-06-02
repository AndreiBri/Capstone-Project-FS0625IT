package com.monkeybar.backend.service;

import com.monkeybar.backend.entity.Event;
import com.monkeybar.backend.entity.NewsletterSubscriber;
import com.monkeybar.backend.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NewsletterService {

    private final NewsletterSubscriberRepository newsletterRepo;
    private final EmailService emailService;

    public void subscribe(String email) {

        Optional<NewsletterSubscriber> duplicate = newsletterRepo.findByEmail(email);

        if (duplicate.isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        NewsletterSubscriber subscriber = new NewsletterSubscriber();

        subscriber.setEmail(email);
        newsletterRepo.save(subscriber);
    }

    public void sendNewsletterForEvent(Event event) {
        List<NewsletterSubscriber> allSubscribers = newsletterRepo.findAll();

        allSubscribers.forEach(subscriber -> {
            emailService.sendNewsletterEmail(subscriber.getEmail(), event);
        });

    }

    public List<NewsletterSubscriber> getAllSubscribers() {
        return newsletterRepo.findAll();
    }

    public void deleteSubscriber(UUID id) {
        newsletterRepo.deleteById(id);
    }

    public void deleteAllSubscribers() {
        newsletterRepo.deleteAll();
    }
}
