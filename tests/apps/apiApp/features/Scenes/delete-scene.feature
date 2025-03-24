Feature: Delete a specific scene
  As an admin user
  I want to delete a specific scene by id

  Scenario: Delete a specific existing scene by id
    Given an existing "scene" with id "750dffe0-f5c3-4986-836b-41aa82ce1102"
    Given a DELETE admin request to "/api/v1/Scenes/750dffe0-f5c3-4986-836b-41aa82ce1102"
    Then the response status code should be 204
    Then the response body should be empty

  Scenario: Should not delete a scene with associated character buildings
    Given an existing "actor" with id "06613047-ee76-4606-aa1c-25871f4aa3bf"
    Given an existing "character" with id "f92a6a6c-d0dc-4463-9805-e574bfa50006"
    Given a POST admin request to "/api/v1/Scenes/" with body
      """
      {
        "id": "617b44b4-453e-403b-abf5-89e47319ad43",
        "description": "Escena 7 Cuadro 3 acto I",
        "characters": [
          "f92a6a6c-d0dc-4463-9805-e574bfa50006"
        ]
      }
      """
    Then the response status code should be 201
    Given a POST user request to "/api/v1/CharacterBuildings/" with body
      """
      {
        "id": "96ecb7ca-b974-457a-a9b0-aecbbc7db1f4",
        "actor": "06613047-ee76-4606-aa1c-25871f4aa3bf",
        "character": "f92a6a6c-d0dc-4463-9805-e574bfa50006",
        "scene": "617b44b4-453e-403b-abf5-89e47319ad43",
        "center": "mental",
        "sceneCircumstances": "Delete scene blocker",
        "previousCircumstances": "Doesn't mind",
        "relationshipCircumstances": []
      }
      """
    Then the response status code should be 201

    Given a DELETE admin request to "/api/v1/Scenes/617b44b4-453e-403b-abf5-89e47319ad43"
    Then the response status code should be 409
    Then the response body should be
      """
      {
        "message": "Scene <617b44b4-453e-403b-abf5-89e47319ad43> has associated character buildings"
      }
      """

