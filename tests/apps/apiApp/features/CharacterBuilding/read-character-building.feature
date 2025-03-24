Feature: Get a characterBuilding
  In order to see a characterBuilding
  As an authenticated user

  Background:
    Given an existing "characterBuilding" with id "50ab6053-3a83-4a4f-b6b9-ff63a2a826d8"

  Scenario: Get a characterBuilding
    Given an authenticated GET request to "/api/v1/CharacterBuildings/50ab6053-3a83-4a4f-b6b9-ff63a2a826d8"
    Then the response status code should be 200
    Then the response body should contain
      """
      {
        "id": "50ab6053-3a83-4a4f-b6b9-ff63a2a826d8"
      }
      """
    Then the response body should have the properties:
      | id        |
      | character |
      | scene     |
      | actor     |

    Given an authenticated GET request to "/api/v1/CharacterBuildings/50ab6053-3a83-4a4f-b6b9-ff63a2a826d8?include=character.book.author"
    Then the response status code should be 200
    Then the field "character.book.author" should be populated
