Feature: Delete a specific book
  In order to delete a specific book
  As an user of the API
  I want to delete a specific book by id

  # Preconditions for the scenario
  Background:
    Given a POST admin request to "/api/v1/Books/" with body
      """
      {
        "id": "9a6e0804-2bd0-4673-b79d-d97027f9071b",
        "title": "The Lord of the Rings",
        "author": "J. R. R. Tolkien",
        "isbn": "978-3-16-148410-0",
        "releaseDate": "2023-10-10T23:21:50.508Z",
        "pages": 1178
      }
      """
    Then the response status code should be 201

  Scenario: Delete a specific existing book by id
    Given a DELETE admin request to "/api/v1/Books/9a6e0804-2bd0-4673-b79d-d97027f9071b"
    Then the response status code should be 204
    Then the response body should be empty
