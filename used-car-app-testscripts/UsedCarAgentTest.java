import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;
import java.util.Optional;
import java.util.List;

public class UsedCarAgentTest {

    // Instance of UsedCarAgent class, assumed to manage agent functions for used
    // cars
    private UsedCarAgent agent;

    // Instance of CarListing class, representing a sample car listing for testing
    private CarListing carListing;

    @BeforeEach
    public void setUp() {
        // Initialize the UsedCarAgent class and a sample car listing before each test
        agent = new UsedCarAgent();
        carListing = new CarListing("Toyota Camry", "Good condition", 15000, "sedan", 2015);
    }

    @Test
    public void testAgentLogin() {
        // Test case for agent login
        boolean loginSuccess = agent.login("agentUser", "agentPass");
        assertTrue(loginSuccess, "Agent should log in successfully.");
    }

    @Test
    public void testAgentLogout() {
        // Test case for agent logout
        agent.login("agentUser", "agentPass"); // Log in before testing logout
        boolean logoutSuccess = agent.logout();
        assertTrue(logoutSuccess, "Agent should log out successfully.");
    }

    @Test
    public void testViewUsedCarListings() {
        // Test case for viewing used car listings
        agent.addCarListing(carListing); // Add a listing to ensure there's something to view
        assertTrue(agent.viewUsedCarListings().size() > 0, "Agent should be able to view car listings.");
    }

    @Test
    public void testCreateCarListing() {
        // Test case for creating a new car listing
        boolean isCreated = agent.addCarListing(carListing);
        assertTrue(isCreated, "Car listing should be created successfully.");
    }

    @Test
    public void testUpdateCarListing() {
        // Test case for updating an existing car listing
        agent.addCarListing(carListing); // Ensure the listing exists before updating
        boolean isUpdated = agent.updateCarListing(carListing.getId(), "Excellent condition", 16000);
        assertTrue(isUpdated, "Car listing should be updated successfully.");
    }

    @Test
    public void testDeleteCarListing() {
        // Test case for deleting a car listing
        agent.addCarListing(carListing); // Add a listing to delete
        boolean isDeleted = agent.deleteCarListing(carListing.getId());
        assertTrue(isDeleted, "Car listing should be deleted.");
    }

    @Test
    public void testSearchCarListings() {
        // Test case for searching car listings by name
        agent.addCarListing(carListing); // Add a listing to search for
        boolean found = agent.searchCarListings("Toyota Camry");
        assertTrue(found, "Car listing should be found in search.");
    }

    @Test
    public void testViewRatingsAndReviews() {
        // Test case for viewing ratings and reviews associated with the agent
        agent.addRating("Great seller!", 5); // Add a sample rating
        assertEquals(5, agent.viewRatings().get(0).getRating(), "Agent should be able to view ratings.");
    }

    @Test
    public void testUploadCarImages() {
        // Test case for uploading images for a specific car listing
        boolean imagesUploaded = agent.uploadCarImages(carListing.getId(),
                List.of("front.jpg", "back.jpg", "side.jpg")); // Sample image file names
        assertTrue(imagesUploaded, "Images should be uploaded successfully.");
    }

    @Test
    public void testTrackListingViews() {
        // Test case for tracking the number of views a listing has received
        agent.addCarListing(carListing); // Add a listing to track views on
        int views = agent.trackListingViews(carListing.getId());
        assertEquals(0, views, "Initial view count should be 0."); // Assuming no views initially
    }

    @Test
    public void testMarkListingAsSold() {
        // Test case for marking a car listing as sold
        agent.addCarListing(carListing); // Add a listing to mark as sold
        boolean isMarkedSold = agent.markListingAsSold(carListing.getId());
        assertTrue(isMarkedSold, "Listing should be marked as sold.");
    }

    @Test
    public void testOfferPromotions() {
        // Test case for offering promotions or discounts on a listing
        agent.addCarListing(carListing); // Add a listing to apply promotion
        boolean isDiscounted = agent.offerPromotion(carListing.getId(), 10); // Applying a 10% discount
        assertTrue(isDiscounted, "Promotion should be applied to the listing.");
    }
}