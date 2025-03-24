Feature: Update an existing character
  As an user with admin rights
  I want to update an existing character

  Scenario: A valid existing character
    Given an existing "character" with id "5f925bef-7517-47e0-b3db-a86f23996553"
    Given an existing "book" with id "f77de1d8-59f9-433c-be6c-12ac1ef30f8b"

    Given a PATCH admin request to "/api/v1/Characters/5f925bef-7517-47e0-b3db-a86f23996553" with body
      """
      {
        "name": "Federico",
        "book": "f77de1d8-59f9-433c-be6c-12ac1ef30f8b"
      }
      """
    Then the response status code should be 200
    Then the response body should be empty

  Scenario: An update that makes no changes
    Given a PATCH admin request to "/api/v1/Characters/5f925bef-7517-47e0-b3db-a86f23996553" with body
      """
      {
        "name": "Federico",
        "book": "f77de1d8-59f9-433c-be6c-12ac1ef30f8b"
      }
      """
    Then the response status code should be 400
    Then the response body should be
      """
      {
        "message": "Nothing to update"
      }
      """



  Scenario: A non existing character
    Given a PATCH admin request to "/api/v1/Characters/76c73654-47f3-487c-b46a-d82ab5d014d2" with body
      """
      {
        "book": "f77de1d8-59f9-433c-be6c-12ac1ef30f8b"
      }
      """

    Then the response status code should be 404
    Then the response body should be
      """
      {
        "message": "Character <76c73654-47f3-487c-b46a-d82ab5d014d2> not found."
      }
      """

  Scenario: An unprocessable character
    Given a PATCH admin request to "/api/v1/Characters/5f925bef-7517-47e0-b3db-a86f23996553" with body
      """
      {
        "book": "6b2a6da5-2281-4eec-b081-6c6f35cda79e"
      }
      """
    Then the response status code should be 404
    Then the response body should be
      """
      {
        "message": "Book <6b2a6da5-2281-4eec-b081-6c6f35cda79e> not found."
      }
      """

    Given a PATCH admin request to "/api/v1/Characters/9a6e0804" with body
      """
      {
        "name": 56,
        "book": "aconcagua"
      }
      """
    Then the response status code should be 400
    Then the response body should be
      """
      {
        "message": "{ id : Invalid value at params. Value: 9a6e0804 , name : Invalid value at body. Value: 56 , book : Invalid value at body. Value: aconcagua }"
      }
      """

  Scenario: An empty update
    Given a PATCH admin request to "/api/v1/Characters/9a6e0804" with body
      """
      {}
      """
    Then the response status code should be 400
    Then the response body should be
      """
      {
        "message": "Empty body is not allowed"
      }
      """


