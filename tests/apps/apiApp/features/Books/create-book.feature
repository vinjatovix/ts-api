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
      "releaseDate": "1954-07-29",
      "pages": 1178
    }
    """
    Then the response status code should be 201
    Then the response body should be empty
