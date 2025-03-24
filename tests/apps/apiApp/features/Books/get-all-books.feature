Feature: Get all books in the collection
  In order to see all books in the collection
  As an authenticated user

  Background:
    Given an existing "book" with id "9a6e0804-2bd0-4672-a79d-d97027f9071c"
    Given an existing "book" with id "9a6e0804-2bd0-4672-b79d-b97027f9071d"

  Scenario: Get all books in the collection
    Given an authenticated GET request to "/api/v1/Books"
    Then the response status code should be 200
    Then the response body will be an array containing
      """
      {
        "id": "9a6e0804-2bd0-4672-a79d-d97027f9071c"
      }
      """
    Then the response body will be an array containing
      """
      {
        "id": "9a6e0804-2bd0-4672-b79d-b97027f9071d"
      }
      """
