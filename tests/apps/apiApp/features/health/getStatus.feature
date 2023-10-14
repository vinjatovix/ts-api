Feature: Api Health Check
  In order to verify the application's availability
  As a health check client
  I want check the API status

  Scenario: Performing a health check
    Given a GET request to "/api/v1/health/http"
    Then the response status code should be 200
    Then the response body should contain
      """
      {
        "status": "OK"
      }
      """

