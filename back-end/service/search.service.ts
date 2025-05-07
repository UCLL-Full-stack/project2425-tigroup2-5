import { Member } from '../model/member';
import { Club } from '../model/club';
import { Employee } from '../model/employee';
import memberDb from '../repository/member.db';
import clubDb from '../repository/club.db';
import employeeDb from '../repository/employee.db';
import { solrConfig } from '../util/solr-config';

// Define collection types for type safety
type CollectionType = 'members' | 'clubs' | 'employees';

// Define search parameter interfaces
interface SolrSearchParams {
  q?: string;
  fq?: string;
  start?: number;
  rows?: number;
  fl?: string;
  sort?: string;
  [key: string]: any; // Allow additional properties
}

interface SearchFilters {
  type?: string;
  offset?: number;
  limit?: number;
  sort?: string;
  [key: string]: any; // Allow additional filter properties
}

// Simulated in-memory storage for indexed documents with proper typing
const inMemoryIndex: Record<CollectionType, Map<string, any>> = {
  members: new Map<string, any>(),
  clubs: new Map<string, any>(),
  employees: new Map<string, any>()
};

/**
 * Simulated Solr client implementation for assignment purposes
 * This implementation doesn't require a running Solr instance
 */
class SimulatedSolrClient {
  private baseUrl: string;

  constructor() {
    // This URL would be used in a real implementation
    this.baseUrl = `${solrConfig.protocol}://${solrConfig.host}:${solrConfig.port}${solrConfig.path}/${solrConfig.core}`;
    console.log(`[SIMULATED SOLR] Configured with URL: ${this.baseUrl}`);
  }

  // Add a document to simulated index
  async addDocument(doc: any): Promise<void> {
    try {
      // Determine the collection based on the document type
      const collection = this.getCollectionForDocument(doc);
      
      if (collection) {
        inMemoryIndex[collection].set(doc.id, doc);
        console.log(`[SIMULATED SOLR] Added document to ${collection}: ${doc.id}`);
      }
    } catch (error) {
      console.error('[SIMULATED SOLR] Error adding document:', error);
      throw new Error('Failed to add document to simulated Solr index');
    }
  }

  // Add multiple documents
  async addDocuments(docs: any[]): Promise<void> {
    try {
      for (const doc of docs) {
        await this.addDocument(doc);
      }
      console.log(`[SIMULATED SOLR] Added ${docs.length} documents`);
    } catch (error) {
      console.error('[SIMULATED SOLR] Error adding documents:', error);
      throw new Error('Failed to add documents to simulated Solr index');
    }
  }

  // Delete a document by ID
  async deleteDocument(id: string): Promise<void> {
    try {
      // Extract the type from the ID (e.g., member_1 -> member)
      const type = id.split('_')[0];
      
      if (type === 'member') {
        inMemoryIndex.members.delete(id);
      } else if (type === 'club') {
        inMemoryIndex.clubs.delete(id);
      } else if (type === 'employee') {
        inMemoryIndex.employees.delete(id);
      }
      
      console.log(`[SIMULATED SOLR] Deleted document: ${id}`);
    } catch (error) {
      console.error('[SIMULATED SOLR] Error deleting document:', error);
      throw new Error('Failed to delete document from simulated Solr index');
    }
  }

  // Perform a simulated search query with proper typing
  async search(params: SolrSearchParams): Promise<any> {
    try {
      console.log(`[SIMULATED SOLR] Searching with params:`, params);
      
      const query = params.q?.toLowerCase() || '*';
      const type = params.fq?.split(':')[1] || null;
      const start = params.start || 0;
      const rows = params.rows || 10;
      
      // Get the target collections based on the type filter
      const collections = this.getSearchCollections(type);
      
      // Perform the search across specified collections
      const results = [];
      
      for (const collection of collections) {
        for (const doc of inMemoryIndex[collection].values()) {
          // Skip if we're doing a targeted search and the document doesn't contain the query
          if (query !== '*' && !this.documentMatchesQuery(doc, query)) {
            continue;
          }
          
          results.push(doc);
        }
      }
      
      // Apply pagination
      const paginatedResults = results.slice(start, start + rows);
      
      // Return in a format similar to Solr's response
      return {
        responseHeader: {
          status: 0,
          QTime: 5,
          params: params
        },
        response: {
          numFound: results.length,
          start: start,
          docs: paginatedResults
        }
      };
    } catch (error) {
      console.error('[SIMULATED SOLR] Error searching:', error);
      throw new Error('Search failed in simulated Solr index');
    }
  }

  // Clear all documents from the simulated index
  async clearIndex(): Promise<void> {
    try {
      inMemoryIndex.members.clear();
      inMemoryIndex.clubs.clear();
      inMemoryIndex.employees.clear();
      console.log('[SIMULATED SOLR] Cleared all data from index');
    } catch (error) {
      console.error('[SIMULATED SOLR] Error clearing index:', error);
      throw new Error('Failed to clear simulated Solr index');
    }
  }
  
  // Helper function to determine which collection a document belongs to
  private getCollectionForDocument(doc: any): CollectionType | null {
    if (doc.type === 'member') return 'members';
    if (doc.type === 'club') return 'clubs';
    if (doc.type === 'employee') return 'employees';
    return null;
  }
  
  // Helper function to get the collections to search based on type filter
  private getSearchCollections(type: string | null): CollectionType[] {
    if (type === 'member') return ['members'];
    if (type === 'club') return ['clubs'];
    if (type === 'employee') return ['employees'];
    return ['members', 'clubs', 'employees']; // Search all if no type specified
  }
  
  // Helper function to check if a document matches a query
  private documentMatchesQuery(doc: any, query: string): boolean {
    // Simple implementation that checks if any string field contains the query
    for (const [key, value] of Object.entries(doc)) {
      if (typeof value === 'string' && value.toLowerCase().includes(query)) {
        return true;
      }
      
      // Also check nested objects like fullname
      if (typeof value === 'object' && value !== null) {
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          if (typeof nestedValue === 'string' && nestedValue.toLowerCase().includes(query)) {
            return true;
          }
        }
      }
    }
    return false;
  }
}

// Create an instance of the simulated Solr client
const solrClient = new SimulatedSolrClient();

// Convert Member to Solr document
const memberToSolrDoc = (member: Member) => {
  if (!member.person) {
    throw new Error('Member has no associated person');
  }

  return {
    id: `member_${member.id}`,
    type: 'member',
    member_id: member.id,
    username: member.username,
    email: member.person.email,
    firstname: member.person.firstname,
    lastname: member.person.surname,
    fullname: `${member.person.firstname} ${member.person.surname}`,
    phone: member.person.phone,
    birthdate: member.person.birthDate ? new Date(member.person.birthDate).toISOString() : null
  };
};

// Convert Club to Solr document
const clubToSolrDoc = (club: Club) => {
  if (!club.region) {
    throw new Error('Club has no associated region');
  }

  return {
    id: `club_${club.id}`,
    type: 'club',
    club_id: club.id,
    address: club.address,
    region_id: club.region.id,
    region_name: club.region.name
  };
};

// Convert Employee to Solr document
const employeeToSolrDoc = (employee: Employee) => {
  if (!employee.person) {
    throw new Error('Employee has no associated person');
  }

  return {
    id: `employee_${employee.id}`,
    type: 'employee',
    employee_id: employee.id,
    title: employee.title,
    is_admin: employee.admin,
    email: employee.person.email,
    firstname: employee.person.firstname,
    lastname: employee.person.surname,
    fullname: `${employee.person.firstname} ${employee.person.surname}`,
    phone: employee.person.phone
  };
};

// Index all members
const indexAllMembers = async (): Promise<void> => {
  try {
    console.log('[SIMULATED SOLR] Starting member indexing');
    const members = await memberDb.getAllMembers();
    const memberDocs = members.map(memberToSolrDoc);
    
    if (memberDocs.length > 0) {
      await solrClient.addDocuments(memberDocs);
      console.log(`[SIMULATED SOLR] Indexed ${memberDocs.length} members`);
    }
  } catch (error) {
    console.error('Error indexing members:', error);
    throw error;
  }
};

// Index all clubs
const indexAllClubs = async (): Promise<void> => {
  try {
    console.log('[SIMULATED SOLR] Starting club indexing');
    const clubs = await clubDb.getAllClubs();
    const clubDocs = clubs.map(clubToSolrDoc);
    
    if (clubDocs.length > 0) {
      await solrClient.addDocuments(clubDocs);
      console.log(`[SIMULATED SOLR] Indexed ${clubDocs.length} clubs`);
    }
  } catch (error) {
    console.error('Error indexing clubs:', error);
    throw error;
  }
};

// Index all employees
const indexAllEmployees = async (): Promise<void> => {
  try {
    console.log('[SIMULATED SOLR] Starting employee indexing');
    const employees = await employeeDb.getAllEmployees();
    const employeeDocs = employees.map(employeeToSolrDoc);
    
    if (employeeDocs.length > 0) {
      await solrClient.addDocuments(employeeDocs);
      console.log(`[SIMULATED SOLR] Indexed ${employeeDocs.length} employees`);
    }
  } catch (error) {
    console.error('Error indexing employees:', error);
    throw error;
  }
};

// Full reindexing of all entities
const reindexAll = async (): Promise<void> => {
  try {
    console.log('[SIMULATED SOLR] Starting full reindex');
    await solrClient.clearIndex();
    await Promise.all([
      indexAllMembers(),
      indexAllClubs(),
      indexAllEmployees()
    ]);
    console.log('[SIMULATED SOLR] Full reindexing completed successfully');
  } catch (error) {
    console.error('Error during full reindexing:', error);
    throw error;
  }
};

// Search across all entities with proper typing
const search = async (query: string, filters: SearchFilters = {}): Promise<any> => {
  try {
    console.log(`[SIMULATED SOLR] Searching for: "${query}" with filters:`, filters);
    
    const searchParams: SolrSearchParams = {
      q: query || '*:*',
      fq: filters.type ? `type:${filters.type}` : undefined,
      start: filters.offset || 0,
      rows: filters.limit || 10,
      fl: '*,score',
      sort: filters.sort || 'score desc'
    };

    const result = await solrClient.search(searchParams);
    
    return {
      total: result.response.numFound,
      results: result.response.docs,
      facets: {}  // Simulated implementation doesn't support facets
    };
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

// Individual entity searches with proper typing
const searchMembers = async (query: string, options: SearchFilters = {}): Promise<any> => {
  const filters = { ...options, type: 'member' };
  return search(query, filters);
};

const searchClubs = async (query: string, options: SearchFilters = {}): Promise<any> => {
  const filters = { ...options, type: 'club' };
  return search(query, filters);
};

const searchEmployees = async (query: string, options: SearchFilters = {}): Promise<any> => {
  const filters = { ...options, type: 'employee' };
  return search(query, filters);
};

export default {
  indexAllMembers,
  indexAllClubs,
  indexAllEmployees,
  reindexAll,
  search,
  searchMembers,
  searchClubs,
  searchEmployees,
  // Export individual document operations for use in CRUD operations
  addDocument: solrClient.addDocument.bind(solrClient),
  deleteDocument: solrClient.deleteDocument.bind(solrClient),
  memberToSolrDoc,
  clubToSolrDoc,
  employeeToSolrDoc
};