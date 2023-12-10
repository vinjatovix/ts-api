Feature: Get all books in the collection
  In order to see all books in the collection
  As a user

  #preconditions for the scenario
  Background:
    Given a POST request to "/api/v1/Books/" with body
      """
      {
        "id": "9a6e0804-2bd0-4672-a79d-d97027f9071c",
        "title": "The Lord of the Rings",
        "author": "J. R. R. Tolkien",
        "isbn": "978-3-16-148410-0",
        "releaseDate": "2023-10-10T23:21:50.508Z",
        "pages": 1178
      }
      """
    Then the response status code should be 201

    Given a POST request to "/api/v1/Books/" with body
      """
      {
        "id": "9a6e0804-2bd0-4672-b79d-b97027f9071d",
        "title": "The Lord of the Rings 2",
        "author": "J. R. R. Tolkien",
        "isbn": "978-3-16-148412-0",
        "releaseDate": "2023-10-10T23:21:50.508Z",
        "pages": 1178
      }
      """
    Then the response status code should be 201

  Scenario: Get all books in the collection
    Given a GET request to "/api/v1/Books"
    Then the response status code should be 200
    Then the response body will be an array containing
      """
      {
        "id": "9a6e0804-2bd0-4672-a79d-d97027f9071c",
        "title": "The Lord of the Rings",
        "author": "J. R. R. Tolkien",
        "isbn": "978-3-16-148410-0",
        "releaseDate": "2023-10-10T23:21:50.508Z",
        "pages": 1178
      }
      """
    Then the response body will be an array containing
      """
      {
        "id": "9a6e0804-2bd0-4672-b79d-b97027f9071d",
        "title": "The Lord of the Rings 2",
        "author": "J. R. R. Tolkien",
        "isbn": "978-3-16-148412-0",
        "releaseDate": "2023-10-10T23:21:50.508Z",
        "pages": 1178
      }
      """
