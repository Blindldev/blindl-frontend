describe('Profile Management', () => {
  beforeEach(() => {
    // Visit the sign-in page
    cy.visit('http://localhost:3000/signin');
    
    // Sign in with test credentials
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    // Wait for navigation to waiting page
    cy.url().should('include', '/waiting');
  });

  it('should display all buttons on waiting page', () => {
    // Check for Edit Profile Picture button
    cy.contains('button', 'Edit Profile Picture')
      .should('be.visible')
      .should('have.attr', 'colorScheme', 'blue');

    // Check for Edit Profile Information button
    cy.contains('button', 'Edit Profile Information')
      .should('be.visible')
      .should('have.attr', 'colorScheme', 'teal');

    // Check for Sign Out button
    cy.contains('button', 'Sign Out')
      .should('be.visible')
      .should('have.attr', 'variant', 'outline');
  });

  it('should navigate to edit profile picture page', () => {
    cy.contains('button', 'Edit Profile Picture').click();
    cy.url().should('include', '/edit-profile');
    
    // Check for file input
    cy.get('input[type="file"]').should('exist');
    
    // Go back to waiting page
    cy.contains('button', 'Cancel').click();
    cy.url().should('include', '/waiting');
  });

  it('should navigate to edit profile information page', () => {
    cy.contains('button', 'Edit Profile Information').click();
    cy.url().should('include', '/edit-fields');
    
    // Check for form fields
    cy.get('input[name="name"]').should('exist');
    cy.get('input[name="age"]').should('exist');
    cy.get('select[name="gender"]').should('exist');
    cy.get('input[name="location"]').should('exist');
    cy.get('textarea[name="bio"]').should('exist');
    cy.get('textarea[name="interests"]').should('exist');
    
    // Go back to waiting page
    cy.contains('button', 'Cancel').click();
    cy.url().should('include', '/waiting');
  });

  it('should sign out and return to sign-in page', () => {
    cy.contains('button', 'Sign Out').click();
    cy.url().should('include', '/signin');
  });

  it('should update profile information successfully', () => {
    cy.contains('button', 'Edit Profile Information').click();
    
    // Fill in the form
    cy.get('input[name="name"]').clear().type('Test User');
    cy.get('input[name="age"]').clear().type('25');
    cy.get('select[name="gender"]').select('male');
    cy.get('input[name="location"]').clear().type('Chicago');
    cy.get('textarea[name="bio"]').clear().type('This is a test bio');
    cy.get('textarea[name="interests"]').clear().type('Reading, Hiking, Cooking');
    
    // Submit the form
    cy.contains('button', 'Update Profile Fields').click();
    
    // Check for success toast
    cy.contains('Profile updated').should('be.visible');
    
    // Should return to waiting page
    cy.url().should('include', '/waiting');
  });

  it('should handle profile update errors', () => {
    cy.contains('button', 'Edit Profile Information').click();
    
    // Try to submit empty form
    cy.contains('button', 'Update Profile Fields').click();
    
    // Check for error messages
    cy.contains('Name is required').should('be.visible');
    cy.contains('Age is required').should('be.visible');
    cy.contains('Gender is required').should('be.visible');
    cy.contains('Location is required').should('be.visible');
    cy.contains('Bio is required').should('be.visible');
    cy.contains('Interests is required').should('be.visible');
  });
}); 