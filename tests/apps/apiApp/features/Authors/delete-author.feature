Feature: Delete a specific author
  In order to delete a specific author
  As a user with admin rights

  Scenario: Delete a specific author
    Given an existing "author" with id "bf4804d7-f73b-4414-9bad-206ba0290d0c"
    Given a DELETE admin request to "/api/v1/authors/bf4804d7-f73b-4414-9bad-206ba0290d0c"
    Then the response status code should be 204
    Then the response body should be empty


