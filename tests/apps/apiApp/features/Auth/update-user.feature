Feature: Update Password
  In order to use the application
  As a user
  I want to be able to update my password

  Background:
  Scenario: Register with valid credentials
    Given a POST request to "/api/v1/Auth/register" with body
      """
      {
        "id": "5242b159-af34-459b-b371-ce2b647c56a1",
        "username": "updateUser",
        "email": "update@password.com",
        "password": "#aD3fe2.0%",
        "repeatPassword": "#aD3fe2.0%"
      }
      """
    Then the response status code should be 201
    Then the response body should be empty

  Scenario: Login with valid credentials
    Given an authentication with body
      """
      {
        "email": "update@password.com",
        "password": "#aD3fe2.0%"
      }
      """
    Given a POST user request to "/api/v1/Auth/update" with body
      """
      {
        "oldPassword": "#aD3fe2.0%",
        "password": "Sup3rSecretPassword!",
        "repeatPassword": "Sup3rSecretPassword!"
      }
      """
    Then the response status code should be 200
    Then the response body should be
      """
      {
        "message": "User updated successfully"
      }
      """

