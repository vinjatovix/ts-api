Feature: Update an existing scene
  As an user with admin rights
  I want to update an existing scene

  Scenario: A valid existing scene
    Given an existing "scene" with id "aef71699-07b1-49b0-8c17-dfdb8070a259"
    Given an existing "character" with id "52a3b597-79f3-40e6-87fc-52246dfdcba6"

    Given a PATCH admin request to "/api/v1/Scenes/aef71699-07b1-49b0-8c17-dfdb8070a259" with body
      """
      {
        "description": "A new description",
        "characters": [
          "52a3b597-79f3-40e6-87fc-52246dfdcba6"
        ]
      }
      """
    Then the response status code should be 200
    Then the response body should be empty

  Scenario: An update that makes no changes
    Given a PATCH admin request to "/api/v1/Scenes/aef71699-07b1-49b0-8c17-dfdb8070a259" with body
      """
      {
        "description": "A new description",
        "characters": [
          "52a3b597-79f3-40e6-87fc-52246dfdcba6"
        ]
      }
      """
    Then the response status code should be 400
    Then the response body should be
      """
      {
        "message": "Nothing to update"
      }
      """

  Scenario: A non existing scene
    Given a PATCH admin request to "/api/v1/Scenes/00000000-0000-0000-0000-000000000000" with body
      """
      {
        "characters": [
          "52a3b597-79f3-40e6-87fc-52246dfdcba6"
        ]
      }
      """

    Then the response status code should be 404
    Then the response body should be
      """
      {
        "message": "Scene <00000000-0000-0000-0000-000000000000> not found."
      }
      """

  Scenario: An unprocessable scene
    Given a PATCH admin request to "/api/v1/Scenes/aef71699-07b1-49b0-8c17-dfdb8070a259" with body
      """
      {
        "characters": [
          "6b2a6da5-2281-4eec-b081-6c6f35cda79e"
        ]
      }
      """
    Then the response status code should be 404
    Then the response body should be
      """
      {
        "message": "Characters: 6b2a6da5-2281-4eec-b081-6c6f35cda79e not found."
      }
      """

  Scenario: An unprocessable scene
    Given a PATCH admin request to "/api/v1/Scenes/aef71699-07b1-49b0-8c17-dfdb8070a259" with body
      """
      {
        "description": {
          "characters": []
        }
      }
      """
    Then the response status code should be 400
    Then the response body should be
      """
      {
        "message": "{ description : Invalid value at body. Value: [object Object] }"
      }
      """
