Feature: Get a specific book by id
  In order to get a specific book
  As an user of the API
  I want to get a specific book by id


    # Preconditions for the scenario
    Background:
      Given a PUT request to "/api/v1/Books/9a6e0804-2bd0-4672-b79d-d97027f9071a" with body
      """
      {
        "title": "The Lord of the Rings",
        "author": "J. R. R. Tolkien",
        "isbn": "978-3-16-148410-0",
        "releaseDate": "2023-10-10T23:21:50.508Z",
        "pages": 1178
      }
      """
      Then the response status code should be 201

  Scenario: Get a specific existing book by id
      Given a GET request to "/api/v1/Books/9a6e0804-2bd0-4672-b79d-d97027f9071a"
      Then the response status code should be 200
      Then the response body should contain
      """
      {
        "id": "9a6e0804-2bd0-4672-b79d-d97027f9071a",
        "title": "The Lord of the Rings",
        "author": "J. R. R. Tolkien",
        "isbn": "978-3-16-148410-0",
        "releaseDate": "2023-10-10T23:21:50.508Z",
        "pages": 1178
      }
      """

  Scenario: Get a specific book by id that does not exist
    Given a GET request to "/api/v1/Books/8a6e0804-2bd0-4672-b79d-d97027f9071b"
    Then the response status code should be 404
    Then the response body should contain
      """
      {
        "message": "Book <8a6e0804-2bd0-4672-b79d-d97027f9071b> not found"
      }
      """
