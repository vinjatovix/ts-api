Feature: Delete a specific character building
  In order to delete a specific character building
  As an user of the API
  I want to delete a specific character building by id



  Scenario: Delete a non-owned character building by id
    Given a POST request to "/api/v1/Auth/register" with body
      """
      {
        "id": "6839da40-3206-431d-9de0-7f2b444dba1d",
        "username": "CBRemover",
        "email": "CBRemover@aa.com",
        "password": "#aD3fe2.0%",
        "repeatPassword": "#aD3fe2.0%"
      }
      """
    Then the response status code should be 201
    Given an authentication with body
      """
      {
        "email": "CBRemover@aa.com",
        "password": "#aD3fe2.0%"
      }
      """
    Given an existing "characterBuilding" with id "a23fa5e7-c0ea-4a31-9660-f9750d52ec9e"

    Given a DELETE user request to "/api/v1/CharacterBuildings/a23fa5e7-c0ea-4a31-9660-f9750d52ec9e"

    Then the response status code should be 403
    Then the response body should contain
      """
      {
        "message": "You dont own this characterBuilding"
      }
      """

  Scenario: Delete a specific existing character building by id
    Given an existing "character" with id "fa81499d-6827-42ae-8cdd-6e029b57cb7f"
    Given a POST admin request to "/api/v1/Scenes/" with body
      """
      {
        "id": "9473a947-647e-4519-8eb5-6c7a2884378e",
        "description": "El mercado",
        "characters": [
          "fa81499d-6827-42ae-8cdd-6e029b57cb7f"
        ]
      }
      """
    Then the response status code should be 201
    Given a POST user request to "/api/v1/CharacterBuildings/" with body
      """
      {
        "id": "82728b2b-5827-4b86-81f5-6a6986f9f8ec",
        "actor": "6839da40-3206-431d-9de0-7f2b444dba1d",
        "character": "fa81499d-6827-42ae-8cdd-6e029b57cb7f",
        "scene": "9473a947-647e-4519-8eb5-6c7a2884378e",
        "center": "mental",
        "sceneCircumstances": "Al volver de la lonja, el pescadero no encuentra a su mujer",
        "previousCircumstances": "En la lonja los precios han subido",
        "relationshipCircumstances": []
      }
      """
    Then the response status code should be 201

    Given a DELETE user request to "/api/v1/CharacterBuildings/82728b2b-5827-4b86-81f5-6a6986f9f8ec"

    Then the response status code should be 204
    Then the response body should be empty





