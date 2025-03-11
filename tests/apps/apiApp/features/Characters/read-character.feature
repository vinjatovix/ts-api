Feature: Get a character

  Background:
    Given an existing "character" with id "52a3b597-79f3-40e6-87fc-52246dfdcba6"

  Scenario: Retrieve the character in the collection
    Given an authenticated GET request to "/api/v1/Characters/52a3b597-79f3-40e6-87fc-52246dfdcba6"
    Then the response status code should be 200
    Then the response body should contain
      """
      {
        "id": "52a3b597-79f3-40e6-87fc-52246dfdcba6"
      }
      """
    Then the response body should have the properties:
      | id       |
      | name     |
      | book     |
      | metadata |

    Given an authenticated GET request to "/api/v1/Characters/52a3b597-79f3-40e6-87fc-52246dfdcba6?include=book.author"
    Then the response status code should be 200
    Then the field "book.author" should be populated

