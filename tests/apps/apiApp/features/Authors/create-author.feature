Feature: Create a new Author
  In order to have an author for add books
  As a user with admin rights

  Scenario: A valid non existing author is created
    Given a POST admin request to "/api/v1/Authors" with body
      """
      {
      "id": "42e2b7be-87ac-4de3-993d-348458152537",
      "name": "Author Name"
      }
      """
    Then the response status code should be 201
    Then the response body should be empty
