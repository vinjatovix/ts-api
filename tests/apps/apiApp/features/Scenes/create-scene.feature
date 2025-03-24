Feature: Create a new scene
  In order to set up a scene
  As an user with admin rights
  I want to create a new scene

  Scenario: A valid scene
    Given an existing "character" with id "075a4142-99c5-47f0-af92-20408cf1152f"
    Given a POST admin request to "/api/v1/Scenes/" with body
      """
      {
        "id": "c62378c3-9f53-4a51-bbb5-d2da30844e7d",
        "description": "Escena 7 Cuadro 3 acto I",
        "characters": [
          "075a4142-99c5-47f0-af92-20408cf1152f"
        ]
      }
      """
    Then the response status code should be 201
    Then the response body should be empty

  Scenario: A non existent character
    Given a POST admin request to "/api/v1/Scenes/" with body
      """
      {
        "id": "c62378c3-9f53-4a51-bbb5-d2da30844e7d",
        "description": "La despedida",
        "characters": [
          "477aecfc-866b-4a4f-ab64-c3df4be15480"
        ]
      }
      """
    Then the response status code should be 404
    Then the response body should be
      """
      {
        "message": "Characters 477aecfc-866b-4a4f-ab64-c3df4be15480 not found."
      }
      """
