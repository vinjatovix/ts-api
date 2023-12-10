Feature: Create a new book
  In order to have a book to read
  As a user with admin rights
  I want to create a new book

  # Preconditions for the scenario
  Background:
    Given a PUT request to "/api/v1/Books/9a6e0804-2bd0-4685-b79d-d97027f9073a" with body
      """
      {
        "id": "9a6e0804-2bd0-4685-b79d-d97027f9073a",
        "title": "The Lord of the Rings",
        "author": "J. R. R. Tolkien",
        "isbn": "978-3-16-148410-0",
        "releaseDate": "2023-10-10T23:21:50.508Z",
        "pages": 1178
      }
      """
    Then the response status code should be 201

  Scenario: A valid existing book
    Given a PUT request to "/api/v1/Books/9a6e0804-2bd0-4685-b79d-d97027f9073a/update" with body
      """
      {
        "id": "9a6e0804-2bd0-4685-b79d-d97027f9073a",
        "title": "The Lord of the Rings for babies",
        "author": "J. R. R. Tolkien",
        "isbn": "978-3-16-148410-0",
        "releaseDate": "2023-10-10T23:21:50.508Z",
        "pages": 11
      }
      """
    Then the response status code should be 200
    Then the response body should be empty

    Given a PUT request to "/api/v1/Books/9a6e0804" with body
      """
      {
        "author": 56,
        "isbn": "AAA-3-16-148410-0",
        "releaseDate": "AAAAA",
        "pages": "ad3f3210",
        "extra": "property"
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
            "id": "Invalid value at body. Value: undefined"
          },
          {
            "title": "Invalid value at body. Value: undefined"
          },
          {
            "author": "Invalid value at body. Value: 56"
          },
          {
            "isbn": "Invalid value at body. Value: AAA-3-16-148410-0"
          },
          {
            "releaseDate": "Invalid value at body. Value: AAAAA"
          },
          {
            "pages": "Invalid value at body. Value: ad3f3210"
          },
          {
            "fields": "Unknown field <extra> in <body> with value <property>"
          }
        ]
      }
      """
