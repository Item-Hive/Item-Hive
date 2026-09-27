package za.ac.cput.branded.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Component;

@Component
public class JpaUserContactLookUpService implements UserContactLookUpService {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public String findEmailByUserId(String userId) {
        if (userId == null) return null;
        try {
            return (String) entityManager
                    .createNativeQuery("SELECT email FROM app_users WHERE id = :id")
                    .setParameter("id", userId)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}