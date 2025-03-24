Feature: Delete a specefic character
  As an user of the API
  I want to delete a specific character by id

  Scenario: Delete a specific existing character by id
    Given an existing "character" with id "cb4f3826-6326-43fd-856c-e285894cfa77"
    Given a DELETE admin request to "/api/v1/Characters/cb4f3826-6326-43fd-856c-e285894cfa77"
    Then the response status code should be 204
    Then the response body should be empty

  Scenario: Should not delete a character with associated scenes
    Given an existing "character" with id "15822e5d-189f-4ac3-bfe8-6ac1e16b5f5b"
    Given an existing "scene" with id "3a7ed350-f8fa-40b9-b905-550f35c12e38"
    Given a PATCH admin request to "/api/v1/Scenes/3a7ed350-f8fa-40b9-b905-550f35c12e38" with body
      """
      {
        "characters": [
          "15822e5d-189f-4ac3-bfe8-6ac1e16b5f5b"
        ]
      }
      """
    Then the response status code should be 200

    Given a DELETE admin request to "/api/v1/Characters/15822e5d-189f-4ac3-bfe8-6ac1e16b5f5b"
    Then the response status code should be 409
    Then the response body should be
      """
      {
        "message": "Character <15822e5d-189f-4ac3-bfe8-6ac1e16b5f5b> has associated scenes"
      }
      """
