Feature: Update an existing author
  As a user with admin rights
  I want to update an existing author

  Scenario: A valid existing author
    Given an existing "author" with id "83231f74-6212-495f-b2ba-cd152a1aed5c"


    Given a PATCH admin request to "/api/v1/Authors/83231f74-6212-495f-b2ba-cd152a1aed5c" with body
      """
      {
      "name": "New Name"
      }
      """
    Then the response status code should be 200
    Then the response body should be empty

    Given a PATCH admin request to "/api/v1/Authors/83231f74-6212-495f-b2ba-cd152a1aed5c" with body
      """
      {}
      """
    Then the response status code should be 400
    Then the response body should be
      """
      {
        "errors": [
          {
            "message": "Empty body is not allowed"
          }
        ]
      }
      """


