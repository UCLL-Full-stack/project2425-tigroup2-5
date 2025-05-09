import { secureFetch } from '../middleware/ssrf.middleware';

/**
 * Example service that demonstrates how to use the secureFetch utility
 * for making HTTP requests protected against SSRF attacks
 */
class ExternalApiService {
  private secureClient = secureFetch();
  
  /**
   * Fetches data from an external API with SSRF protection
   * @param apiUrl The URL to fetch data from
   * @returns The fetched data
   */
  async fetchExternalData(apiUrl: string) {
    try {
      // Uses secureFetch which validates the URL before making the request
      const response = await this.secureClient.fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`External API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching external data:', error);
      // If the error came from SSRF validation, it will have a specific message
      if (error instanceof Error && error.message.includes('SSRF validation failed')) {
        throw new Error('Security validation failed for the requested URL');
      }
      throw error;
    }
  }
  
  /**
   * Posts data to an external API with SSRF protection
   * @param apiUrl The URL to post data to
   * @param payload The data to post
   * @returns The response from the API
   */
  async postToExternalApi(apiUrl: string, payload: any) {
    try {
      // Uses secureFetch which validates the URL before making the request
      const response = await this.secureClient.fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`External API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error posting to external API:', error);
      // If the error came from SSRF validation, it will have a specific message
      if (error instanceof Error && error.message.includes('SSRF validation failed')) {
        throw new Error('Security validation failed for the requested URL');
      }
      throw error;
    }
  }
}

export default new ExternalApiService();