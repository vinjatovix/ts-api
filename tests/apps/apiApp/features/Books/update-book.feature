Feature: Update an existing book
  As a user with admin rights
  I want to update an existing book

  Scenario: A valid existing book
    Given an existing "book" with id "9a6e0804-2bd0-4685-b79d-d97027f9073a"
    Given an existing "author" with id "345f46b4-8035-44a2-937b-3a133072c8f4"

    Given a PATCH admin request to "/api/v1/Books/9a6e0804-2bd0-4685-b79d-d97027f9073a" with body
      """
      {
        "author": "345f46b4-8035-44a2-937b-3a133072c8f4"
      }
      """
    Then the response status code should be 200
    Then the response body should be empty

    Given a PATCH admin request to "/api/v1/Books/9a6e0804-2bd0-4685-b79d-d97027f9073a" with body
      """
      {}
      """
    Then the response status code should be 400
    Then the response body should be
      """
      {
        "message": "Empty body is not allowed"
      }
      """


  Scenario: An unprocessable book
    Given a PATCH admin request to "/api/v1/Books/9a6e0804" with body
      """
      {
        "author": 56,
        "isbn": "AAA-3-16-148410-0",
        "releaseDate": "AAAAA",
        "pages": "ad3f3210",
        "extra": "property"
      }
      """
    Then the response status code should be 400
    Then the response body should be
      """
      {
        "message": "{ id : Invalid value at params. Value: 9a6e0804 , author : Invalid value at body. Value: 56 , isbn : Invalid value at body. Value: AAA-3-16-148410-0 , releaseDate : Invalid value at body. Value: AAAAA , pages : Invalid value at body. Value: ad3f3210 , fields : Unknown field <extra> in <body> with value <property> }"
      }
      """

  Scenario: A non-existing book
    Given a PATCH admin request to "/api/v1/Books/9a6e0804-2bd0-4675-b79d-d97027f9073b" with body
      """
      {
        "pages": 666
      }
      """
    Then the response status code should be 404
    Then the response body should be
      """
      {
        "message": "Book <9a6e0804-2bd0-4675-b79d-d97027f9073b> not found"
      }
      """
