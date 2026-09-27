package za.ac.cput.branded.service;

public interface UserContactLookUpService {

    /** Returns null if the user id doesn't resolve to an email address. */
    String findEmailByUserId(String userId);
}