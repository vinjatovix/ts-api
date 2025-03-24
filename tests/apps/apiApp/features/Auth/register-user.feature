Feature: Register a new user
  In order to use the application
  I want to register a new user

  Scenario: Register a valid user
    Given a POST request to "/api/v1/Auth/register" with body
      """
      {
        "username": "register1",
        "email": "register@aa.com",
        "password": "#aD3fe2.0%",
        "repeatPassword": "#aD3fe2.0%"
      }
      """
    Then the response status code should be 201
    Then the response body should be empty

  Scenario: Existing email
    Given a POST request to "/api/v1/Auth/register" with body
      """
      {
        "username": "register",
        "email": "register@aa.com",
        "password": "#aD3fe2.0%",
        "repeatPassword": "#aD3fe2.0%"
      }
      """
    Then the response status code should be 400
    Then the response body should be
      """
      {
        "message": "User <register@aa.com> already exists"
      }
      """

  Scenario: Password and repeat password are different
    Given a POST request to "/api/v1/Auth/register" with body
      """
      {
        "username": "register",
        "email": "register@aa.com",
        "password": "#aD3fe2.0%",
        "repeatPassword": "#aD3fe2.0%1"
      }
      """
    Then the response status code should be 400
    Then the response body should be
      """
      {
        "message": "{ repeatPassword : Passwords do not match at body. }"
      }
      """

  Scenario: Invalid arguments
    Given a POST request to "/api/v1/Auth/register" with body
      """
      {
        "email": "aaJaa",
        "password": "1234",
        "repeatPassword": "1234"
      }
      """
    Then the response status code should be 400
    Then the response body should be
      """
      {
        "message": "{ email : Invalid value at body. Value: aaJaa , username : Invalid value at body. Value: undefined , password : Invalid value at body. , repeatPassword : Invalid value at body. }"
      }
      """
