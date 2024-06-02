Feature: Delete a specific book
  In order to delete a specific book
  As an user of the API
  I want to delete a specific book by id

  Scenario: Delete a specific existing book by id
    Given an existing "book" with id "9a6e0804-2bd0-4673-b79d-d97027f9071b"
    Given a DELETE admin request to "/api/v1/Books/9a6e0804-2bd0-4673-b79d-d97027f9071b"
    Then the response status code should be 204
    Then the response body should be empty
