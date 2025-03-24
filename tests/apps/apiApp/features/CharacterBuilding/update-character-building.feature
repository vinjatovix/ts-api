Feature: Update an existing characterBuilding
  As an user
  I want to update an existing characterBuilding

  Scenario: A valid existing characterBuilding

    Given an existing "character" with id "de1b2b41-babd-4793-9788-4b30a3bb3690"
    Given a POST admin request to "/api/v1/Scenes/" with body
      """
      {
        "id": "de4ebcad-3e04-41da-a3b0-2fe6ac9dcf4e",
        "description": "La pescadería",
        "characters": [
          "de1b2b41-babd-4793-9788-4b30a3bb3690"
        ]
      }
      """
    Then the response status code should be 201

    Given a POST request to "/api/v1/Auth/register" with body
      """
      {
        "id": "0a50f3aa-bc6f-41fe-a55a-03bc14b0c3a6",
        "username": "CBupdater",
        "email": "CBupdater@aa.com",
        "password": "#aD3fe2.0%",
        "repeatPassword": "#aD3fe2.0%"
      }
      """
    Then the response status code should be 201
    Given an authentication with body
      """
      {
        "email": "CBupdater@aa.com",
        "password": "#aD3fe2.0%"
      }
      """
    Given a POST user request to "/api/v1/CharacterBuildings/" with body
      """
      {
        "id": "e8e48d1e-6595-42e9-a641-bcfe0d692e4b",
        "actor": "0a50f3aa-bc6f-41fe-a55a-03bc14b0c3a6",
        "character": "de1b2b41-babd-4793-9788-4b30a3bb3690",
        "scene": "de4ebcad-3e04-41da-a3b0-2fe6ac9dcf4e",
        "center": "mental",
        "sceneCircumstances": "Al volver de la lonja, el pescadero no encuentra a su mujer",
        "previousCircumstances": "En la lonja los precios han subido",
        "relationshipCircumstances": []
      }
      """

    Then the response status code should be 201
    Given a PATCH user request to "/api/v1/CharacterBuildings/e8e48d1e-6595-42e9-a641-bcfe0d692e4b" with body
      """
      {
        "center": "instinctive"
      }
      """
    Then the response status code should be 200
    Then the response body should be empty

  Scenario: A not owned characterBuilding
    Given an existing "characterBuilding" with id "4bf446d5-766c-430e-bc6f-49c405b7c23c"

    Given a PATCH user request to "/api/v1/CharacterBuildings/4bf446d5-766c-430e-bc6f-49c405b7c23c" with body
      """
      {
        "actionUnits": [
          {
            "action": "seduce",
            "strategies": [
              "flirt",
              "touch",
              "kiss"
            ]
          }
        ]
      }
      """
    Then the response status code should be 403
    Then the response body should be
      """
      {
        "message": "You dont own this characterBuilding"
      }
      """
