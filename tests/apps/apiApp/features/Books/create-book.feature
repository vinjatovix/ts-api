Feature: Create a new book
  In order to have a book to read
  As a user with admin rights
  I want to create a new book

  Scenario: A valid non existing book
    Given a PUT request to "/api/v1/Books/8a6e0804-2bd0-4672-b79d-d97027f9071a" with body
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
    Then the response body should be empty

  Scenario: An ivalid non existing book
    Given a PUT request to "/api/v1/Books/9a6e0804" with body
      """
      {
        "author": 56,
        "isbn": "978-3-16-148410-0",
        "releaseDate": "2023-10-10T23:21:50.508Z",
        "pages": "ad3f3210"
      }
      """
    Then the response status code should be 422
    Then the response body should be
      """
      {
        "errors": [
          {
            "id": "Invalid value at params. Value: 9a6e0804"
          },
          {
            "title": "Invalid value at body. Value: undefined"
          },
          {
            "author": "Invalid value at body. Value: 56"
          },
          {
            "pages": "Invalid value at body. Value: ad3f3210"
          }
        ]
      }
      """

  Scenario: An invalid ISBN
    Given a PUT request to "/api/v1/Books/8a6e0804-2bd0-4672-b79d-d97027f9071a" with body
      """
      {
        "title": "The Lord of the Rings",
        "author": "J. R. R. Tolkien",
        "isbn": "AAA-3-16-148410-0",
        "releaseDate": "2023-10-10T23:21:50.508Z",
        "pages": 1178
      }
      """
    Then the response status code should be 422
    Then the response body should be
      """
      {
        "errors": [
          {
            "isbn": "Invalid value at body. Value: AAA-3-16-148410-0"
          }
        ]
      }
      """
