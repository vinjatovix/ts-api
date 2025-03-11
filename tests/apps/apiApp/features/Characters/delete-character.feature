Feature: Delete a specefic character
  As an user of the API
  I want to delete a specific character by id

  Scenario: Delete a specific existing character by id
    Given an existing "character" with id "cb4f3826-6326-43fd-856c-e285894cfa77"
    Given a DELETE admin request to "/api/v1/Characters/cb4f3826-6326-43fd-856c-e285894cfa77"
    Then the response status code should be 204
    Then the response body should be empty
