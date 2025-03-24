Feature: Get all scenes in the collection
  In order to see all scenes in the collection
  As an authenticated user

  Background:
    Given an existing "scene" with id "fd2c6d94-77db-4a8a-8578-63ad8501f388"
    Given an existing "scene" with id "bc92a3f0-0dea-45fd-8d23-b57505d5d3cd"


  Scenario: Get all Scenes in the collection
    Given an authenticated GET request to "/api/v1/Scenes"
    Then the response status code should be 200
    Then the response body will be an array containing
      """
      {
        "id": "fd2c6d94-77db-4a8a-8578-63ad8501f388"
      }
      """
    Then the response body will be an array containing
      """
      {
        "id": "bc92a3f0-0dea-45fd-8d23-b57505d5d3cd"
      }
      """

    Given an authenticated GET request to "/api/v1/Scenes?include=characters.book.author"
    Then the response status code should be 200
    Then the field "characters[0].book.author" should be populated
