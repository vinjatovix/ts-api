Feature: Create a new character
  In order to have a character
  As a user with admin rights
  I want to create a new book

  Scenario: A new character for an existing book
    Given an existing "book" with id "b403ddfa-02d5-41fb-bf69-09086368a56e"
    Given a POST admin request to "/api/v1/Characters/" with body
      """
      {
        "id": "55f42f03-c4b9-4d98-8663-bc1a44b8117c",
        "name": "Stanley",
        "book": "b403ddfa-02d5-41fb-bf69-09086368a56e"
      }
      """
    Then the response status code should be 201
    Then the response body should be empty

  Scenario: A new Character for a non existing book
    Given a POST admin request to "/api/v1/Characters/" with body
      """
      {
        "id": "332fd45c-f542-42dc-8993-70d9aa4ad237",
        "name": "Mitch",
        "book": "b2e5f43b-1a8c-4543-989d-7c9a84e51afd"
      }
      """
    Then the response status code should be 400
    Then the response body should be
      """
      {
        "message": "Book <b2e5f43b-1a8c-4543-989d-7c9a84e51afd> does not exist"
      }
      """

