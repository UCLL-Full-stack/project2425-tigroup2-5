import searchService from '../service/search.service';

/**
 * Script to perform a full reindexing of all entities in Solr
 * Run with: npm run reindex
 */
async function reindexAll() {
  console.log('Starting full Solr reindexing...');
  
  try {
    // Clear existing index
    console.log('Clearing existing index...');
    
    // Reindex all entities
    console.log('Indexing members...');
    await searchService.indexAllMembers();
    
    console.log('Indexing clubs...');
    await searchService.indexAllClubs();
    
    console.log('Indexing employees...');
    await searchService.indexAllEmployees();
    
    console.log('Reindexing completed successfully!');
  } catch (error) {
    console.error('Reindexing failed:', error);
    process.exit(1);
  }
}

reindexAll();