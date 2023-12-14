Feature: Login
  In order to use the application
  As a user
  I want to be able to login

  Background:
  Scenario: Register with valid credentials
    Given a POST request to "/api/v1/Auth/register" with body
      """
      {
        "username": "login1",
        "email": "login@aa.com",
        "password": "#aD3fe2.0%",
        "repeatPassword": "#aD3fe2.0%"
      }
      """
    Then the response status code should be 201
    Then the response body should be empty


  Scenario: Login with valid credentials
    Given a POST request to "/api/v1/Auth/login" with body
      """
      {
        "email": "login@aa.com",
        "password": "#aD3fe2.0%"
      }
      """
    Then the response status code should be 200
    Then the response body should include an auth token

  Scenario: Fail with invalid credentials
    Given a POST request to "/api/v1/Auth/login" with body
      """
      {
        "email": "login@aa.com",
        "password": "#aDXXXXXXX3fe2.0%"
      }
      """
    Then the response status code should be 401
    Then the response body should be
      """
      {
        "message": "Invalid credentials"
      }
      """
