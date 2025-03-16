Feature: Get a scene

  Background:
    Given an existing "scene" with id "aef71699-07b1-49b0-8c17-dfdb8070a259"

  Scenario: Retrieve the scene in the collection
    Given an authenticated GET request to "/api/v1/Scenes/aef71699-07b1-49b0-8c17-dfdb8070a259"
    Then the response status code should be 200
    Then the response body should contain
      """
      {
        "id": "aef71699-07b1-49b0-8c17-dfdb8070a259"
      }
      """
    Then the response body should have the properties:
      | id          |
      | description |
      | characters  |
      | metadata    |

    Given an authenticated GET request to "/api/v1/Scenes/aef71699-07b1-49b0-8c17-dfdb8070a259?include=characters.book.author"
    Then the response status code should be 200
    Then the field "characters[0].book.author" should be populated

  Scenario: Not Found
    Given an authenticated GET request to "/api/v1/Scenes/00000000-0000-0000-0000-000000000000"
    Then the response status code should be 404
    Then the response body should be
      """
      {
        "message": "Scene <00000000-0000-0000-0000-000000000000> not found."
      }
      """
