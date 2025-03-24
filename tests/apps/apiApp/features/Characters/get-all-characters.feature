Feature: Get all characters in the collection

  Background:
    Given an existing "character" with id "6b12f109-f9f2-42e5-98f2-34d8280a2ae4"
    Given an existing "character" with id "d7e06237-8fbd-435c-8c6a-e499ccb48c11"

  Scenario: Get all characters in the collection
    Given an authenticated GET request to "/api/v1/Characters"
    Then the response status code should be 200
    Then the response body will be an array containing
      """
      {
        "id": "6b12f109-f9f2-42e5-98f2-34d8280a2ae4"
      }
      """
    Then the response body will be an array containing
      """
      {
        "id": "d7e06237-8fbd-435c-8c6a-e499ccb48c11"
      }
      """

    Given an authenticated GET request to "/api/v1/Characters/?include=book.author&fields=book.title,book.author,name"
    Then the response status code should be 200
    Then the field "book.author" should be populated
