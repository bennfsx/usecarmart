import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.Optional;

public class UserAdminTest {

    // Instance of UserAdmin class, which manages admin functionalities
    private UserAdmin admin;

    // Instance of UserAccount class representing a sample user account
    private UserAccount user;

    @BeforeEach
    public void setUp() {
        // Initialize the UserAdmin class and a sample user account before each test
        admin = new UserAdmin();
        user = new UserAccount("john.doe", "password123", "buyer");
    }

    @Test
    public void testCreateUserAccount() {
        // Test case for creating a new user account
        boolean isCreated = admin.createUserAccount("john.doe", "password123", "buyer");
        assertTrue(isCreated, "User account should be created successfully.");
    }

    @Test
    public void testLogin() {
        // Test case for admin login
        admin.createUserAccount("admin", "adminPass", "admin");
        boolean loginSuccess = admin.login("admin", "adminPass");
        assertTrue(loginSuccess, "User admin should log in successfully.");
    }

    @Test
    public void testLogout() {
        // Test case for admin logout
        admin.login("admin", "adminPass");
        boolean logoutSuccess = admin.logout();
        assertTrue(logoutSuccess, "User admin should log out successfully.");
    }

    @Test
    public void testUpdateUserAccount() {
        // Test case for updating an existing user account
        admin.createUserAccount("john.doe", "password123", "buyer");
        boolean isUpdated = admin.updateUserAccount("john.doe", "newPass123", "seller");
        assertTrue(isUpdated, "User account should be updated successfully.");
    }

    @Test
    public void testViewUserAccount() {
        // Test case for viewing a user account's details
        admin.createUserAccount("john.doe", "password123", "buyer");
        Optional<UserAccount> retrievedUser = admin.viewUserAccount("john.doe");
        assertTrue(retrievedUser.isPresent(), "User account should be found.");
    }

    @Test
    public void testSearchUserAccount() {
        // Test case for searching a user account
        admin.createUserAccount("john.doe", "password123", "buyer");
        boolean found = admin.searchUserAccount("john.doe");
        assertTrue(found, "User account should be found in search.");
    }

    @Test
    public void testSuspendUserAccount() {
        // Test case for suspending a user account
        admin.createUserAccount("john.doe", "password123", "buyer");
        boolean isSuspended = admin.suspendUserAccount("john.doe");
        assertTrue(isSuspended, "User account should be suspended.");
    }

    @Test
    public void testCreateUserProfile() {
        // Test case for creating a user profile
        boolean profileCreated = admin.createUserProfile("john.doe", "buyer");
        assertTrue(profileCreated, "User profile should be created.");
    }

    @Test
    public void testViewUserProfile() {
        // Test case for viewing a user profile
        admin.createUserProfile("john.doe", "buyer");
        Optional<UserProfile> profile = admin.viewUserProfile("john.doe");
        assertTrue(profile.isPresent(), "User profile should be viewable.");
    }

    @Test
    public void testUpdateUserProfile() {
        // Test case for updating a user profile
        admin.createUserProfile("john.doe", "buyer");
        boolean isUpdated = admin.updateUserProfile("john.doe", "seller");
        assertTrue(isUpdated, "User profile should be updated.");
    }

    @Test
    public void testSuspendUserProfile() {
        // Test case for suspending a user profile
        admin.createUserProfile("john.doe", "buyer");
        boolean isSuspended = admin.suspendUserProfile("john.doe");
        assertTrue(isSuspended, "User profile should be suspended.");
    }

    @Test
    public void testResetUserPassword() {
        // Test case for resetting a user's password
        admin.createUserAccount("john.doe", "password123", "buyer");
        boolean isReset = admin.resetUserPassword("john.doe", "newPassword123");
        assertTrue(isReset, "User password should be reset.");
    }

    @Test
    public void testDeactivateUserAccount() {
        // Test case for deactivating a user account
        admin.createUserAccount("john.doe", "password123", "buyer");
        boolean isDeactivated = admin.deactivateUserAccount("john.doe");
        assertTrue(isDeactivated, "User account should be deactivated.");
    }
}