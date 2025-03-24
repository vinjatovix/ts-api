Feature: Get all characterBuildings in the collection
  In order to see all characterBuildings in the collection
  As an authenticated user

  Background:
    Given an existing "characterBuilding" with id "cb2fc66d-c9d5-440f-96c3-3eb28594b6a8"
    Given an existing "characterBuilding" with id "45370579-3415-4cc9-b499-973f20b21d34"

  Scenario: Get all characterBuildings in the collection
    Given an authenticated GET request to "/api/v1/CharacterBuildings"
    Then the response status code should be 200
    Then the response body will be an array containing
      """
      {
        "id": "cb2fc66d-c9d5-440f-96c3-3eb28594b6a8"
      }
      """
    Then the response body will be an array containing
      """
      {
        "id": "45370579-3415-4cc9-b499-973f20b21d34"
      }
      """

    Given an authenticated GET request to "/api/v1/CharacterBuildings?include=character.book.author"
    Then the response status code should be 200
    Then the field "character.book.author" should be populated
