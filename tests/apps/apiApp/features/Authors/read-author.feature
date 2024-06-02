Feature: Get a specific author by id
  In order to get a specific author
  As an user of the API
  I want to get a specific author by id

  Background:
    Given an existing "author" with id "0a7b133b-94f2-40c6-9a08-7d79d680b82c"

  Scenario: Get a specific existing author by id
    Given an authenticated GET request to "/api/v1/Authors/0a7b133b-94f2-40c6-9a08-7d79d680b82c"
    Then the response status code should be 200
    Then the response body should contain
      """
      {
        "id": "0a7b133b-94f2-40c6-9a08-7d79d680b82c"
      }
      """
    Then the response body should have the properties:
      | id   |
      | name |



