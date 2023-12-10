Feature: Get a specific book by id
  In order to get a specific book
  As an user of the API
  I want to get a specific book by id


  # Preconditions for the scenario
  Background:
    Given a POST request to "/api/v1/Books/" with body
      """
      {
        "id": "9a6e0804-2bd0-4672-b79d-d97027f9074e",
        "title": "Book To Read",
        "author": "An awesome writer",
        "isbn": "978-3-16-145410-0",
        "releaseDate": "2023-10-10T23:21:50.508Z",
        "pages": 1178
      }
      """
    Then the response status code should be 201

  Scenario: Get a specific existing book by id
    Given a GET request to "/api/v1/Books/9a6e0804-2bd0-4672-b79d-d97027f9074e"
    Then the response status code should be 200
    Then the response body should contain
      """
      {
        "id": "9a6e0804-2bd0-4672-b79d-d97027f9074e",
        "title": "Book To Read",
        "author": "An awesome writer",
        "isbn": "978-3-16-145410-0",
        "releaseDate": "2023-10-10T23:21:50.508Z",
        "pages": 1178
      }
      """

  # Scenario: Get a specific book by id that does not exist
  #   Given a GET request to "/api/v1/Books/8a6e0804-2bd0-4672-b79d-d97027f9071f"
  #   Then the response status code should be 404
  #   Then the response body should contain
  #     """
  #     {
  #       "message": "Book <8a6e0804-2bd0-4672-b79d-d97027f9071f> not found"
  #     }
  #     """
