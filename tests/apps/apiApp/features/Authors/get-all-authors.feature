Feature: Get all authors in the collection
  In order to see all authors in the collection
  As an authenticated user

  Background:
    Given an existing "author" with id "9bbe1e72-de33-4ebb-95ce-069665d2751d"
    Given an existing "author" with id "a30fc596-37a0-4e8e-a04e-9379cc7d3a04"

  Scenario: Get all authors in the collection
    Given an authenticated GET request to "/api/v1/Authors"
    Then the response status code should be 200
    Then the response body will be an array containing
      """
      {
      "id": "9bbe1e72-de33-4ebb-95ce-069665d2751d"
      }
      """
    Then the response body will be an array containing
      """
      {
        "id": "a30fc596-37a0-4e8e-a04e-9379cc7d3a04"
      }
      """
