import { google } from 'googleapis';

export class GoogleDocsService {
  private docs;

  constructor(accessToken: string) {
    this.docs = google.docs({ 
      version: 'v1', 
      auth: accessToken 
    });
  }

  async createDocument(title: string) {
    try {
      const response = await this.docs.documents.create({
        requestBody: {
          title,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  async getDocument(documentId: string) {
    try {
      const response = await this.docs.documents.get({
        documentId,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching document:', error);
      throw error;
    }
  }
}