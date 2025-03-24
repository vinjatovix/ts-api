Feature: Create a new CharacterBuilding
  In order to set up a character building
  As an authenticated user
  I want to create a new character building

  Scenario: A valid simple character building
    Given an existing "actor" with id "7a6002da-eb9c-4e79-8316-ee254c930b24"
    Given an existing "character" with id "9bc48095-2327-4b11-b15d-0b98a47a8ce9"
    Given a POST admin request to "/api/v1/Scenes/" with body
      """
      {
        "id": "0178285d-5f1a-4944-bed2-38016d8dcbc0",
        "description": "Escena 7 Cuadro 3 acto I",
        "characters": [
          "9bc48095-2327-4b11-b15d-0b98a47a8ce9"
        ]
      }
      """
    Then the response status code should be 201

    Given a POST user request to "/api/v1/CharacterBuildings/" with body
      """
      {
        "id": "ff1551a7-6c0a-4b3a-91b7-0f468e964a74",
        "actor": "7a6002da-eb9c-4e79-8316-ee254c930b24",
        "character": "9bc48095-2327-4b11-b15d-0b98a47a8ce9",
        "scene": "0178285d-5f1a-4944-bed2-38016d8dcbc0",
        "center": "mental",
        "sceneCircumstances": "Llueve dentro de la iglesia",
        "previousCircumstances": "El gigante robot alienigena atravesó el techo",
        "relationshipCircumstances": []
      }
      """

    Then the response status code should be 201
    Then the response body should be empty

  Scenario: A character building with relationship circumstances
    Given an existing "actor" with id "b0d765b4-f540-495e-a060-909d42af3944"
    Given an existing "character" with id "05eb76c5-3b89-457b-9b39-a80dc30424a7"
    Given an existing "character" with id "a13985dc-5e39-4b99-95f8-1c05545b6d18"
    Given a POST admin request to "/api/v1/Scenes/" with body
      """
      {
        "id": "cc0d3831-2daf-4ee0-aba6-d086c2b11bc2",
        "description": "La despedida",
        "characters": [
          "05eb76c5-3b89-457b-9b39-a80dc30424a7",
          "a13985dc-5e39-4b99-95f8-1c05545b6d18"
        ]
      }
      """
    Then the response status code should be 201

    Given a POST user request to "/api/v1/CharacterBuildings/" with body
      """
      {
        "id": "d7cc43bb-935c-48b2-986f-9ff2a4cfbc62",
        "actor": "b0d765b4-f540-495e-a060-909d42af3944",
        "character": "05eb76c5-3b89-457b-9b39-a80dc30424a7",
        "scene": "cc0d3831-2daf-4ee0-aba6-d086c2b11bc2",
        "center": "instinctive",
        "sceneCircumstances": "Felipe está en el sanatorio, es el momento de despedirse.",
        "previousCircumstances": "Fran ha discutido con lorena y acaba de llegar corriendo",
        "relationshipCircumstances": [
          {
            "character": "a13985dc-5e39-4b99-95f8-1c05545b6d18",
            "circumstance": "Son familia lejana, llevan sin verse unos 20 años."
          }
        ]
      }
      """
    Then the response status code should be 201
    Then the response body should be empty

  Scenario: Inexistent Actor
    Given an existing "character" with id "76b3f121-fb6b-4f89-b4b1-e5bddad60407"
    Given a POST admin request to "/api/v1/Scenes/" with body
      """
      {
        "id": "b6a34d93-a0c1-4de6-9787-7d6905f06fad",
        "description": "fsdag",
        "characters": [
          "76b3f121-fb6b-4f89-b4b1-e5bddad60407"
        ]
      }
      """
    Then the response status code should be 201

    Given a POST user request to "/api/v1/CharacterBuildings/" with body
      """
      {
        "id": "92810515-c306-4be3-8f40-a152b18c4cec",
        "actor": "a2390fb5-f550-4857-887f-faebf001eac1",
        "character": "76b3f121-fb6b-4f89-b4b1-e5bddad60407",
        "scene": "0178285d-5f1a-4944-bed2-38016d8dcbc0",
        "center": "emotional",
        "sceneCircumstances": "fsdhfdshgds",
        "previousCircumstances": "pfnsalnflas",
        "relationshipCircumstances": []
      }
      """
    Then the response status code should be 404
    Then the response body should be
      """
      {
        "message": "Actor <a2390fb5-f550-4857-887f-faebf001eac1> not found."
      }
      """

  Scenario: Inexistent Scene
    Given an existing "actor" with id "78dd0647-1e20-46c4-9846-0b3377e4d5b0"
    Given a POST user request to "/api/v1/CharacterBuildings/" with body
      """
      {
        "id": "92810515-c306-4be3-8f40-a152b18c4cec",
        "actor": "78dd0647-1e20-46c4-9846-0b3377e4d5b0",
        "character": "76b3f121-fb6b-4f89-b4b1-e5bddad60407",
        "scene": "2055786f-a5e6-474a-81f6-86f94c2bdf12",
        "center": "emotional",
        "sceneCircumstances": "fsdhfdshgds",
        "previousCircumstances": "pfnsalnflas",
        "relationshipCircumstances": []
      }
      """
    Then the response status code should be 404
    Then the response body should be
      """
      {
        "message": "Scene <2055786f-a5e6-474a-81f6-86f94c2bdf12> not found."
      }
      """

  Scenario: Character not in scene
    Given an existing "actor" with id "37e019b4-8859-469b-8c16-43b4a47ce25a"
    Given an existing "scene" with id "38ca99a0-e20e-4c01-81e8-05b39a3fa5c9"
    Given a POST user request to "/api/v1/CharacterBuildings/" with body
      """
      {
        "id": "7b627098-7e4e-4f3d-9d75-0eb13d3cffdf",
        "actor": "37e019b4-8859-469b-8c16-43b4a47ce25a",
        "character": "01d7f00e-5a06-4085-b255-7ca84364ef79",
        "scene": "38ca99a0-e20e-4c01-81e8-05b39a3fa5c9",
        "center": "emotional",
        "sceneCircumstances": "fsdhfdshgds",
        "previousCircumstances": "pfnsalnflas",
        "relationshipCircumstances": []
      }
      """
    Then the response status code should be 409
    Then the response body should be
      """
      {
        "message": "Character(s) <01d7f00e-5a06-4085-b255-7ca84364ef79> not found in Scene <38ca99a0-e20e-4c01-81e8-05b39a3fa5c9>"
      }
      """

  Scenario: Related character also not in scene
    Given an existing "actor" with id "b8130f9e-536c-4919-8955-91e97bb7676f"
    Given an existing "scene" with id "8df3d866-840f-44c8-b7ba-715a32d86c7a"
    Given a POST user request to "/api/v1/CharacterBuildings/" with body
      """
      {
        "id": "7b627098-7e4e-4f3d-9d75-0eb13d3cffdf",
        "actor": "b8130f9e-536c-4919-8955-91e97bb7676f",
        "character": "01d7f00e-5a06-4085-b255-7ca84364ef79",
        "scene": "8df3d866-840f-44c8-b7ba-715a32d86c7a",
        "center": "emotional",
        "sceneCircumstances": "fsdhfdshgds",
        "previousCircumstances": "pfnsalnflas",
        "relationshipCircumstances": [
          {
            "character": "95743f15-9f54-494b-a81c-b3044996df24",
            "circumstance": "jdspadjsa"
          }
        ]
      }
      """
    Then the response status code should be 409
    Then the response body should be
      """
      {
        "message": "Character(s) <01d7f00e-5a06-4085-b255-7ca84364ef79>, <95743f15-9f54-494b-a81c-b3044996df24> not found in Scene <8df3d866-840f-44c8-b7ba-715a32d86c7a>"
      }
      """

  Scenario: CharacterBuilding already exists
    Given an existing "actor" with id "42d71c36-a17f-478e-a167-f8e8dfb04f5b"
    Given an existing "character" with id "29b6587c-36df-4249-9512-e406ebc2f4b2"
    Given a POST admin request to "/api/v1/Scenes/" with body
      """
      {
        "id": "bd7ba228-81d1-499e-a38c-17ea1c66d6eb",
        "description": "Escena 7 Cuadro 3 acto I",
        "characters": [
          "29b6587c-36df-4249-9512-e406ebc2f4b2"
        ]
      }
      """
    Then the response status code should be 201

    Given a POST user request to "/api/v1/CharacterBuildings/" with body
      """
      {
        "id": "0eb13743-661b-41a6-acd9-353f44c77cce",
        "actor": "42d71c36-a17f-478e-a167-f8e8dfb04f5b",
        "character": "29b6587c-36df-4249-9512-e406ebc2f4b2",
        "scene": "bd7ba228-81d1-499e-a38c-17ea1c66d6eb",
        "center": "mental",
        "sceneCircumstances": "Llueve dentro de la iglesia",
        "previousCircumstances": "El gigante robot alienigena atravesó el techo",
        "relationshipCircumstances": []
      }
      """

    Then the response status code should be 201
    Then the response body should be empty

    Given a POST user request to "/api/v1/CharacterBuildings/" with body
      """
      {
        "id": "0eb13743-661b-41a6-acd9-353f44c77cce",
        "actor": "42d71c36-a17f-478e-a167-f8e8dfb04f5b",
        "character": "29b6587c-36df-4249-9512-e406ebc2f4b2",
        "scene": "bd7ba228-81d1-499e-a38c-17ea1c66d6eb",
        "center": "mental",
        "sceneCircumstances": "SECOND",
        "previousCircumstances": "El gigante robot alienigena atravesó el techo",
        "relationshipCircumstances": []
      }
      """

    Then the response status code should be 409
    Then the response body should be
      """
      {
        "message": "CharacterBuilding: <0eb13743-661b-41a6-acd9-353f44c77cce> already exists."
      }
      """
