Feature: Validate token
  In order to grant access to the application
  As an user
  I want to validate my token

  Scenario: Invalid token
    Given a GET request to "/api/v1/Auth/validate/dasda"
    Then the response status code should be 401
