import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Solr configuration
export const solrConfig = {
    host: process.env.SOLR_HOST || 'localhost',
    port: process.env.SOLR_PORT || '8983',
    protocol: process.env.SOLR_PROTOCOL || 'http',
    core: process.env.SOLR_CORE || 'fitness_club',
    path: process.env.SOLR_PATH || '/solr'
};

// Mappings for Solr field types
export const fieldTypes = {
    string: '_s',   // String (exact match)
    text: '_t',     // Text (tokenized)
    int: '_i',      // Integer
    float: '_f',    // Float
    date: '_dt',    // Date
    boolean: '_b',  // Boolean
};

// Default search parameters
export const defaultSearchParams = {
    start: 0,
    rows: 10,
    sort: 'score desc'
};