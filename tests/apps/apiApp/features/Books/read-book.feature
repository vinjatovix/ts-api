Feature: Get a specific book by id
  In order to get a specific book
  As an user of the API
  I want to get a specific book by id

  Background:
    Given an existing "book" with id "9a6e0804-2bd0-4672-b79d-d97027f9074e"

  Scenario: Get a specific existing book by id
    Given an authenticated GET request to "/api/v1/Books/9a6e0804-2bd0-4672-b79d-d97027f9074e"
    Then the response status code should be 200
    Then the response body should contain
      """
      {
        "id": "9a6e0804-2bd0-4672-b79d-d97027f9074e"
      }
      """
    Then the response body should have the properties:
      | id          |
      | title       |
      | author      |
      | isbn        |
      | releaseDate |
      | pages       |



