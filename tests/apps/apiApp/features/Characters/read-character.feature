Feature: Get a character

  Background:
    Given an existing "character" with id "f5d4e704-8f50-41da-b029-24d427a69f93"

  Scenario: Retrieve the character in the collection
    Given an authenticated GET request to "/api/v1/Characters/f5d4e704-8f50-41da-b029-24d427a69f93"
    Then the response status code should be 200
    Then the response body should contain
      """
      {
        "id": "f5d4e704-8f50-41da-b029-24d427a69f93"
      }
      """
    Then the response body should have the properties:
      | id       |
      | name     |
      | book     |
      | metadata |

    Given an authenticated GET request to "/api/v1/Characters/f5d4e704-8f50-41da-b029-24d427a69f93?include=book.author"
    Then the response status code should be 200
    Then the field "book.author" should be populated

