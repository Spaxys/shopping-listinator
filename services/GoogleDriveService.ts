import { google } from 'googleapis';
import { GaxiosError } from 'gaxios';

export class GoogleDriveService {
  private drive;

  constructor(accessToken: string) {
    this.drive = google.drive({ 
      version: 'v3', 
      auth: accessToken 
    });
  }

  async createDocument(title: string) {
    try {
      const response = await this.drive.files.create({
        requestBody: {
          name: title,
          mimeType: 'application/vnd.google-apps.document'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating document:', error instanceof GaxiosError ? error.message : error);
      throw error;
    }
  }

  async editDocument(fileId: string) {
    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id, name, webViewLink'
      });
      return response.data;
    } catch (error) {
      console.error('Error accessing document:', error);
      throw error;
    }
  }
}