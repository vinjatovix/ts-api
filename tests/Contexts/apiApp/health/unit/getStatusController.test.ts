import { Request, Response } from 'express';
import { GetStatusController } from '../../../../../src/apps/apiApp/controllers/health/GetStatusController';

describe('GetStatusController', () => {
  let controller: GetStatusController;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    controller = new GetStatusController();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('should send a status of 200 with the message "OK"', async () => {
    await controller.run({} as Request, mockResponse as Response);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ version: expect.any(String), status: 'OK' })
    );
  });
});
